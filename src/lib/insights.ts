import type { Scores } from './types'

export type ActionOption = {
  type: 'article' | 'vip' | 'none'
  label: string
  description: string
  ref?: string        // article slug for auto-closeable tasks
}

export type InsightCard = {
  axis: string
  axisLabel: string
  emoji: string
  score: number
  title: string
  body: string
  actions: ActionOption[]
}

type InsightDef = {
  axis: keyof Scores['axes']
  priority: number      // lower = shown first (easiest to act on)
  axisLabel: string
  emoji: string
  title: string
  body: (s: Scores) => string
  actions: ActionOption[]
}

const DEFS: InsightDef[] = [
  {
    axis: 'governance',
    priority: 1,
    axisLabel: 'ממשל פנימי',
    emoji: '📋',
    title: 'החברה המשפחתית שלכם עדיין לא מנהלת ישיבות קבועות',
    body: () =>
      'זוגות שמקיימים ישיבת דירקטוריון חודשית של 30 דקות מבצעים פי שלושה יותר החלטות פיננסיות. הישיבה שאתם עושים עכשיו היא כבר הצעד הראשון — הנה הצעד השני.',
    actions: [
      { type: 'article', label: '📖 קרא מאמר', description: 'על גמל להשקעה — כלי חיסכון שרוב הזוגות מפספסים', ref: 'gamel-lehashkaa' },
      { type: 'vip',     label: '📞 שיחת VIP',  description: 'תכנן עם יועץ את לוח השנה הפיננסי שלכם' },
      { type: 'none',    label: 'מסתדרים לבד',  description: '' },
    ],
  },
  {
    axis: 'risk',
    priority: 2,
    axisLabel: 'ניהול סיכון',
    emoji: '🛡️',
    title: 'הכיסוי הביטוחי שלכם חלקי',
    body: (s) => {
      const covered = Math.round(s.axes.risk / 25)
      return `מתוך 4 ביטוחים עיקריים יש לכם ${covered}. ביטוח חיים ואובדן כושר עבודה מגנים על ההכנסה ועל המשפחה — הם הבסיס שכל חברה משפחתית צריכה לפני כל השקעה אחרת.`
    },
    actions: [
      { type: 'article', label: '📖 קרא מאמר', description: 'מה זה ביטוח חיים ומתי הוא קריטי', ref: 'bituach-chaim' },
      { type: 'vip',     label: '📞 שיחת VIP',  description: 'בדוק עם יועץ אם הכיסוי הקיים מספיק לצרכים שלכם' },
      { type: 'none',    label: 'לא עכשיו',      description: '' },
    ],
  },
  {
    axis: 'capital',
    priority: 3,
    axisLabel: 'הקצאת הון',
    emoji: '💰',
    title: 'קרן החירום שלכם זקוקה לחיזוק',
    body: (s) => {
      const m = s.metrics.monthsOfSurvival
      if (m < 1) return 'אין לכם קרן חירום נזילה. הוצאה בלתי צפויה אחת — תיקון רכב, מחלה, פיטורים — יכולה להפיל אתכם למינוס. הצעד הראשון: פתחו חשבון נפרד והתחילו לצבור אפילו ₪500 בחודש.'
      return `קרן החירום שלכם מכסה ${m.toFixed(1)} חודשים. המינימום הוא 3, המומלץ הוא 6. זו הרשת שמאפשרת לכם לקחת סיכונים חכמים בכל שאר התחומים.`
    },
    actions: [
      { type: 'article', label: '📖 קרא מאמר', description: 'על קרן השתלמות — כלי החיסכון הכי משתלם בישראל', ref: 'keren-hishtalmut' },
      { type: 'vip',     label: '📞 שיחת VIP',  description: 'בנה תוכנית הקצאת הון נכונה עם יועץ מסוכנות 360' },
      { type: 'none',    label: 'לא עכשיו',      description: '' },
    ],
  },
  {
    axis: 'operational',
    priority: 4,
    axisLabel: 'יעילות תפעולית',
    emoji: '📊',
    title: 'התזרים החודשי שלכם לא מנוצל מספיק',
    body: (s) => {
      const rate = Math.round(s.metrics.savingsRate * 100)
      if (rate <= 0) return 'ההוצאות שלכם גבוהות מההכנסות — לפחות על הנייר. לפני שמדברים על השקעות, צריך להבין לאן הולך הכסף ולמצוא מקומות לחסוך.'
      return `שיעור החיסכון שלכם עומד על ${rate}% מההכנסה. היעד המינימלי לבריאות פיננסית הוא 10%, ומומלץ 20%. כל אחוז נוסף צובר ריבית דריבית ומשנה את העתיד.`
    },
    actions: [
      { type: 'article', label: '📖 קרא מאמר', description: 'על גמל להשקעה — חיסכון גמיש עם הטבות מס', ref: 'gamel-lehashkaa' },
      { type: 'vip',     label: '📞 שיחת VIP',  description: 'מצא עם יועץ איפה אפשר לחסוך יותר מבלי להרגיש את זה' },
      { type: 'none',    label: 'לא עכשיו',      description: '' },
    ],
  },
  {
    axis: 'incomeStructure',
    priority: 5,
    axisLabel: 'מבנה הכנסה',
    emoji: '💼',
    title: 'כל ההכנסה שלכם מגיעה ממקור אחד',
    body: () =>
      'תלות במקור הכנסה יחיד היא הסיכון הגדול ביותר של המשפחה הישראלית. פיטורים, מחלה, או שינוי בשוק — ואין גיבוי. המטרה היא להתחיל לפתח מקור נוסף, גם אם קטן.',
    actions: [
      { type: 'article', label: '📖 קרא מאמר', description: 'על גמל להשקעה כהכנסה פסיבית עתידית', ref: 'gamel-lehashkaa' },
      { type: 'vip',     label: '📞 שיחת VIP',  description: 'תכנן עם יועץ איך לגוון את מקורות ההכנסה שלכם' },
      { type: 'none',    label: 'לא עכשיו',      description: '' },
    ],
  },
  {
    axis: 'horizon',
    priority: 6,
    axisLabel: 'אופק פנסיוני',
    emoji: '🔭',
    title: 'הפנסיה הצפויה שלכם לא תספיק',
    body: (s) => {
      const ratio = Math.round(s.metrics.replacementRatio * 100)
      if (ratio === 0) return 'לא הצלחנו לאמוד את הפנסיה הצפויה שלכם. כדאי לבדוק דרך המסלקה הפנסיונית מה הצבירה ומה הקצבה הצפויה — ואז לקבל תמונה ברורה.'
      return `הקצבה הפנסיונית הצפויה שלכם מכסה כ-${ratio}% מהוצאות החיים הנוכחיות. בלי פעולה היום, תצטרכו לצמצם משמעותית את אורח החיים בגיל פרישה.`
    },
    actions: [
      { type: 'article', label: '📖 קרא מאמר', description: 'על קרן פנסיה — כל מה שצריך לדעת', ref: 'keren-pensiya' },
      { type: 'vip',     label: '📞 שיחת VIP',  description: 'קבל תכנית פנסיונית מותאמת אישית מסוכנות 360' },
      { type: 'none',    label: 'לא עכשיו',      description: '' },
    ],
  },
]

export function buildInsightCards(scores: Scores, maxCount = 3): InsightCard[] {
  return DEFS
    .filter(def => scores.axes[def.axis] < 70)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxCount)
    .map(def => ({
      axis: def.axis,
      axisLabel: def.axisLabel,
      emoji: def.emoji,
      score: scores.axes[def.axis],
      title: def.title,
      body: def.body(scores),
      actions: def.actions,
    }))
}
