import { Link } from 'react-router'
import type { DiaryEntry } from '../data/cyberDiaryEntries'
import { formatDate, resolveScreenshot, scriptMap } from './diaryAssets'

interface DiaryArticleProps {
  entry: DiaryEntry
  /** When true, the title links to the entry's own page. */
  linked?: boolean
  /** Heading level for the entry title. 'h1' on the standalone entry page. */
  titleAs?: 'h1' | 'h3'
}

function DiaryArticle({
  entry,
  linked = false,
  titleAs = 'h3',
}: DiaryArticleProps) {
  const Title = titleAs
  return (
    <article
      id={entry.id}
      className="bg-card border border-line rounded-lg shadow-card overflow-hidden"
    >
      <div className="bg-sunken border-b border-line px-6 py-4">
        <time
          dateTime={entry.date}
          className="text-sm font-medium text-primary"
        >
          {formatDate(entry.date)}
        </time>
        <Title className="text-xl font-bold text-ink mt-1">
          {linked ? (
            <Link
              to={`/diary/${entry.id}`}
              className="hover:text-primary underline-offset-2 hover:underline"
            >
              {entry.title}
            </Link>
          ) : (
            entry.title
          )}
        </Title>
        <span className="inline-block mt-2 bg-primary/10 text-primary px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
          {entry.category}
        </span>
        {entry.milestone && (
          <span className="inline-block mt-2 ml-2 bg-success/10 text-success px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
            ✓ Path complete
          </span>
        )}
      </div>

      <div className="px-6 py-5 space-y-5">
        <div>
          <h4 className="text-sm font-semibold text-ink uppercase tracking-wide mb-2">
            What I worked on
          </h4>
          <ul className="space-y-1.5">
            {entry.workedOn.map((item) => (
              <li
                key={item}
                className="text-ink-muted text-sm flex items-start"
              >
                <span className="text-primary mr-2 mt-0.5 shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {entry.body.length > 0 && (
          <div className="space-y-3">
            {entry.body.map((paragraph, index) => (
              <p
                key={`${entry.id}-body-${index}`}
                className="text-ink-muted text-sm leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {entry.codeSnippets && entry.codeSnippets.length > 0 && (
          <div className="space-y-3">
            {entry.codeSnippets.map((snippet, index) => (
              <div key={`${entry.id}-code-${index}`}>
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">
                  {snippet.label}
                </p>
                <pre className="bg-slate-900 text-slate-100 text-xs rounded p-3 overflow-x-auto whitespace-pre font-mono leading-relaxed">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}

        {entry.screenshot && resolveScreenshot(entry.screenshot) && (
          <img
            src={resolveScreenshot(entry.screenshot)}
            alt={`${entry.title} screenshot`}
            loading="lazy"
            decoding="async"
            className="rounded border border-line w-full h-auto"
          />
        )}

        {entry.screenshots && entry.screenshots.length > 0 && (
          <div className="space-y-3">
            {entry.screenshots.map(
              (screenshot) =>
                resolveScreenshot(screenshot) && (
                  <img
                    key={screenshot}
                    src={resolveScreenshot(screenshot)}
                    alt={`${entry.title} screenshot`}
                    loading="lazy"
                    decoding="async"
                    className="rounded border border-line w-full h-auto"
                  />
                ),
            )}
          </div>
        )}
        {entry.labs && entry.labs.length > 0 && (
          <div className="space-y-6 pt-1">
            {entry.labs.map((lab, index) => (
              <div
                key={`${entry.id}-lab-${index}`}
                className="border border-line rounded-lg overflow-hidden"
              >
                <h4 className="bg-sunken px-4 py-2.5 text-sm font-semibold text-ink border-b border-line">
                  {lab.title}
                </h4>
                <div className="px-4 py-3 space-y-3">
                  <ul className="space-y-1.5">
                    {lab.notes.map((note, noteIndex) => (
                      <li
                        key={`${entry.id}-lab-${index}-note-${noteIndex}`}
                        className="text-ink-muted text-sm flex items-start"
                      >
                        <span className="text-primary mr-2 mt-0.5 shrink-0">
                          •
                        </span>
                        {note}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">
                      Solution
                    </p>
                    <pre className="bg-slate-900 text-slate-100 text-xs rounded p-3 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                      {lab.solution}
                    </pre>
                  </div>
                  {((lab.screenshot && resolveScreenshot(lab.screenshot)) ||
                    (lab.screenshots &&
                      lab.screenshots.some((s) => resolveScreenshot(s)))) && (
                    <div>
                      <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">
                        Screenshot
                      </p>
                      <div className="space-y-3">
                        {[
                          ...(lab.screenshot ? [lab.screenshot] : []),
                          ...(lab.screenshots ?? []),
                        ].map(
                          (shot) =>
                            resolveScreenshot(shot) && (
                              <img
                                key={shot}
                                src={resolveScreenshot(shot)}
                                alt={lab.title}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-auto rounded"
                              />
                            ),
                        )}
                      </div>
                    </div>
                  )}
                  {lab.script && scriptMap[lab.script] && (
                    <div>
                      <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">
                        Script
                      </p>
                      <pre className="bg-slate-900 text-slate-100 text-xs rounded p-3 overflow-x-auto whitespace-pre font-mono leading-relaxed">
                        <code>{scriptMap[lab.script]}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {((entry.tools?.length ?? 0) > 0 || (entry.tags?.length ?? 0) > 0) && (
          <div className="flex flex-wrap gap-4 pt-1">
            {entry.tools && entry.tools.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide mr-2">
                  Tools
                </span>
                {entry.tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-block bg-sunken text-ink-muted px-2 py-0.5 rounded text-xs mr-1.5 mb-1"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
            {entry.tags && entry.tags.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide mr-2">
                  Tags
                </span>
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-sunken text-primary px-2 py-0.5 rounded text-xs mr-1.5 mb-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {(entry.link || (entry.links && entry.links.length > 0)) && (
          <div className="flex flex-col items-start gap-1.5 pt-1">
            {[
              ...(entry.link ? [entry.link] : []),
              ...(entry.links ?? []),
            ].map((ref) => (
              <a
                key={ref.url}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm font-medium underline underline-offset-2"
              >
                {ref.label} →
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default DiaryArticle
