use soroban_sdk::{Address, BytesN, Env};

use crate::types::{DataKey, PaymentRecord};

pub fn has_admin(env: &Env) -> bool {
    env.storage().instance().has(&DataKey::Admin)
}

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&DataKey::Admin, admin);
}

pub fn get_admin(env: &Env) -> Address {
    env.storage()
        .instance()
        .get(&DataKey::Admin)
        .expect("admin must be initialized")
}

pub fn set_native_asset(env: &Env, native_asset: &Address) {
    env.storage().instance().set(&DataKey::NativeAsset, native_asset);
}

pub fn get_native_asset(env: &Env) -> Address {
    env.storage()
        .instance()
        .get(&DataKey::NativeAsset)
        .expect("native asset must be initialized")
}

pub fn has_payment(env: &Env, task_id: &BytesN<32>) -> bool {
    env.storage()
        .persistent()
        .has(&DataKey::Payment(task_id.clone()))
}

pub fn set_payment(env: &Env, task_id: &BytesN<32>, payment: &PaymentRecord) {
    env.storage()
        .persistent()
        .set(&DataKey::Payment(task_id.clone()), payment);
}

pub fn get_payment(env: &Env, task_id: &BytesN<32>) -> Option<PaymentRecord> {
    env.storage()
        .persistent()
        .get(&DataKey::Payment(task_id.clone()))
}
