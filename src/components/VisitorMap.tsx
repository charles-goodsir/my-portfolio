import { Link } from 'react-router'
import WorldMap, { type ISOCode } from 'react-svg-worldmap'
import SectionHeader from './ui/SectionHeader'
import Card from './ui/Card'
import { useVisitorStats } from './useVisitorStats'

function VisitorMap() {
  const stats = useVisitorStats()

  const data = stats
    ? Object.entries(stats.byCountry)
        .filter(([code]) => code !== 'XX')
        .map(([country, value]) => ({
          country: country as ISOCode,
          value,
        }))
    : []

  return (
    <section className="max-w-[45rem] mx-auto py-16 px-4">
      <SectionHeader
        title="Visitors"
        intro="An anonymous, country-level visit counter - no IP addresses or personal data are stored, just aggregate counts per country."
      />
      <Card className="text-center">
        <p className="text-ink-muted mb-6">
          {stats ? (
            <>
              <span className="text-3xl font-bold text-ink">
                {stats.total}
              </span>{' '}
              total visits
            </>
          ) : (
            'Loading...'
          )}
        </p>
        <div className="flex justify-center overflow-x-auto">
          <WorldMap
            backgroundColor="transparent"
            size="responsive"
            data={data}
            valueSuffix=" visits"
            styleFunction={({ countryValue, maxValue }) => ({
              fill:
                countryValue === undefined
                  ? 'var(--color-sunken)'
                  : 'var(--color-primary)',
              fillOpacity:
                countryValue === undefined
                  ? 1
                  : Math.max(0.35, countryValue / maxValue),
              stroke: 'var(--color-line)',
              strokeWidth: 0.5,
            })}
          />
        </div>
        <Link
          to="/visitors/risk-assessment"
          className="mt-6 inline-block text-primary text-sm font-medium hover:underline underline-offset-2"
        >
          Risk assessment for this feature →
        </Link>
      </Card>
    </section>
  )
}

export default VisitorMap
