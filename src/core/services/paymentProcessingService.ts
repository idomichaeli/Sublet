import { createPaymentIntent, confirmPayment } from "./paymentProcessingApi";

export async function pay(amount: number, currency: string) {
  const intent = await createPaymentIntent(amount, currency);
  const confirmed = await confirmPayment(intent.id);
  return confirmed;
}


