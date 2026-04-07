#![allow(dead_code)]

use soroban_sdk::{contracttype, Address, BytesN};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    NativeAsset,
    Payment(BytesN<32>),
}

#[derive(Clone)]
#[contracttype]
pub struct PaymentRecord {
    pub recipient: Address,
    pub amount: i128,
    pub paid_at_ledger: u32,
}
