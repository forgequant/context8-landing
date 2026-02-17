
export type PlanType = 'free' | 'pro'
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled'
export type PaymentStatus = 'pending' | 'verified' | 'rejected'
export type BlockchainNetwork = 'ethereum' | 'polygon' | 'bsc'
export type StablecoinType = 'usdt' | 'usdc'

export interface Subscription {
  id: string
  user_id: string
  plan: PlanType
  status: SubscriptionStatus
  start_date: string
  end_date: string
  created_at: string
}

export interface PaymentSubmission {
  id: string
  user_id: string
  plan: PlanType
  tx_hash: string
  chain: BlockchainNetwork
  amount: number
  status: PaymentStatus
  submitted_at: string
  verified_at: string | null
  verified_by: string | null
  verification_notes: string | null
}

export interface PaymentSubmissionWithUser extends PaymentSubmission {
  user_email: string
}

export interface SubscriptionWithDaysRemaining extends Subscription {
  days_remaining: number
  is_grace_period: boolean
}

export interface PaymentFormData {
  chain: BlockchainNetwork
  stablecoin: StablecoinType
  tx_hash: string
}

export interface AdminVerificationFormData {
  status: 'verified' | 'rejected'
  verification_notes?: string
}

export interface WalletAddress {
  usdt: string
  usdc: string
}

export interface WalletAddresses {
  ethereum: WalletAddress
  polygon: WalletAddress
  bsc: WalletAddress
}

export interface BlockchainExplorerConfig {
  name: string
  baseUrl: string
  txUrl: (txHash: string) => string
  addressUrl: (address: string) => string
}

export interface BlockchainExplorers {
  ethereum: BlockchainExplorerConfig
  polygon: BlockchainExplorerConfig
  bsc: BlockchainExplorerConfig
}

export interface SubscriptionCheckResponse {
  has_active: boolean
  subscription: Subscription | null
  days_remaining: number | null
  is_grace_period: boolean
}

export interface PaymentSubmissionResponse {
  success: boolean
  submission_id: string
  message: string
}

export interface AdminVerificationResponse {
  success: boolean
  subscription_activated: boolean
  message: string
}

export interface TxHashValidationResult {
  valid: boolean
  error?: string
}

export interface PaymentFormValidationErrors {
  chain?: string
  stablecoin?: string
  tx_hash?: string
}

export const PLAN_PRICES: Record<PlanType, number> = {
  free: 0,
  pro: 8
}

export const SUBSCRIPTION_DURATION_DAYS = 30
export const GRACE_PERIOD_HOURS = 48

export type InsertSubscription = Omit<Subscription, 'id' | 'created_at'>
export type UpdateSubscription = Partial<Omit<Subscription, 'id' | 'user_id' | 'created_at'>>

export type InsertPaymentSubmission = Omit<PaymentSubmission, 'id' | 'submitted_at' | 'verified_at' | 'verified_by' | 'verification_notes'> & {
  status: 'pending'
}

export type UpdatePaymentSubmission = {
  status: 'verified' | 'rejected'
  verified_at: string
  verified_by: string
  verification_notes?: string
}
