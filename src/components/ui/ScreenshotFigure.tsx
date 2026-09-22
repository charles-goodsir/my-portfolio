import { useRef } from 'react'

interface ScreenshotFigureProps {
  src: string
  alt: string
  width: number
  height: number
  /** One image per long page may load eagerly with high priority. */
  priority?: boolean
  caption?: string
  className?: string
}

function ScreenshotFigure({
  src,
  alt,
  width,
  height,
  priority = false,
  caption,
  className = '',
}: ScreenshotFigureProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <figure className={className}>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="block w-full cursor-zoom-in"
        aria-label={`View larger: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          style={{ aspectRatio: `${width} / ${height}` }}
          className="w-full h-auto max-w-full rounded-lg border border-line bg-sunken"
        />
      </button>
      {caption && (
        <figcaption className="mt-2 text-xs text-ink-muted">{caption}</figcaption>
      )}
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close()
        }}
        className="m-auto max-h-[90vh] max-w-[90vw] bg-transparent p-0 backdrop:bg-black/80"
      >
        <img
          src={src}
          alt={alt}
          className="block max-h-[90vh] max-w-[90vw] rounded-lg cursor-zoom-out"
          onClick={() => dialogRef.current?.close()}
        />
      </dialog>
    </figure>
  )
}

export default ScreenshotFigure
