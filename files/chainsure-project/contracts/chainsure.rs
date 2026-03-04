//! ChainSure Protocol - Flight Delay Insurance Smart Contract
//! 
//! This contract implements a decentralized flight delay insurance protocol
//! on the Rialo blockchain, leveraging native Timer and HTTP capabilities.

use borsh::{BorshDeserialize, BorshSerialize};

// ============================================================================
// Constants
// ============================================================================

/// Program ID (replace with actual deployed address)
pub const PROGRAM_ID: &str = "ChainSure1111111111111111111111111111111111";

/// Kelvin per RLO (1 RLO = 1,000,000,000 Kelvin)
pub const KELVIN_PER_RLO: u64 = 1_000_000_000;

/// Delay threshold in minutes for claim eligibility
pub const DELAY_THRESHOLD_MINUTES: u32 = 120;

/// Maximum policies per user per day (anti-fraud)
pub const MAX_POLICIES_PER_DAY: u8 = 5;

/// AirLabs API endpoint for flight data
pub const AIRLABS_API_URL: &str = "https://airlabs.co/api/v9/flight";

// ============================================================================
// PDA Seeds
// ============================================================================

pub mod seeds {
    pub const CONFIG: &[u8] = b"config";
    pub const POLICY: &[u8] = b"policy";
    pub const CLAIM: &[u8] = b"claim";
    pub const TREASURY: &[u8] = b"treasury";
}

// ============================================================================
// Account Structures
// ============================================================================

/// Global configuration account (singleton)
/// PDA: ["config"]
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Config {
    /// Is this account initialized?
    pub is_initialized: bool,
    
    /// Admin authority who can update config
    pub authority: [u8; 32],  // PublicKey
    
    /// Treasury account for holding premiums
    pub treasury: [u8; 32],   // PublicKey
    
    /// Delay threshold in minutes (default: 120)
    pub delay_threshold: u32,
    
    /// Oracle URL for flight data
    pub oracle_url: String,
    
    /// Statistics
    pub total_premiums: u64,
    pub total_claims: u64,
    pub total_policies: u64,
}

impl Config {
    pub const SIZE: usize = 1 + 32 + 32 + 4 + 200 + 8 + 8 + 8; // ~293 bytes
}

/// Insurance policy account
/// PDA: ["policy", owner, flight_iata, date]
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Policy {
    /// Is this account initialized?
    pub is_initialized: bool,
    
    /// Policy owner
    pub owner: [u8; 32],      // PublicKey
    
    /// Flight IATA code (e.g., "CA1234")
    pub flight_iata: String,  // max 8 chars
    
    /// Flight ICAO code (e.g., "CCA1234")
    pub flight_icao: String,  // max 8 chars
    
    /// Flight date (YYYY-MM-DD format)
    pub date: String,         // 10 chars
    
    /// Scheduled departure time (HH:MM format)
    pub scheduled_departure: String,  // 5 chars
    
    /// Departure airport IATA code
    pub dep_airport: String,  // 3 chars
    
    /// Arrival airport IATA code
    pub arr_airport: String,  // 3 chars
    
    /// Payout amount in Kelvin
    pub payout_amount: u64,
    
    /// Premium paid in Kelvin
    pub premium_paid: u64,
    
    /// Current policy status
    pub status: PolicyStatus,
    
    /// Unix timestamp when policy was created
    pub created_at: i64,
    
    /// Unix timestamp when policy was settled (if applicable)
    pub settled_at: Option<i64>,
    
    /// Actual delay in minutes (after settlement)
    pub actual_delay_minutes: Option<u32>,
    
    /// Timer subscription ID for auto-settlement
    pub timer_subscription: Option<u64>,
    
    /// Bump seed for PDA derivation
    pub bump: u8,
}

impl Policy {
    pub const SIZE: usize = 1 + 32 + 16 + 16 + 12 + 8 + 6 + 6 + 8 + 8 + 1 + 8 + 9 + 5 + 9 + 1; // ~150 bytes
}

/// Policy status enum
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, Copy, PartialEq)]
#[repr(u8)]
pub enum PolicyStatus {
    /// Policy is active, waiting for settlement
    Active = 0,
    
    /// Claim was triggered and paid out
    Claimed = 1,
    
