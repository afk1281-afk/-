import type { FormData, Scores, AssessmentRow } from './types'

const n = (v: string | number | null | undefined): number =>
  parseFloat(String(v ?? '')) || 0

export function calculateScores(data: FormData): Scores {
  const totalIncome = n(data.income.salary1) + n(data.income.salary2) + n(data.income.otherIncome)
  const totalExpenses = Object.values(data.expenses).reduce((s, v) => s + n(v), 0)
  const totalDebtService =
    n(data.loans.mortgagePayment) +
    n(data.loans.personalLoansPayment) +
    n(data.loans.carLoanPayment) +
    n(data.loans.creditCardRevolving)
  const liquidAssets =
    n(data.assets.emergencyFund) +
    n(data.assets.studyFund) +
    n(data.assets.gemel) +
    n(data.assets.securities)
  const totalAssets = liquidAssets + n(data.assets.realEstate)

  // --- פנסיה ---
  let projectedPension = 0
  if (data.pension.knowsPension === true) {
    projectedPension = n(data.pension.monthlyPayout)
  } else if (data.pension.knowsPension === false) {
    const age = n(data.pension.age)
    const balance = n(data.pension.currentBalance)
    const monthly = n(data.pension.monthlyContribution)
    const years = Math.max(0, 67 - age)
    const r = 0.04
    if (years > 0) {
      const future = balance * Math.pow(1 + r, years) +
        monthly * 12 * ((Math.pow(1 + r, years) - 1) / r)
      projectedPension = future / 200
    } else {
      projectedPension = balance / 200
    }
  }

  // --- ציר 1: מבנה הכנסה ---
  const streams = [data.income.salary1, data.income.salary2, data.income.otherIncome]
    .filter(v => n(v) > 0).length
  let incomeStructure = streams === 1 ? 30 : streams === 2 ? 55 : streams >= 3 ? 75 : 0
  if (data.income.hasPassive === true) incomeStructure += 25
  incomeStructure = Math.min(100, incomeStructure)

  // --- ציר 2: יעילות תפעולית ---
  let operational = 0
  if (totalIncome > 0) {
    const surplus = totalIncome - totalExpenses - totalDebtService
    const savingsRate = surplus / totalIncome
    if (savingsRate <= 0) operational = 0
    else if (savingsRate >= 0.2) operational = 100
    else operational = Math.round(savingsRate * 500)

    if (n(data.loans.creditCardRevolving) > 0) operational = Math.max(0, operational - 15)
    if (data.loans.overdraftFrequency === 'regular') operational = Math.max(0, operational - 20)
    else if (data.loans.overdraftFrequency === 'sometimes') operational = Math.max(0, operational - 10)
  }

  // --- ציר 3: הקצאת הון ---
  const monthsOfSurvival = totalExpenses > 0 ? n(data.assets.emergencyFund) / totalExpenses : 0
  let capital = monthsOfSurvival >= 6 ? 40 : monthsOfSurvival >= 3 ? 25 : monthsOfSurvival >= 1 ? 10 : 0
  if (n(data.assets.studyFund) > 0) capital += 15
  if (n(data.assets.gemel) > 0) capital += 15
  if (n(data.assets.securities) > 0) capital += 15
  if (n(data.assets.realEstate) > 0) capital += 15
  capital = Math.min(100, capital)

  // --- ציר 4: ניהול סיכון ---
  const riskCount = [
    data.risk.lifeInsurance,
    data.risk.disability,
    data.risk.criticalIllness,
    data.risk.privateHealth,
  ].filter(v => v === true).length
  const risk = riskCount * 25

  // --- ציר 5: אופק פנסיוני ---
  let horizon = 0
  if (totalExpenses > 0 && projectedPension > 0) {
    const ratio = projectedPension / totalExpenses
    if (ratio >= 0.7) horizon = 100
    else if (ratio >= 0.5) horizon = 60 + (ratio - 0.5) * 200
    else if (ratio >= 0.3) horizon = 30 + (ratio - 0.3) * 150
    else horizon = Math.round(ratio * 100)
  }
  horizon = Math.min(100, Math.round(horizon))

  // --- ציר 6: ממשל פנימי ---
  const govCount = [
    data.governance.regularMeetings,
    data.governance.writtenBudget,
    data.governance.fiveYearGoals,
  ].filter(v => v === true).length
  const governance = Math.round((govCount / 3) * 100)

  const overall = Math.round(
    (incomeStructure + operational + capital + risk + horizon + governance) / 6
  )
  const surplus = totalIncome - totalExpenses - totalDebtService

  return {
    overall,
    axes: {
      incomeStructure: Math.round(incomeStructure),
      operational: Math.round(operational),
      capital: Math.round(capital),
      risk,
      horizon,
      governance,
    },
    metrics: {
      totalIncome,
      totalExpenses,
      totalDebtService,
      liquidAssets,
      totalAssets,
      monthsOfSurvival,
      projectedPension,
      debtServiceRatio: totalIncome > 0 ? totalDebtService / totalIncome : 0,
      savingsRate: totalIncome > 0 ? surplus / totalIncome : 0,
      replacementRatio: totalExpenses > 0 && projectedPension > 0 ? projectedPension / totalExpenses : 0,
    },
  }
}

