export interface Request {
  id: string;
  listingId: string;
  renterId: string;
  ownerId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  counterOffer?: {
    type: "HIGHER" | "LOWER";
    amount: number;
    reason?: string;
  };
  preferredDates?: {
    startDate: Date;
    endDate: Date;
  };
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  chatId?: string; // Reference to chat conversation if accepted
}

export interface CreateRequestData {
  listingId: string;
  renterId: string;
  ownerId: string;
  counterOffer?: {
    type: "HIGHER" | "LOWER";
    amount: number;
    reason?: string;
  };
  preferredDates?: {
    startDate: Date;
    endDate: Date;
  };
  message?: string;
}