    /// Policy expired (no delay or delay < threshold)
    Expired = 2,
    
    /// Policy was cancelled (e.g., flight cancelled)
    Cancelled = 3,
}

/// Claim record account
/// PDA: ["claim", policy_address]
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Claim {
    /// Is this account initialized?
    pub is_initialized: bool,
    
    /// Reference to the policy
    pub policy: [u8; 32],     // PublicKey
    
    /// Claim recipient (should match policy owner)
    pub owner: [u8; 32],      // PublicKey
    
    /// Claim amount in Kelvin
    pub amount: u64,
    
    /// Actual delay in minutes
    pub delay_minutes: u32,
    
    /// Unix timestamp of claim
    pub timestamp: i64,
    
    /// Transfer transaction signature
    pub transfer_signature: String,  // 88 chars (base58)
    
    /// Bump seed for PDA derivation
    pub bump: u8,
}

impl Claim {
    pub const SIZE: usize = 1 + 32 + 32 + 8 + 4 + 8 + 90 + 1; // ~176 bytes
}

// ============================================================================
// Instructions
// ============================================================================

/// Program instruction discriminators
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
#[repr(u8)]
pub enum Instruction {
    /// Initialize the protocol configuration
    /// Accounts:
    /// 0. [signer] Authority
    /// 1. [writable] Config PDA
    /// 2. [writable] Treasury PDA
    /// 3. [] System Program
    Initialize {
        delay_threshold: u32,
        oracle_url: String,
    } = 0,

    /// Purchase a new insurance policy
    /// Accounts:
    /// 0. [signer] Buyer
    /// 1. [writable] Policy PDA
    /// 2. [writable] Config PDA
    /// 3. [writable] Treasury PDA
    /// 4. [] System Program
    /// 5. [] Timer Program (for auto-settlement registration)
    PurchasePolicy {
        flight_iata: String,
        flight_icao: String,
        date: String,
        scheduled_departure: String,
        dep_airport: String,
        arr_airport: String,
        payout_amount: u64,
        premium_amount: u64,
        bump: u8,
    } = 1,

    /// Settle a policy (auto-triggered by Timer or manual)
    /// Accounts:
    /// 0. [signer] Caller (can be Timer or policy owner)
    /// 1. [writable] Policy PDA
    /// 2. [writable] Claim PDA (created if delay >= threshold)
    /// 3. [writable] Treasury PDA
    /// 4. [writable] Config PDA
    /// 5. [] System Program
    /// 6. [] HTTP Program (for fetching flight data)
    SettlePolicy {
        claim_bump: u8,
    } = 2,

    /// Manual settlement triggered by user
    /// Same as SettlePolicy but can only be called after flight time
    ManualSettle {
        claim_bump: u8,
    } = 3,

    /// Cancel a policy (admin only, e.g., flight cancelled)
    /// Accounts:
    /// 0. [signer] Authority
    /// 1. [writable] Policy PDA
    /// 2. [writable] Treasury PDA
    /// 3. [writable] Owner (for refund)
    CancelPolicy = 4,

    /// Update configuration (admin only)
    /// Accounts:
    /// 0. [signer] Authority
    /// 1. [writable] Config PDA
    UpdateConfig {
        new_authority: Option<[u8; 32]>,
        new_delay_threshold: Option<u32>,
        new_oracle_url: Option<String>,
    } = 5,
}

// ============================================================================
// Events
// ============================================================================

/// Event emitted when a new policy is created
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct PolicyCreatedEvent {
    pub policy: [u8; 32],
    pub owner: [u8; 32],
    pub flight_iata: String,
    pub date: String,
    pub premium: u64,
    pub payout: u64,
    pub timestamp: i64,
}

/// Event emitted when a claim is paid
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct PolicyClaimedEvent {
    pub policy: [u8; 32],
    pub owner: [u8; 32],
    pub amount: u64,
    pub delay_minutes: u32,
    pub timestamp: i64,
}

/// Event emitted when a policy expires
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct PolicyExpiredEvent {
    pub policy: [u8; 32],
    pub owner: [u8; 32],
    pub delay_minutes: u32,
    pub timestamp: i64,
}

