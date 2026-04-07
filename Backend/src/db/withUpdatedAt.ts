export function withUpdatedAt<TValues extends Record<string, unknown>>(values: TValues) {
  return {
    ...values,
    updatedAt: new Date(),
  };
}
