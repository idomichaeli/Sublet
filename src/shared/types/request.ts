export interface RentalRequest {
  id: string;
  propertyId: string;
  renterId: string;
  ownerId: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  message?: string;
  requestedDates: {
    checkIn: string;
    checkOut: string;
  };
  guests: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentalRequestData {
  propertyId: string;
  message?: string;
  requestedDates: {
    checkIn: string;
    checkOut: string;
  };
  guests: number;
}
