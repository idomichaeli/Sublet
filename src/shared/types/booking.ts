export interface Booking {
  id: string;
  listingId: string;
  renterId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  startDate: Date;
  endDate: Date;
}


