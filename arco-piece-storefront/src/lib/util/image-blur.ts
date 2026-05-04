// Tiny inline SVG used as a blur placeholder for remote product images.
// Stays neutral so it works under both light and dark modes — Next.js
// renders this scaled-up + blurred until the real image is decoded.
//
// Decoded SVG:
//   <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8">
//     <rect width="8" height="8" fill="#f3e7cf" />
//   </svg>
export const ARC_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmM2U3Y2YiIC8+PC9zdmc+"