export const scoreColor = (s: number): string =>
  s >= 70 ? '#1E3A2E' : s >= 40 ? '#C68B2C' : '#A8401D'

export const scoreLabel = (s: number): string =>
  s >= 70 ? 'בריא' : s >= 40 ? 'דורש תשומת לב' : 'דורש פעולה מיידית'

export const formatNIS = (v: number): string =>
  '₪' + Math.round(v).toLocaleString('he-IL')

export function rowToFormData(r: AssessmentRow): FormData {
  const s = (v: number | null): string => v != null ? String(v) : ''
  return {
    income: {
      salary1: s(r.salary1), salary1Type: (r.salary1_type ?? '') as FormData['income']['salary1Type'],
      salary2: s(r.salary2), salary2Type: (r.salary2_type ?? '') as FormData['income']['salary2Type'],
      otherIncome: s(r.other_income), hasPassive: r.has_passive_income ?? null,
    },
    expenses: {
      housing: s(r.expense_housing), utilities: s(r.expense_utilities),
      food: s(r.expense_food), car: s(r.expense_car),
      education: s(r.expense_education), subscriptions: s(r.expense_subscriptions),
      leisure: s(r.expense_leisure),
    },
    loans: {
      mortgagePayment: s(r.loan_mortgage), personalLoansPayment: s(r.loan_personal),
      carLoanPayment: s(r.loan_car), creditCardRevolving: s(r.loan_credit_card),
      overdraftFrequency: (r.overdraft_frequency ?? '') as FormData['loans']['overdraftFrequency'],
    },
    assets: {
      emergencyFund: s(r.asset_emergency), studyFund: s(r.asset_study_fund),
      gemel: s(r.asset_gemel), securities: s(r.asset_securities),
      realEstate: s(r.asset_real_estate),
    },
    pension: {
      knowsPension: r.pension_knows ?? null,
      monthlyPayout: s(r.pension_monthly_payout), age: s(r.pension_age),
      currentBalance: s(r.pension_balance), monthlyContribution: s(r.pension_monthly_contribution),
    },
    risk: {
      lifeInsurance: r.risk_life_insurance ?? null, disability: r.risk_disability ?? null,
      criticalIllness: r.risk_critical_illness ?? null, privateHealth: r.risk_private_health ?? null,
    },
    governance: {
      regularMeetings: r.gov_regular_meetings ?? null,
      writtenBudget: r.gov_written_budget ?? null,
      fiveYearGoals: r.gov_five_year_goals ?? null,
    },
  }
}

export const initialFormData: FormData = {
  income: { salary1: '', salary1Type: '', salary2: '', salary2Type: '', otherIncome: '', hasPassive: null },
  expenses: { housing: '', utilities: '', food: '', car: '', education: '', subscriptions: '', leisure: '' },
  loans: { mortgagePayment: '', personalLoansPayment: '', carLoanPayment: '', creditCardRevolving: '', overdraftFrequency: '' },
  assets: { emergencyFund: '', studyFund: '', gemel: '', securities: '', realEstate: '' },
  pension: { knowsPension: null, monthlyPayout: '', age: '', currentBalance: '', monthlyContribution: '' },
  risk: { lifeInsurance: null, disability: null, criticalIllness: null, privateHealth: null },
  governance: { regularMeetings: null, writtenBudget: null, fiveYearGoals: null },
}
