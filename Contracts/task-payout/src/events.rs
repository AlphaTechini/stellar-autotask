use soroban_sdk::{Address, BytesN, Env, Symbol};

pub fn publish_task_paid(
    env: &Env,
    task_id: &BytesN<32>,
    recipient: &Address,
    amount: i128,
) {
    let topics = (Symbol::new(env, "task_paid"), task_id.clone());
    env.events().publish(topics, (recipient.clone(), amount));
}
