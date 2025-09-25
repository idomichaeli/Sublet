export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: "requires_payment_method" | "succeeded" | "failed";
}

export async function createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent> {
  return { id: String(Date.now()), amount, currency, status: "requires_payment_method" };
}

export async function confirmPayment(_intentId: string): Promise<PaymentIntent> {
  return { id: _intentId, amount: 0, currency: "usd", status: "succeeded" };
}


