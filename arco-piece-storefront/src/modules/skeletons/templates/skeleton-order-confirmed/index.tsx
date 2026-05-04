import SkeletonOrderConfirmedHeader from "@modules/skeletons/components/skeleton-order-confirmed-header"
import SkeletonOrderInformation from "@modules/skeletons/components/skeleton-order-information"
import SkeletonOrderItems from "@modules/skeletons/components/skeleton-order-items"

const SkeletonOrderConfirmed = () => {
  return (
    <div className="bg-arc-background py-8 small:py-12 min-h-[calc(100vh-64px)] animate-pulse">
      <div className="content-container flex justify-center">
        <div className="max-w-4xl h-full w-full rounded-3xl border border-arc-divider bg-arc-surface p-6 small:p-10">
          <SkeletonOrderConfirmedHeader />

          <SkeletonOrderItems />

          <SkeletonOrderInformation />
        </div>
      </div>
    </div>
  )
}

export default SkeletonOrderConfirmed
