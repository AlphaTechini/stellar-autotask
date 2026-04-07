#![no_std]

mod events;
mod storage;
mod types;

use soroban_sdk::{contract, contractimpl, token, Address, BytesN, Env};

use crate::events::publish_task_paid;
use crate::storage::{
    get_admin as load_admin,
    get_native_asset,
    get_payment as load_payment,
    has_admin,
    has_payment as payment_exists,
    set_admin,
    set_native_asset,
    set_payment,
};
use crate::types::PaymentRecord;

#[contract]
pub struct TaskPayoutContract;

#[contractimpl]
impl TaskPayoutContract {
    pub fn init(env: Env, admin: Address, native_asset: Address) {
        if has_admin(&env) {
            panic!("contract already initialized");
        }

        admin.require_auth();

        set_admin(&env, &admin);
        set_native_asset(&env, &native_asset);
    }

    pub fn pay_task(env: Env, task_id: BytesN<32>, recipient: Address, amount: i128) {
        if amount <= 0 {
            panic!("amount must be positive");
        }

        let admin = load_admin(&env);
        admin.require_auth();

        if payment_exists(&env, &task_id) {
            panic!("task already paid");
        }

        let token_address = get_native_asset(&env);
        let token = token::TokenClient::new(&env, &token_address);
        let contract_address = env.current_contract_address();

        token.transfer(&contract_address, &recipient, &amount);

        let payment = PaymentRecord {
            recipient: recipient.clone(),
            amount,
            paid_at_ledger: env.ledger().sequence(),
        };

        set_payment(&env, &task_id, &payment);
        publish_task_paid(&env, &task_id, &recipient, amount);
    }

    pub fn has_payment(env: Env, task_id: BytesN<32>) -> bool {
        payment_exists(&env, &task_id)
    }

    pub fn get_payment(env: Env, task_id: BytesN<32>) -> Option<PaymentRecord> {
        load_payment(&env, &task_id)
    }

    pub fn get_admin(env: Env) -> Address {
        load_admin(&env)
    }
}
