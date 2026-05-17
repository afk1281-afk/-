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
