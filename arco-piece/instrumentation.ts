import express from "express";
import { ContainerRegistrationKeys, FeatureFlag, Modules } from "@medusajs/framework/utils";

type ScopeLike = {
	resolve: (token: string) => unknown;
};

type ScopedRequest = {
	path: string;
	scope?: ScopeLike;
};

type InviteLike = {
	token: string;
	accepted: boolean;
	expires_at: string | Date;
	created_at: string | Date;
};

const INVITE_CACHE_TTL_MS = 1000 * 60 * 5;

let cachedInvite: { token: string; cachedAt: number } | null = null;
let alreadyPatched = false;

const getOnboardingAdminEmail = () =>
	process.env.ADMIN_ONBOARDING_EMAIL ??
	process.env.MEDUSA_ADMIN_ONBOARDING_EMAIL ??
	"";

const isInviteStillValid = (invite: InviteLike) => {
	const expiresAt = new Date(invite.expires_at).getTime();

	return !invite.accepted && Number.isFinite(expiresAt) && expiresAt > Date.now();
};

const getCachedInviteToken = () => {
	if (!cachedInvite) {
		return null;
	}

	if (Date.now() - cachedInvite.cachedAt > INVITE_CACHE_TTL_MS) {
		cachedInvite = null;
		return null;
	}

	return cachedInvite.token;
};

const setCachedInviteToken = (token: string) => {
	cachedInvite = {
		token,
		cachedAt: Date.now(),
	};
};

const getSuperAdminRoleIds = async (scope: ScopeLike): Promise<string[]> => {
	if (!FeatureFlag.isFeatureEnabled("rbac")) {
		return [];
	}

	const rbacModule = scope.resolve(Modules.RBAC) as {
		listRbacRoles: (filters: { id: string }) => Promise<Array<{ id: string }>>;
	};

	const roles = await rbacModule.listRbacRoles({ id: "role_super_admin" });

	if (!roles.length) {
		return [];
	}

	return [roles[0].id];
};

const getLatestPendingInviteToken = async (
	scope: ScopeLike
): Promise<string | null> => {
	const onboardingEmail = getOnboardingAdminEmail();

	const userModule = scope.resolve(Modules.USER) as {
		listAndCountInvites: (
			filters?: Record<string, unknown>,
			config?: Record<string, unknown>
		) => Promise<[InviteLike[], number]>;
	};

	const [invites] = await userModule.listAndCountInvites(
		onboardingEmail ? { email: onboardingEmail } : {},
		{
			take: 25,
		}
	);

	const latestPendingInvite = invites
		.filter(isInviteStillValid)
		.sort(
			(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		)[0];

	return latestPendingInvite?.token ?? null;
};

const createInviteToken = async (scope: ScopeLike): Promise<string | null> => {
	const email = getOnboardingAdminEmail();

	if (!email) {
		return null;
	}

	const workflowEngine = scope.resolve(Modules.WORKFLOW_ENGINE) as {
		run: (
			workflowId: string,
			input: Record<string, unknown>
		) => Promise<{ result?: Array<{ token?: string }> }>;
	};

	const roles = await getSuperAdminRoleIds(scope);

	const { result } = await workflowEngine.run("create-invite-step", {
		input: {
			invites: [
				{
					email,
					roles,
				},
			],
		},
	});

	return result?.[0]?.token ?? null;
};

const ensureFirstAdminInviteToken = async (
	scope: ScopeLike
): Promise<string | null> => {
	const cachedToken = getCachedInviteToken();

	if (cachedToken) {
		return cachedToken;
	}

	const existingToken = await getLatestPendingInviteToken(scope);

	if (existingToken) {
		setCachedInviteToken(existingToken);
		return existingToken;
	}

	const createdToken = await createInviteToken(scope);

	if (createdToken) {
		setCachedInviteToken(createdToken);
	}

	return createdToken;
};

const firstAdminRedirectGuard = async (
	req: ScopedRequest,
	res: { redirect: (status: number, url: string) => void },
	next: () => void
) => {
	// This middleware runs under the "/app" mount, so "/login" is the target path.
	if (req.path !== "/login") {
		return next();
	}

	if (!req.scope) {
		return next();
	}

	try {
		const userModule = req.scope.resolve(Modules.USER) as {
			listAndCountUsers: (
				filters?: Record<string, unknown>,
				config?: Record<string, unknown>
			) => Promise<[Array<{ id: string }>, number]>;
		};

		const [, userCount] = await userModule.listAndCountUsers(
			{},
			{
				take: 1,
			}
		);

		if (userCount > 0) {
			return next();
		}

		const inviteToken = await ensureFirstAdminInviteToken(req.scope);

		if (!inviteToken) {
			const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER) as {
				warn: (message: string) => void;
			};

			logger.warn(
				"No admin user exists and no onboarding invite token is available. Set ADMIN_ONBOARDING_EMAIL or MEDUSA_ADMIN_ONBOARDING_EMAIL to auto-create the first admin invite."
			);

			return next();
		}

		return res.redirect(302, `/app/invite?token=${encodeURIComponent(inviteToken)}`);
	} catch (error) {
		const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER) as {
			warn: (message: string) => void;
		};

		logger.warn(
			`Failed to run first-admin onboarding redirect guard: ${
				error instanceof Error ? error.message : "unknown error"
			}`
		);

		return next();
	}
};

export function register() {
	if (alreadyPatched) {
		return;
	}

	alreadyPatched = true;

	const originalUse = express.application.use;

	express.application.use = function patchedUse(...args: unknown[]) {
		if (args[0] === "/app") {
			const handlers = args.slice(1);
			return originalUse.call(this, "/app", firstAdminRedirectGuard, ...handlers);
		}

		return originalUse.apply(this, args as any);
	};
}