/// Event emitted when a policy is cancelled
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct PolicyCancelledEvent {
    pub policy: [u8; 32],
    pub owner: [u8; 32],
    pub refund_amount: u64,
    pub timestamp: i64,
}

// ============================================================================
// Errors
// ============================================================================

/// Custom error codes
#[derive(Debug, Clone, Copy)]
#[repr(u32)]
pub enum ChainSureError {
    /// Account not initialized
    NotInitialized = 0,
    
    /// Already initialized
    AlreadyInitialized = 1,
    
    /// Unauthorized access
    Unauthorized = 2,
    
    /// Invalid flight date (must be future)
    InvalidDate = 3,
    
    /// Insufficient funds for premium
    InsufficientFunds = 4,
    
    /// Policy already exists for this flight/date
    PolicyExists = 5,
    
    /// Policy not found
    PolicyNotFound = 6,
    
    /// Policy already settled
    AlreadySettled = 7,
    
    /// Settlement too early (flight hasn't departed)
    TooEarly = 8,
    
    /// Oracle request failed
    OracleError = 9,
    
    /// Invalid account
    InvalidAccount = 10,
    
    /// Daily purchase limit exceeded
    DailyLimitExceeded = 11,
    
    /// Arithmetic overflow
    Overflow = 12,
}

// ============================================================================
// Helper Functions
// ============================================================================

/// Derive Policy PDA address
pub fn get_policy_address(
    owner: &[u8; 32],
    flight_iata: &str,
    date: &str,
    program_id: &[u8; 32],
) -> ([u8; 32], u8) {
    // In real implementation:
    // Pubkey::find_program_address(
    //     &[seeds::POLICY, owner, flight_iata.as_bytes(), date.as_bytes()],
    //     program_id
    // )
    unimplemented!()
}

/// Derive Claim PDA address
pub fn get_claim_address(
    policy: &[u8; 32],
    program_id: &[u8; 32],
) -> ([u8; 32], u8) {
    // In real implementation:
    // Pubkey::find_program_address(
    //     &[seeds::CLAIM, policy],
    //     program_id
    // )
    unimplemented!()
}

/// Derive Config PDA address
pub fn get_config_address(program_id: &[u8; 32]) -> ([u8; 32], u8) {
    // In real implementation:
    // Pubkey::find_program_address(&[seeds::CONFIG], program_id)
    unimplemented!()
}

/// Derive Treasury PDA address
pub fn get_treasury_address(program_id: &[u8; 32]) -> ([u8; 32], u8) {
    // In real implementation:
    // Pubkey::find_program_address(&[seeds::TREASURY], program_id)
    unimplemented!()
}

// ============================================================================
// Insurance Tiers
// ============================================================================

/// Available insurance tiers
pub const TIERS: [(u64, u64, u8); 4] = [
    // (premium, payout, rate_percent)
    (50 * KELVIN_PER_RLO, 200 * KELVIN_PER_RLO, 25),   // Basic
    (100 * KELVIN_PER_RLO, 500 * KELVIN_PER_RLO, 20),  // Standard
    (200 * KELVIN_PER_RLO, 1000 * KELVIN_PER_RLO, 20), // Premium
    (500 * KELVIN_PER_RLO, 2000 * KELVIN_PER_RLO, 25), // VIP
];

/// Validate tier parameters
pub fn validate_tier(premium: u64, payout: u64) -> bool {
    TIERS.iter().any(|(p, o, _)| *p == premium && *o == payout)
}

// ============================================================================
// Tests
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_policy_status() {
        assert_eq!(PolicyStatus::Active as u8, 0);
        assert_eq!(PolicyStatus::Claimed as u8, 1);
        assert_eq!(PolicyStatus::Expired as u8, 2);
        assert_eq!(PolicyStatus::Cancelled as u8, 3);
    }

    #[test]
    fn test_validate_tier() {
        assert!(validate_tier(50 * KELVIN_PER_RLO, 200 * KELVIN_PER_RLO));
        assert!(validate_tier(100 * KELVIN_PER_RLO, 500 * KELVIN_PER_RLO));
        assert!(!validate_tier(123, 456)); // Invalid tier
    }

    #[test]
    fn test_account_sizes() {
        assert!(Config::SIZE < 1024);
        assert!(Policy::SIZE < 512);
        assert!(Claim::SIZE < 256);
    }
}
