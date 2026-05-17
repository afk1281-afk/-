'use client'

import DashboardContent, { type AssessmentRow } from '@/app/dashboard/DashboardContent'

const mockAssessment: AssessmentRow = {
  id: 'mock-001',
  created_at: new Date().toISOString(),

  // Income
  salary1: 18000, salary1_type: 'employee',
  salary2: 7000, salary2_type: 'employee',
  other_income: 1500, has_passive_income: true,

  // Expenses
  expense_housing: 5500, expense_utilities: 900,
  expense_food: 3800, expense_car: 1400,
  expense_education: 2200, expense_subscriptions: 450,
  expense_leisure: 1200,

  // Loans
  loan_mortgage: 4800, loan_personal: 0,
  loan_car: 750, loan_credit_card: 0,
  overdraft_frequency: 'never',

  // Assets
  asset_emergency: 42000, asset_study_fund: 140000,
  asset_gemel: 95000, asset_securities: 55000,
  asset_real_estate: 0,

  // Pension
  pension_knows: true, pension_monthly_payout: 7800,
  pension_age: 40, pension_balance: 380000,
  pension_monthly_contribution: 3100,

  // Risk
  risk_life_insurance: true, risk_disability: true,
  risk_critical_illness: false, risk_private_health: true,

  // Governance
  gov_regular_meetings: true, gov_written_budget: false,
  gov_five_year_goals: true,
}

export default function DevDashboardPage() {
  return <DashboardContent assessment={mockAssessment} />
}
