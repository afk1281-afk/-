'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Briefcase, Receipt, CreditCard, PiggyBank,
  Compass, Shield, Users, ChevronLeft, ChevronRight, Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { calculateScores, initialFormData } from '@/lib/scoring'
import type { FormData } from '@/lib/types'

// ── Style tokens ──────────────────────────────────────────────
const C = {
  bg: '#F0F4FA',
  bgCard: '#FFFFFF',
  bgWhite: '#FFFFFF',
  bgInput: '#F8FAFD',
  border: '#DDE4EF',
  borderSoft: '#DDE4EF',
  ink: '#0F1923',
  inkSoft: '#4A5A6E',
  inkMute: '#8A9AAB',
  blue: '#1B5FAD',
  orange: '#E8521A',
  error: '#DC2626',
  success: '#16A34A',
}

// ── Reusable input components ─────────────────────────────────

function AmountInput({
  value, onChange, placeholder = '0', autoFocus = false,
}: { value: string; onChange: (v: string) => void; placeholder?: string; autoFocus?: boolean }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
        color: C.inkMute, fontSize: 17, fontFamily: 'var(--font-rubik)', pointerEvents: 'none',
      }}>₪</span>
      <input
        type="number" inputMode="numeric"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          width: '100%', padding: '14px 42px 14px 16px',
          fontSize: 17, fontFamily: 'var(--font-rubik)',
          background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 8,
          color: C.ink, outline: 'none', direction: 'ltr', textAlign: 'right',
          boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={e => { e.target.style.borderColor = C.blue; e.target.style.boxShadow = `0 0 0 3px ${C.blue}18` }}
        onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
      />
    </div>
  )
}

function FieldLabel({ children, helper }: { children: React.ReactNode; helper?: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={{ display: 'block', fontSize: 15, fontFamily: 'var(--font-rubik)', fontWeight: 500, color: C.ink }}>
        {children}
      </label>
      {helper && <div style={{ fontSize: 13, color: C.inkMute, fontFamily: 'var(--font-rubik)', marginTop: 2 }}>{helper}</div>}
    </div>
  )
}

function YesNoButtons({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {([{ val: true, label: 'כן' }, { val: false, label: 'לא' }] as const).map(opt => {
        const active = value === opt.val
        return (
          <button key={String(opt.val)} onClick={() => onChange(opt.val)} style={{
            flex: 1, padding: 14, fontSize: 16, fontFamily: 'var(--font-rubik)', fontWeight: 500,
            background: active ? C.blue : C.bgWhite,
            color: active ? '#FFFFFF' : C.ink,
            border: `1px solid ${active ? C.blue : C.border}`,
            borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
          }}>{opt.label}</button>
        )
      })}
    </div>
  )
}

function ChoiceButtons<T extends string | boolean | null>({
  value, onChange, options,
}: { value: T; onChange: (v: T) => void; options: { val: T; label: string }[] }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {options.map(opt => {
        const active = value === opt.val
        return (
          <button key={String(opt.val)} onClick={() => onChange(opt.val)} style={{
            flex: '1 1 auto', minWidth: 90, padding: '12px 16px',
            fontSize: 15, fontFamily: 'var(--font-rubik)', fontWeight: 500,
            background: active ? C.blue : C.bgWhite,
            color: active ? '#FFFFFF' : C.ink,
            border: `1px solid ${active ? C.blue : C.border}`,
            borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
          }}>{opt.label}</button>
        )
      })}
    </div>
  )
}

