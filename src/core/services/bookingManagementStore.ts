import { create } from "zustand";
import { Booking } from "../types/bookingManagement";
import * as api from "./bookingManagementApi";

type BookingsState = {
  bookings: Booking[];
  isLoading: boolean;
  fetch: () => Promise<void>;
  add: (booking: Omit<Booking, "id">) => Promise<void>;
  update: (booking: Booking) => Promise<void>;
};

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  isLoading: false,
  fetch: async () => {
    set({ isLoading: true });
    const data = await api.fetchBookings();
    set({ bookings: data, isLoading: false });
  },
  add: async (booking) => {
    const created = await api.createBooking(booking);
    set({ bookings: [...get().bookings, created] });
  },
  update: async (booking) => {
    const updated = await api.updateBooking(booking);
    set({ bookings: get().bookings.map((b) => (b.id === updated.id ? updated : b)) });
  },
}));


