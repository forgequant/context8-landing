// TypeScript Type Contracts
// Feature: Crypto Subscription Payment System
// Date: 2025-10-27

// ============================================================================
// ENUMS
// ============================================================================

export type PlanType = 'free' | 'pro'
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled'
export type PaymentStatus = 'pending' | 'verified' | 'rejected'
export type BlockchainNetwork = 'ethereum' | 'polygon' | 'bsc'
export type StablecoinType = 'usdt' | 'usdc'

// ============================================================================
// DATABASE ENTITIES
// ============================================================================

export interface Subscription {
  id: string // UUID
  user_id: string // UUID - foreign key to auth.users
  plan: PlanType
  status: SubscriptionStatus
  start_date: string // ISO 8601 timestamp
  end_date: string // ISO 8601 timestamp
  created_at: string // ISO 8601 timestamp
}

export interface PaymentSubmission {
  id: string // UUID
  user_id: string // UUID - foreign key to auth.users
  plan: PlanType
  tx_hash: string // 0x + 64 hex characters
  chain: BlockchainNetwork
  amount: number // USD amount (e.g., 8.00)
  status: PaymentStatus
  submitted_at: string // ISO 8601 timestamp
  verified_at: string | null // ISO 8601 timestamp
  verified_by: string | null // UUID - foreign key to auth.users
  verification_notes: string | null
}

// ============================================================================
// DISPLAY/UI TYPES
// ============================================================================

export interface PaymentSubmissionWithUser extends PaymentSubmission {
  user_email: string // Joined from auth.users
}

export interface SubscriptionWithDaysRemaining extends Subscription {
  days_remaining: number // Calculated client-side
  is_grace_period: boolean // True if within 48h grace period after expiration
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface PaymentFormData {
  chain: BlockchainNetwork
  stablecoin: StablecoinType
  tx_hash: string
}

export interface AdminVerificationFormData {
  status: 'verified' | 'rejected'
  verification_notes?: string
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface WalletAddress {
  usdt: string // ERC-20/BEP-20 address
  usdc: string // ERC-20/BEP-20 address
}

export interface WalletAddresses {
  ethereum: WalletAddress
  polygon: WalletAddress
  bsc: WalletAddress
}

export interface BlockchainExplorerConfig {
  name: string // e.g., "Etherscan"
  baseUrl: string // e.g., "https://etherscan.io"
  txUrl: (txHash: string) => string
  addressUrl: (address: string) => string
}

export interface BlockchainExplorers {
  ethereum: BlockchainExplorerConfig
  polygon: BlockchainExplorerConfig
  bsc: BlockchainExplorerConfig
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

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

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface TxHashValidationResult {
  valid: boolean
  error?: string // Error message if invalid
}

export interface PaymentFormValidationErrors {
  chain?: string
  stablecoin?: string
  tx_hash?: string
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const PLAN_PRICES: Record<PlanType, number> = {
  free: 0,
  pro: 8 // USD
}

export const SUBSCRIPTION_DURATION_DAYS = 30
export const GRACE_PERIOD_HOURS = 48

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type InsertSubscription = Omit<Subscription, 'id' | 'created_at'>
export type UpdateSubscription = Partial<Omit<Subscription, 'id' | 'user_id' | 'created_at'>>

export type InsertPaymentSubmission = Omit<PaymentSubmission, 'id' | 'submitted_at' | 'verified_at' | 'verified_by' | 'verification_notes'> & {
  status: 'pending' // Force initial status
}

export type UpdatePaymentSubmission = {
  status: 'verified' | 'rejected'
  verified_at: string
  verified_by: string
  verification_notes?: string
}
