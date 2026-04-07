const DISPLAY_XLM_AMOUNT_PATTERN = /^\d+(\.\d{1,7})?$/;
const STROOPS_SCALE = 7n;
const STROOPS_MULTIPLIER = 10n ** STROOPS_SCALE;

export function convertDisplayAmountToStroops(amount: string) {
  const normalizedAmount = amount.trim();

  if (!DISPLAY_XLM_AMOUNT_PATTERN.test(normalizedAmount)) {
    throw new Error('Payout amount must be a positive XLM string with up to 7 decimal places.');
  }

  const [wholePart, fractionalPart = ''] = normalizedAmount.split('.');
  const wholeStroops = BigInt(wholePart) * STROOPS_MULTIPLIER;
  const fractionalStroops = BigInt(fractionalPart.padEnd(Number(STROOPS_SCALE), '0'));
  const stroops = wholeStroops + fractionalStroops;

  if (stroops <= 0n) {
    throw new Error('Payout amount must be greater than zero.');
  }

  return stroops;
}
