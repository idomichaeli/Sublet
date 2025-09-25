import { createPaymentIntent, confirmPayment } from "../../shared/services/paymentApi";

export async function pay(amount: number, currency: string) {
  const intent = await createPaymentIntent(amount, currency);
  const confirmed = await confirmPayment(intent.id);
  return confirmed;
}


