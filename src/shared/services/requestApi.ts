import { Request, CreateRequestData } from "../types/request";

export async function fetchRequests(): Promise<Request[]> {
  // Mock implementation - replace with actual API call
  return [];
}

export async function fetchRequestByListing(listingId: string): Promise<Request | null> {
  // Mock implementation - replace with actual API call
  return null;
}

export async function createRequest(requestData: CreateRequestData): Promise<Request> {
  // Mock implementation - replace with actual API call
  const newRequest: Request = {
    id: String(Date.now()),
    ...requestData,
    status: "PENDING",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return newRequest;
}

export async function updateRequest(request: Request): Promise<Request> {
  // Mock implementation - replace with actual API call
  return {
    ...request,
    updatedAt: new Date(),
  };
}

export async function deleteRequest(requestId: string): Promise<void> {
  // Mock implementation - replace with actual API call
  console.log(`Deleting request ${requestId}`);
}
