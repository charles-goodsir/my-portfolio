/// <reference types="vite/client" />

// vite/client already types png/jpg/jpeg/webp/svg imports.
declare module '*.pdf' {
  const src: string
  export default src
}
