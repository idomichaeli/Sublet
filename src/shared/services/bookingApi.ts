import { Booking } from "../../shared/types/booking";

export async function fetchBookings(): Promise<Booking[]> {
  return [];
}

export async function createBooking(booking: Omit<Booking, "id">): Promise<Booking> {
  return { ...booking, id: String(Date.now()) } as Booking;
}

export async function updateBooking(booking: Booking): Promise<Booking> {
  return booking;
}


