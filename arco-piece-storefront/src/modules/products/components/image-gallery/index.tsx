"use client"

import { Dialog, Transition } from "@headlessui/react"
import { ARC_BLUR_DATA_URL } from "@lib/util/image-blur"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import Image from "next/image"
import { Fragment, useCallback, useEffect, useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ChevronLeft = () => (
  <svg
    viewBox="0 0 24 24"
    width={20}
    height={20}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRight = () => (
  <svg
    viewBox="0 0 24 24"
    width={20}
    height={20}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width={22}
    height={22}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const ZoomIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width={18}
    height={18}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
  </svg>
)

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const validImages = images.filter((img) => Boolean(img.url))
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % Math.max(validImages.length, 1))
  }, [validImages.length])

  const prev = useCallback(() => {
    setActiveIndex(
      (i) => (i - 1 + validImages.length) % Math.max(validImages.length, 1)
    )
  }, [validImages.length])

  useEffect(() => {
    if (!lightboxOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next()
      if (event.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightboxOpen, next, prev])

  if (validImages.length === 0) return null

  const activeImage = validImages[activeIndex]

  return (
    <div className="flex flex-col gap-3 small:gap-4 small:mx-16">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group relative aspect-[29/34] w-full overflow-hidden rounded-2xl border border-arc-divider bg-arc-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-accent)] focus-visible:ring-offset-2"
        aria-label="Agrandir l’image"
      >
        {activeImage?.url && (
          <Image
            key={activeImage.id}
            src={activeImage.url}
            alt={`Image produit ${activeIndex + 1}`}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 576px) 100vw, (max-width: 992px) 60vw, 800px"
            placeholder="blur"
            blurDataURL={ARC_BLUR_DATA_URL}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-arc-surface/90 backdrop-blur border border-arc-divider text-arc-ink opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ZoomIcon />
        </span>
      </button>

      {validImages.length > 1 && (
        <div
          role="tablist"
          aria-label="Miniatures du produit"
          className="flex flex-wrap gap-2 small:gap-3"
        >
          {validImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex ? "true" : "false"}
              onClick={() => setActiveIndex(index)}
              className={clx(
                "relative h-16 w-16 small:h-20 small:w-20 overflow-hidden rounded-lg border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-accent)] focus-visible:ring-offset-2",
                index === activeIndex
                  ? "border-[var(--arc-accent)]"
                  : "border-arc-divider hover:border-arc-muted"
              )}
            >
              {image.url && (
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="80px"
                  placeholder="blur"
                  blurDataURL={ARC_BLUR_DATA_URL}
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <Transition show={lightboxOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={closeLightbox}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/90 backdrop-blur" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-5xl">
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="absolute -top-12 right-0 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Fermer"
                >
                  <CloseIcon />
                </button>
                <div className="relative aspect-[29/34] w-full max-h-[90vh]">
                  {activeImage?.url && (
                    <Image
                      key={`lb-${activeImage.id}`}
                      src={activeImage.url}
                      alt={`Image produit ${activeIndex + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      className="object-contain"
                    />
                  )}
                  {validImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prev}
                        aria-label="Image précédente"
                        className="absolute left-2 small:left-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        type="button"
                        onClick={next}
                        aria-label="Image suivante"
                        className="absolute right-2 small:right-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <ChevronRight />
                      </button>
                    </>
                  )}
                </div>
                {validImages.length > 1 && (
                  <p className="mt-3 text-center text-xs text-white/70">
                    {activeIndex + 1} / {validImages.length}
                  </p>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default ImageGallery
