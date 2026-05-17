export type IncomeType = 'employee' | 'selfemployed' | 'none' | ''
export type OverdraftFrequency = 'never' | 'sometimes' | 'regular' | ''

export interface FormData {
  income: {
    salary1: string
    salary1Type: IncomeType
    salary2: string
    salary2Type: IncomeType
    otherIncome: string
    hasPassive: boolean | null
  }
  expenses: {
    housing: string
    utilities: string
    food: string
    car: string
    education: string
    subscriptions: string
    leisure: string
  }
  loans: {
    mortgagePayment: string
    personalLoansPayment: string
    carLoanPayment: string
    creditCardRevolving: string
    overdraftFrequency: OverdraftFrequency
  }
  assets: {
    emergencyFund: string
    studyFund: string
    gemel: string
    securities: string
    realEstate: string
  }
  pension: {
    knowsPension: boolean | null
    monthlyPayout: string
    age: string
    currentBalance: string
    monthlyContribution: string
  }
  risk: {
    lifeInsurance: boolean | null
    disability: boolean | null
    criticalIllness: boolean | null
    privateHealth: boolean | null
  }
  governance: {
    regularMeetings: boolean | null
    writtenBudget: boolean | null
    fiveYearGoals: boolean | null
  }
}

export interface Scores {
  overall: number
  axes: {
    incomeStructure: number
    operational: number
    capital: number
    risk: number
    horizon: number
    governance: number
  }
  metrics: {
    totalIncome: number
    totalExpenses: number
    totalDebtService: number
    liquidAssets: number
    totalAssets: number
    monthsOfSurvival: number
    projectedPension: number
    debtServiceRatio: number
    savingsRate: number
    replacementRatio: number
  }
}

export type SubscriptionStatus = 'trial' | 'active' | 'cancelled' | 'expired'

export type AssessmentRow = {
  id: string
  created_at: string
  salary1: number | null; salary1_type: string | null
  salary2: number | null; salary2_type: string | null
  other_income: number | null; has_passive_income: boolean | null
  expense_housing: number | null; expense_utilities: number | null
  expense_food: number | null; expense_car: number | null
  expense_education: number | null; expense_subscriptions: number | null
  expense_leisure: number | null
  loan_mortgage: number | null; loan_personal: number | null
  loan_car: number | null; loan_credit_card: number | null
  overdraft_frequency: string | null
  asset_emergency: number | null; asset_study_fund: number | null
  asset_gemel: number | null; asset_securities: number | null
  asset_real_estate: number | null
  pension_knows: boolean | null; pension_monthly_payout: number | null
  pension_age: number | null; pension_balance: number | null
  pension_monthly_contribution: number | null
  risk_life_insurance: boolean | null; risk_disability: boolean | null
  risk_critical_illness: boolean | null; risk_private_health: boolean | null
  gov_regular_meetings: boolean | null; gov_written_budget: boolean | null
  gov_five_year_goals: boolean | null
}

export type TaskRow = {
  id: string
  title: string
  description: string | null
  axis: string | null
  type: 'auto' | 'manual'
  status: 'open' | 'done' | 'skipped'
  action_type: 'article' | 'vip' | 'course' | 'none'
  action_ref: string | null
  due_date: string | null
}

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
  course_participant: boolean
  course_access_code: string | null
  course_enrolled_at: string | null
  subscription_status: SubscriptionStatus
  trial_ends_at: string | null
  subscription_started_at: string | null
  subscription_cancelled_at: string | null
}
