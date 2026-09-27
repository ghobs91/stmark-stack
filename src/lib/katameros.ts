const COPTIC_MONTHS = [
  'Thout',
  'Paopi',
  'Hathor',
  'Kiahk',
  'Tobi',
  'Meshir',
  'Paremhat',
  'Paremoude',
  'Pashons',
  'Paoni',
  'Epip',
  'Mesori',
  'Nasie',
]

export type CopticDate = {
  year: number
  month: number
  monthName: string
  day: number
}

export type DailyReadings = {
  date: string
  coptic: CopticDate
  verse: string
  verseReference: string
  saints: string[]
  source: 'api' | 'fallback'
}

/**
 * Approximate Coptic calendar date. The Coptic new year (Thout 1) falls on
 * September 11 (or 12 in the Gregorian year preceding a Coptic leap year).
 */
export function getCopticDate(date: Date = new Date()): CopticDate {
  const year = date.getFullYear()
  const newYear = new Date(year, 8, 11) // September 11 of the current year
  const reference = date >= newYear ? newYear : new Date(year - 1, 8, 11)
  const copticYear = reference.getFullYear() - 283

  const dayOfYear = Math.floor((date.getTime() - reference.getTime()) / 86_400_000)
  const month = Math.floor(dayOfYear / 30)
  const day = (dayOfYear % 30) + 1

  return {
    year: copticYear,
    month,
    monthName: COPTIC_MONTHS[month] ?? 'Nasie',
    day,
  }
}

const FALLBACK_VERSES = [
  { verse: 'The Lord is my shepherd; I shall not want.', reference: 'Psalm 23:1' },
  { verse: 'I can do all things through Christ who strengthens me.', reference: 'Philippians 4:13' },
  {
    verse: 'Come to Me, all you who labor and are heavy laden, and I will give you rest.',
    reference: 'Matthew 11:28',
  },
  {
    verse: 'Your word is a lamp to my feet and a light to my path.',
    reference: 'Psalm 119:105',
  },
  {
    verse: 'Behold, I am with you always, even to the end of the age.',
    reference: 'Matthew 28:20',
  },
  {
    verse: 'The Lord is my light and my salvation; whom shall I fear?',
    reference: 'Psalm 27:1',
  },
  {
    verse: 'Let your light so shine before men, that they may see your good works.',
    reference: 'Matthew 5:16',
  },
]

const dayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000)
}

/**
 * Fetches the daily Katameros readings when an upstream API is configured via
 * KATAMEROS_API_URL, otherwise returns a locally curated fallback so the home
 * page always renders a verse and Coptic date.
 */
export async function getDailyReadings(date: Date = new Date()): Promise<DailyReadings> {
  const coptic = getCopticDate(date)
  const isoDate = date.toISOString().slice(0, 10)
  const fallbackVerse = FALLBACK_VERSES[dayOfYear(date) % FALLBACK_VERSES.length]

  const baseUrl = process.env.KATAMEROS_API_URL
  if (baseUrl) {
    try {
      const url = `${baseUrl.replace(/\/$/, '')}/readings?date=${isoDate}`
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (res.ok) {
        const data = (await res.json()) as {
          verse?: string
          reference?: string
          saints?: string[]
        }
        if (data.verse) {
          return {
            date: isoDate,
            coptic,
            verse: data.verse,
            verseReference: data.reference ?? '',
            saints: data.saints ?? [],
            source: 'api',
          }
        }
      }
    } catch {
      // Fall through to the local fallback below.
    }
  }

  return {
    date: isoDate,
    coptic,
    verse: fallbackVerse.verse,
    verseReference: fallbackVerse.reference,
    saints: [],
    source: 'fallback',
  }
}

export const formatCopticDate = (coptic: CopticDate) =>
  `${coptic.day} ${coptic.monthName} ${coptic.year} A.M.`
