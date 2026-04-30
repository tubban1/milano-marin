import 'server-only'
import { getDefaultContent, PageKey } from '@/content/defaults'
import { locales } from '@/i18n/config'
import { query } from '@/lib/db'

const ensureLocale = (locale: string) =>
  locales.includes(locale as any) ? locale : locales[0]

export async function readPageContent<T>(page: PageKey, locale: string, defaults?: T): Promise<T> {
  const safeLocale = ensureLocale(locale)

  try {
    const results = await query(
      'SELECT content FROM milano_marin_page_content WHERE page_key = ? AND locale = ?',
      [page, safeLocale]
    ) as any[]

    if (results && results.length > 0) {
      const content = results[0].content
      const parsedContent = (typeof content === 'string' ? JSON.parse(content) : content) as T
      return parsedContent
    }
  } catch (error: any) {
    console.error(`[readPageContent] ❌ Error for ${page} (${safeLocale}):`, error?.message)
  }

  return (defaults ?? (getDefaultContent(page, safeLocale) as T)) as T
}

export async function writePageContent<T>(page: PageKey, locale: string, data: T) {
  const safeLocale = ensureLocale(locale)
  const contentJson = JSON.stringify(data)

  await query(
    `INSERT INTO milano_marin_page_content (page_key, locale, content)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       content = VALUES(content),
       updated_at = CURRENT_TIMESTAMP`,
    [page, safeLocale, contentJson]
  )
}
