import { RentalRequest, CreateRentalRequestData } from "../../shared/types/request";

export async function fetchRequests(): Promise<RentalRequest[]> {
  // Mock implementation - replace with actual API call
  return [];
}

export async function fetchRequestByListing(listingId: string): Promise<RentalRequest | null> {
  // Mock implementation - replace with actual API call
  // For now, return null as we don't have a persistent mock store
  // In a real app, this would fetch from the backend
  return null;
}

export async function createRequest(requestData: CreateRentalRequestData): Promise<RentalRequest> {
  // Mock implementation - replace with actual API call
  const newRequest: RentalRequest = {
    id: String(Date.now()),
    ...requestData,
    status: "pending",
    renterId: "current-user-id", // This would come from auth context
    ownerId: "property-owner-id", // This would come from property data
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return newRequest;
}

export async function updateRequest(request: RentalRequest): Promise<RentalRequest> {
  // Mock implementation - replace with actual API call
  return {
    ...request,
    updatedAt: new Date().toISOString(),
  };
}

export async function deleteRequest(requestId: string): Promise<void> {
  // Mock implementation - replace with actual API call
  console.log(`Deleting request ${requestId}`);
}