function StepHeader({
  stepNumber, totalSteps, icon: Icon, title, subtitle,
}: { stepNumber: number; totalSteps: number; icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-rubik)', fontWeight: 600, color: C.blue, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          שלב {stepNumber} מתוך {totalSteps}
        </div>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, background: C.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={22} color="#FFFFFF" strokeWidth={1.75} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-rubik)', fontSize: 28, fontWeight: 500, color: C.ink, margin: 0, lineHeight: 1.2 }}>
            {title}
          </h2>
          {subtitle && <p style={{ fontFamily: 'var(--font-rubik)', fontSize: 15, color: C.inkSoft, margin: '8px 0 0 0', lineHeight: 1.5 }}>{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

function NavButtons({
  onBack, onNext, nextLabel = 'המשך', canGoNext = true, isLast = false, loading = false,
}: { onBack?: () => void; onNext: () => void; nextLabel?: string; canGoNext?: boolean; isLast?: boolean; loading?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
      {onBack && (
        <button onClick={onBack} style={{
          padding: '14px 24px', fontSize: 15, fontFamily: 'var(--font-rubik)', fontWeight: 500,
          background: '#FFFFFF', color: C.inkSoft, border: `1px solid ${C.border}`,
          borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <ChevronRight size={18} />
          חזרה
        </button>
      )}
      <button onClick={onNext} disabled={!canGoNext || loading} style={{
        flex: 1, padding: '14px 24px', fontSize: 16, fontFamily: 'var(--font-rubik)', fontWeight: 600,
        background: canGoNext && !loading ? C.blue : C.border,
        color: canGoNext && !loading ? '#FFFFFF' : C.inkMute,
        border: 'none', borderRadius: 8,
        cursor: canGoNext && !loading ? 'pointer' : 'not-allowed',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'all 0.15s',
      }}>
        {loading ? 'שומר...' : nextLabel}
        {!loading && (isLast ? <Sparkles size={18} /> : <ChevronLeft size={18} />)}
      </button>
    </div>
  )
}

// ── Step 1: Income ────────────────────────────────────────────
function StepIncome({ data, update, onNext, onBack, stepNumber, totalSteps }: {
  data: FormData['income']; update: (u: Partial<FormData['income']>) => void
  onNext: () => void; onBack: () => void; stepNumber: number; totalSteps: number
}) {
  const canProceed = parseFloat(data.salary1) > 0 || parseFloat(data.salary2) > 0 || parseFloat(data.otherIncome) > 0
  return (
    <div>
      <StepHeader stepNumber={stepNumber} totalSteps={totalSteps} icon={Briefcase}
        title="הברזים של החברה"
        subtitle="כל הכנסה שמגיעה לחברה המשפחתית בחודש ממוצע. אלו הברזים שמזרימים מים לחבית." />
      <div style={{ display: 'grid', gap: 24 }}>
        <div>
          <FieldLabel helper="הכנסה חודשית נטו של המפרנס הראשי">הכנסה ראשונה</FieldLabel>
          <AmountInput value={data.salary1} onChange={v => update({ salary1: v })} placeholder="לדוגמה 14,000" />
          <div style={{ marginTop: 10 }}>
            <ChoiceButtons value={data.salary1Type} onChange={v => update({ salary1Type: v })}
              options={[{ val: 'employee' as const, label: 'שכיר' }, { val: 'selfemployed' as const, label: 'עצמאי' }]} />
          </div>
        </div>
        <div>
          <FieldLabel helper="של בן או בת הזוג, אם רלוונטי">הכנסה שנייה</FieldLabel>
          <AmountInput value={data.salary2} onChange={v => update({ salary2: v })} placeholder="ריק אם אין" />
          <div style={{ marginTop: 10 }}>
            <ChoiceButtons value={data.salary2Type} onChange={v => update({ salary2Type: v })}
              options={[{ val: 'employee' as const, label: 'שכיר' }, { val: 'selfemployed' as const, label: 'עצמאי' }, { val: 'none' as const, label: 'אין' }]} />
          </div>
        </div>
        <div>
          <FieldLabel helper="עבודה צדדית, פרילנס, מענקים קבועים, סיוע משפחתי">הכנסות נוספות</FieldLabel>
          <AmountInput value={data.otherIncome} onChange={v => update({ otherIncome: v })} placeholder="ריק אם אין" />
        </div>
        <div>
          <FieldLabel helper="שכר דירה, דיבידנדים, ריבית מהשקעות">יש לכם הכנסה פסיבית כלשהי?</FieldLabel>
          <YesNoButtons value={data.hasPassive} onChange={v => update({ hasPassive: v })} />
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} canGoNext={canProceed} />
    </div>
  )
}

// ── Step 2: Expenses ──────────────────────────────────────────
function StepExpenses({ data, update, onNext, onBack, stepNumber, totalSteps }: {
  data: FormData['expenses']; update: (u: Partial<FormData['expenses']>) => void
  onNext: () => void; onBack: () => void; stepNumber: number; totalSteps: number
}) {
  const total = Object.values(data).reduce((s, v) => s + (parseFloat(v) || 0), 0)
  const fields: { key: keyof FormData['expenses']; label: string; helper: string }[] = [
    { key: 'housing', label: 'דיור', helper: 'שכירות או החזר משכנתא חודשי' },
    { key: 'utilities', label: 'חשבונות הבית', helper: 'חשמל, מים, גז, אינטרנט, סלולר, ארנונה' },
    { key: 'food', label: 'מזון', helper: 'קניות שבועיות, מסעדות לפעמים' },
    { key: 'car', label: 'רכב', helper: 'דלק, ביטוח, טיפולים, חניה' },
    { key: 'education', label: 'חינוך וילדים', helper: 'גנים, חוגים, צהרון, פעילויות' },
    { key: 'subscriptions', label: 'מינויים דיגיטליים', helper: 'נטפליקס, ספוטיפיי, יוטיוב, אפליקציות' },
    { key: 'leisure', label: 'בילויים ופנאי', helper: 'יציאות, חופשות קטנות, מתנות' },
  ]
  return (
    <div>
      <StepHeader stepNumber={stepNumber} totalSteps={totalSteps} icon={Receipt}
        title="המחלקות התפעוליות"
        subtitle="כאן נמפה את ההוצאות החודשיות הקבועות. אל תכביד על עצמך בדיוק מתמטי." />
      <div style={{ display: 'grid', gap: 20 }}>
        {fields.map(f => (
          <div key={f.key}>
            <FieldLabel helper={f.helper}>{f.label}</FieldLabel>
            <AmountInput value={data[f.key]} onChange={v => update({ [f.key]: v })} placeholder="0" />
          </div>
        ))}
      </div>
      {total > 0 && (
        <div style={{
          marginTop: 24, padding: '16px 20px', background: C.bgWhite,
          border: `1px solid ${C.borderSoft}`, borderRadius: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-rubik)', fontSize: 14, color: C.inkSoft }}>סך הוצאות חודשיות</span>
          <span style={{ fontFamily: 'var(--font-rubik)', fontSize: 22, fontWeight: 500, color: C.ink }}>
            ₪{Math.round(total).toLocaleString('he-IL')}
          </span>
        </div>
      )}
      <NavButtons onBack={onBack} onNext={onNext} canGoNext={total > 0} />
    </div>
  )
}

// ── Step 3: Loans ─────────────────────────────────────────────
function StepLoans({ data, update, onNext, onBack, stepNumber, totalSteps }: {
  data: FormData['loans']; update: (u: Partial<FormData['loans']>) => void
  onNext: () => void; onBack: () => void; stepNumber: number; totalSteps: number
}) {
  return (
    <div>
      <StepHeader stepNumber={stepNumber} totalSteps={totalSteps} icon={CreditCard}
        title="מבנה החוב"
        subtitle="התחייבויות חודשיות. רק החזרים, לא יתרות הקרן. אם אין לכם — השאירו ריק." />
      <div style={{ display: 'grid', gap: 20 }}>
        <div>
          <FieldLabel helper="כולל מסלולים שונים אם יש">החזר משכנתא חודשי</FieldLabel>
          <AmountInput value={data.mortgagePayment} onChange={v => update({ mortgagePayment: v })} />
        </div>
        <div>
          <FieldLabel helper="סך כל ההלוואות הצרכניות מבנקים או חברות חוץ-בנקאיות">החזרי הלוואות אישיות</FieldLabel>
          <AmountInput value={data.personalLoansPayment} onChange={v => update({ personalLoansPayment: v })} />
        </div>
        <div>
          <FieldLabel>החזר הלוואת רכב</FieldLabel>
          <AmountInput value={data.carLoanPayment} onChange={v => update({ carLoanPayment: v })} />
        </div>
        <div>
          <FieldLabel helper="יתרה ממוצעת חודשית שאתם משלמים עליה ריבית">אשראי מתגלגל בכרטיסי אשראי</FieldLabel>
          <AmountInput value={data.creditCardRevolving} onChange={v => update({ creditCardRevolving: v })} />
        </div>
        <div>
          <FieldLabel>באיזו תדירות אתם נכנסים למינוס בעובר ושב?</FieldLabel>
          <ChoiceButtons value={data.overdraftFrequency} onChange={v => update({ overdraftFrequency: v })}
            options={[
              { val: 'never' as const, label: 'אף פעם' },
              { val: 'sometimes' as const, label: 'לפעמים' },
              { val: 'regular' as const, label: 'באופן קבוע' },
            ]} />
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} canGoNext={data.overdraftFrequency !== ''} />
    </div>
  )
}

// ── Step 4: Assets ────────────────────────────────────────────
function StepAssets({ data, update, onNext, onBack, stepNumber, totalSteps }: {
  data: FormData['assets']; update: (u: Partial<FormData['assets']>) => void
  onNext: () => void; onBack: () => void; stepNumber: number; totalSteps: number
}) {
  const fields: { key: keyof FormData['assets']; label: string; helper: string }[] = [
    { key: 'emergencyFund', label: 'חיסכון נזיל לחירום', helper: 'כסף זמין מיידית בעו״ש או חיסכון' },
    { key: 'studyFund', label: 'קרן השתלמות', helper: 'הצבירה הכוללת היום' },
    { key: 'gemel', label: 'קופת גמל להשקעה', helper: 'אם יש' },
    { key: 'securities', label: 'תיק ניירות ערך', helper: 'מניות, אג״ח, קרנות בבנק או בבית השקעות' },
    { key: 'realEstate', label: 'נדל״ן להשקעה', helper: 'שווי משוער של דירות להשקעה' },
  ]
  return (
    <div>
      <StepHeader stepNumber={stepNumber} totalSteps={totalSteps} icon={PiggyBank}
        title="הנכסים של החברה"
        subtitle="כל מה שצברתם עד היום. ההון של החברה המשפחתית מחולק לאופקים שונים." />
      <div style={{ display: 'grid', gap: 20 }}>
        {fields.map(f => (
          <div key={f.key}>
            <FieldLabel helper={f.helper}>{f.label}</FieldLabel>
            <AmountInput value={data[f.key]} onChange={v => update({ [f.key]: v })} placeholder="ריק אם אין" />
          </div>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} canGoNext />
    </div>
  )
}

// ── Step 5: Pension ───────────────────────────────────────────
function StepPension({ data, update, onNext, onBack, stepNumber, totalSteps }: {
  data: FormData['pension']; update: (u: Partial<FormData['pension']>) => void
  onNext: () => void; onBack: () => void; stepNumber: number; totalSteps: number
}) {
  const canProceed = data.knowsPension === true
    ? parseFloat(data.monthlyPayout) > 0
    : data.knowsPension === false
      ? parseFloat(data.age) > 0
      : false

  return (
    <div>
      <StepHeader stepNumber={stepNumber} totalSteps={totalSteps} icon={Compass}
        title="האופק הפנסיוני"
        subtitle="התחנה הסופית של החברה המשפחתית. אם אתם לא יודעים את הקצבה הצפויה, נחשב לכם הערכה." />
      <div>
        <FieldLabel>האם אתם יודעים מה הקצבה החודשית הצפויה שלכם בפנסיה?</FieldLabel>
        <ChoiceButtons<boolean | null> value={data.knowsPension} onChange={v => update({ knowsPension: v })}
          options={[{ val: true, label: 'כן, אני יודע' }, { val: false, label: 'לא, חשבו לי הערכה' }]} />
      </div>

      {data.knowsPension === true && (
        <div style={{ marginTop: 24 }}>
          <FieldLabel helper="הסכום המופיע בדוח השנתי או במסלקה הפנסיונית">קצבה חודשית צפויה בפרישה</FieldLabel>
          <AmountInput value={data.monthlyPayout} onChange={v => update({ monthlyPayout: v })} autoFocus />
        </div>
      )}

      {data.knowsPension === false && (
        <div style={{ marginTop: 24, display: 'grid', gap: 20 }}>
          <div>
            <FieldLabel>גיל נוכחי</FieldLabel>
            <input type="number" inputMode="numeric" value={data.age}
              onChange={e => update({ age: e.target.value })} placeholder="לדוגמה 36" autoFocus
              style={{
                width: '100%', padding: '14px 16px', fontSize: 17, fontFamily: 'var(--font-rubik)',
                background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.ink, outline: 'none', direction: 'rtl', textAlign: 'right', boxSizing: 'border-box',
              }}
              onFocus={e => { e.target.style.borderColor = C.blue; e.target.style.boxShadow = `0 0 0 3px ${C.blue}18` }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
            />
          </div>
          <div>
            <FieldLabel helper="הסכום הכולל הצבור היום בקרנות הפנסיה שלכם">יתרה צבורה היום בפנסיה</FieldLabel>
            <AmountInput value={data.currentBalance} onChange={v => update({ currentBalance: v })} />
          </div>
          <div>
            <FieldLabel helper="הפקדה כוללת של עובד ומעסיק יחד, בדרך כלל 18-22% מהשכר">הפקדה חודשית כוללת לפנסיה</FieldLabel>
            <AmountInput value={data.monthlyContribution} onChange={v => update({ monthlyContribution: v })} />
          </div>
          <div style={{
            padding: '14px 18px', background: `${C.orange}15`, border: `1px solid ${C.orange}60`,
            borderRadius: 8, fontFamily: 'var(--font-rubik)', fontSize: 13, color: C.inkSoft, lineHeight: 1.5,
          }}>
            ההערכה מבוססת על תשואה ריאלית ממוצעת של 4% בשנה עד גיל 67. זוהי הערכה גסה בלבד ואינה תחזית מחייבת.
          </div>
        </div>
      )}

      <NavButtons onBack={onBack} onNext={onNext} canGoNext={canProceed} />
    </div>
  )
}

// ── Step 6: Risk ──────────────────────────────────────────────
function StepRisk({ data, update, onNext, onBack, stepNumber, totalSteps }: {
  data: FormData['risk']; update: (u: Partial<FormData['risk']>) => void
  onNext: () => void; onBack: () => void; stepNumber: number; totalSteps: number
}) {
  const items: { key: keyof FormData['risk']; label: string; helper: string }[] = [
    { key: 'lifeInsurance', label: 'ביטוח חיים', helper: 'מבטיח הכנסה למשפחה במקרה מוות חלילה' },
    { key: 'disability', label: 'אובדן כושר עבודה', helper: 'הכנסה במקרה שלא ניתן יותר לעבוד' },
    { key: 'criticalIllness', label: 'ביטוח מחלות קשות', helper: 'תשלום חד-פעמי באבחון מחלה מהרשימה' },
    { key: 'privateHealth', label: 'ביטוח בריאות פרטי', helper: 'כיסוי משלים מעבר לקופת החולים' },
  ]
  const allAnswered = items.every(item => data[item.key] !== null)
  return (
    <div>
      <StepHeader stepNumber={stepNumber} totalSteps={totalSteps} icon={Shield}
        title="ניהול הסיכון התאגידי"
        subtitle="כל חברה אמיתית מנהלת מחלקת סיכונים. ארבע השאלות הבאות לא בודקות סכומים, רק האם יש לכם כיסוי." />
      <div style={{ display: 'grid', gap: 24 }}>
        {items.map(item => (
          <div key={item.key}>
            <FieldLabel helper={item.helper}>{item.label}</FieldLabel>
            <YesNoButtons value={data[item.key]} onChange={v => update({ [item.key]: v })} />
          </div>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} canGoNext={allAnswered} />
    </div>
  )
}

// ── Step 7: Governance ────────────────────────────────────────
function StepGovernance({ data, update, onNext, onBack, stepNumber, totalSteps, loading }: {
  data: FormData['governance']; update: (u: Partial<FormData['governance']>) => void
  onNext: () => void; onBack: () => void; stepNumber: number; totalSteps: number; loading: boolean
}) {
  const items: { key: keyof FormData['governance']; label: string; helper: string }[] = [
    { key: 'regularMeetings', label: 'אתם נפגשים כזוג באופן קבוע לדבר על כסף?', helper: 'לפחות פעם בחודש, בזמן ייעודי' },
    { key: 'writtenBudget', label: 'יש לכם תקציב כתוב כלשהו?', helper: 'אקסל, אפליקציה, או רישום אחר' },
    { key: 'fiveYearGoals', label: 'יש יעדים פיננסיים מוגדרים לחמש השנים הקרובות?', helper: 'כתובים, עם תאריך יעד וסכום' },
  ]
  const allAnswered = items.every(item => data[item.key] !== null)
  return (
    <div>
      <StepHeader stepNumber={stepNumber} totalSteps={totalSteps} icon={Users}
        title="הממשל הפנימי"
        subtitle="זה הציר שאף אחד לא מודד אבל הוא קובע יותר מכל אחר. איך מתנהלת ישיבת הדירקטוריון שלכם?" />
      <div style={{ display: 'grid', gap: 24 }}>
        {items.map(item => (
          <div key={item.key}>
            <FieldLabel helper={item.helper}>{item.label}</FieldLabel>
            <YesNoButtons value={data[item.key]} onChange={v => update({ [item.key]: v })} />
          </div>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} canGoNext={allAnswered} nextLabel="ראה את הדוח" isLast loading={loading} />
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function AssessmentPage() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [loading, setLoading] = useState(false)

  const TOTAL_STEPS = 7
  const progress = ((stepIndex + 1) / TOTAL_STEPS) * 100

  function updateSection<K extends keyof FormData>(section: K) {
    return (updates: Partial<FormData[K]>) => {
      setFormData(prev => ({ ...prev, [section]: { ...prev[section], ...updates } }))
    }
  }

  const goNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStepIndex(i => i + 1)
  }
  const goBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStepIndex(i => i - 1)
  }
  const goBackToWelcome = () => router.push('/')

  async function handleFinish() {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // Ensure profile exists (in case the DB trigger wasn't set up)
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: user.user_metadata?.full_name ?? null,
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: 'id', ignoreDuplicates: true })

      // Reset is_current on existing assessments (in case DB trigger wasn't set up)
      await supabase
        .from('assessments')
        .update({ is_current: false })
        .eq('user_id', user.id)
        .eq('is_current', true)

      const scores = calculateScores(formData)
      const n = (v: string) => parseFloat(v) || null

      await supabase.from('assessments').insert({
        user_id: user.id,
        salary1: n(formData.income.salary1),
        salary1_type: formData.income.salary1Type || null,
        salary2: n(formData.income.salary2),
        salary2_type: formData.income.salary2Type || null,
        other_income: n(formData.income.otherIncome),
        has_passive_income: formData.income.hasPassive,
        expense_housing: n(formData.expenses.housing),
        expense_utilities: n(formData.expenses.utilities),
        expense_food: n(formData.expenses.food),
        expense_car: n(formData.expenses.car),
        expense_education: n(formData.expenses.education),
        expense_subscriptions: n(formData.expenses.subscriptions),
        expense_leisure: n(formData.expenses.leisure),
        loan_mortgage: n(formData.loans.mortgagePayment),
        loan_personal: n(formData.loans.personalLoansPayment),
        loan_car: n(formData.loans.carLoanPayment),
        loan_credit_card: n(formData.loans.creditCardRevolving),
        overdraft_frequency: formData.loans.overdraftFrequency || null,
        asset_emergency: n(formData.assets.emergencyFund),
        asset_study_fund: n(formData.assets.studyFund),
        asset_gemel: n(formData.assets.gemel),
        asset_securities: n(formData.assets.securities),
        asset_real_estate: n(formData.assets.realEstate),
        pension_knows: formData.pension.knowsPension,
        pension_monthly_payout: n(formData.pension.monthlyPayout),
        pension_age: formData.pension.age ? parseInt(formData.pension.age) : null,
        pension_balance: n(formData.pension.currentBalance),
        pension_monthly_contribution: n(formData.pension.monthlyContribution),
        risk_life_insurance: formData.risk.lifeInsurance,
        risk_disability: formData.risk.disability,
        risk_critical_illness: formData.risk.criticalIllness,
        risk_private_health: formData.risk.privateHealth,
        gov_regular_meetings: formData.governance.regularMeetings,
        gov_written_budget: formData.governance.writtenBudget,
        gov_five_year_goals: formData.governance.fiveYearGoals,
        score_overall: scores.overall,
        score_income_structure: scores.axes.incomeStructure,
        score_operational: scores.axes.operational,
        score_capital: scores.axes.capital,
        score_risk: scores.axes.risk,
        score_horizon: scores.axes.horizon,
        score_governance: scores.axes.governance,
      })

      router.push('/dashboard')
    } catch {
      setLoading(false)
    }
  }

  const stepProps = { stepNumber: stepIndex + 1, totalSteps: TOTAL_STEPS }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: C.bg, fontFamily: 'var(--font-rubik)' }}>
      {/* Top bar with icon + progress */}
      <div style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 100, backgroundColor: '#FFFFFF', borderBottom: '1px solid #DDE4EF' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 56, direction: 'ltr' }}>
          <Image src="/icon.png" alt="360" width={36} height={36} style={{ objectFit: 'contain' }} priority />
        </div>
        <div style={{ height: 3, background: C.border }}>
          <div style={{ height: '100%', width: `${progress}%`, background: C.blue, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '72px 24px 40px' }}>
        {stepIndex === 0 && (
          <StepIncome data={formData.income} update={updateSection('income')}
            onBack={goBackToWelcome} onNext={goNext} {...stepProps} />
        )}
        {stepIndex === 1 && (
          <StepExpenses data={formData.expenses} update={updateSection('expenses')}
            onBack={goBack} onNext={goNext} {...stepProps} />
        )}
        {stepIndex === 2 && (
          <StepLoans data={formData.loans} update={updateSection('loans')}
            onBack={goBack} onNext={goNext} {...stepProps} />
        )}
        {stepIndex === 3 && (
          <StepAssets data={formData.assets} update={updateSection('assets')}
            onBack={goBack} onNext={goNext} {...stepProps} />
        )}
        {stepIndex === 4 && (
          <StepPension data={formData.pension} update={updateSection('pension')}
            onBack={goBack} onNext={goNext} {...stepProps} />
        )}
        {stepIndex === 5 && (
          <StepRisk data={formData.risk} update={updateSection('risk')}
            onBack={goBack} onNext={goNext} {...stepProps} />
        )}
        {stepIndex === 6 && (
          <StepGovernance data={formData.governance} update={updateSection('governance')}
            onBack={goBack} onNext={handleFinish} loading={loading} {...stepProps} />
        )}
      </div>
    </main>
  )
}
