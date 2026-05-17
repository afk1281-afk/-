import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `אתה יועץ פיננסי דיגיטלי של מערכת ההפעלה הפיננסית — אפליקציה שפותחה על ידי סוכנות 360 של אבי סהלו.
המשתמשים הם משפחות ישראליות עם הכנסה חודשית של 20,000 ש"ח ומעלה.
המערכת מודדת 6 צירים: מבנה הכנסה, יעילות תפעולית, הקצאת הון, ניהול סיכון, אופק פנסיוני, ממשל פנימי.

הסגנון שלך:
- עברית פשוטה, חמה, ישירה — כמו יועץ שמכיר אותם
- תשובות קצרות וממוקדות (3-5 משפטים)
- לא מכירתי, לא דחפני — מסביר ומחנך בלבד
- כשיש שאלה שדורשת ייעוץ אישי, מפנה לשיחת Wealth Mapping עם סוכנות 360`

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ text: 'שירות הצ\'אט אינו מוגדר כרגע.' }, { status: 503 })
  }

  const { messages } = await req.json()

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages,
    }),
  })

  const data = await res.json()
  const text = data.content?.[0]?.text ?? 'סליחה, לא הצלחתי להבין.'
  return NextResponse.json({ text })
}
