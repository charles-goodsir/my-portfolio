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
  return (
    <figure className={className}>
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
      {caption && (
        <figcaption className="mt-2 text-xs text-ink-muted">{caption}</figcaption>
      )}
    </figure>
  )
}

export default ScreenshotFigure
