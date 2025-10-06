import { create } from "zustand";
import { RentalRequest, CreateRentalRequestData } from "../../shared/types/request";
import * as api from "./rentalRequestApi";

type RequestState = {
  requests: RentalRequest[];
  isLoading: boolean;
  fetch: () => Promise<void>;
  fetchByListing: (listingId: string) => Promise<RentalRequest | null>;
  add: (requestData: CreateRentalRequestData) => Promise<RentalRequest>;
  addRequest: (requestData: CreateRentalRequestData) => Promise<RentalRequest>;
  update: (request: RentalRequest) => Promise<void>;
  remove: (requestId: string) => Promise<void>;
  getRequestByListing: (listingId: string) => RentalRequest | null;
  getRequestsByProperty: (propertyId: string) => RentalRequest[];
  refreshRequest: (listingId: string) => Promise<void>;
};

export const useRequestStore = create<RequestState>((set, get) => ({
  requests: [],
  isLoading: false,
  
  fetch: async () => {
    set({ isLoading: true });
    try {
      const data = await api.fetchRequests();
      set({ requests: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error("Failed to fetch requests:", error);
    }
  },
  
  fetchByListing: async (listingId: string) => {
    try {
      const request = await api.fetchRequestByListing(listingId);
      if (request) {
        const existing = get().requests.find(r => r.id === request.id);
        if (!existing) {
          set({ requests: [...get().requests, request] });
        }
      }
      return request;
    } catch (error) {
      console.error("Failed to fetch request by listing:", error);
      return null;
    }
  },
  
  add: async (requestData: CreateRentalRequestData) => {
    try {
      const newRequest = await api.createRequest(requestData);
      set({ requests: [...get().requests, newRequest] });
      return newRequest;
    } catch (error) {
      console.error("Failed to create request:", error);
      throw error;
    }
  },
  
  addRequest: async (requestData: CreateRentalRequestData) => {
    return get().add(requestData);
  },
  
  update: async (request: RentalRequest) => {
    try {
      const updated = await api.updateRequest(request);
      set({ 
        requests: get().requests.map((r) => 
          r.id === updated.id ? updated : r
        ) 
      });
    } catch (error) {
      console.error("Failed to update request:", error);
      throw error;
    }
  },
  
  remove: async (requestId: string) => {
    try {
      await api.deleteRequest(requestId);
      set({ 
        requests: get().requests.filter((r) => r.id !== requestId) 
      });
    } catch (error) {
      console.error("Failed to delete request:", error);
      throw error;
    }
  },
  
  getRequestByListing: (listingId: string) => {
    return get().requests.find(r => r.propertyId === listingId) || null;
  },
  
  getRequestsByProperty: (propertyId: string) => {
    return get().requests.filter(r => r.propertyId === propertyId);
  },
  
  refreshRequest: async (listingId: string) => {
    try {
      const updatedRequest = await api.fetchRequestByListing(listingId);
      if (updatedRequest) {
        const existingIndex = get().requests.findIndex(r => r.id === updatedRequest.id);
        if (existingIndex >= 0) {
          // Update existing request
          const updatedRequests = [...get().requests];
          updatedRequests[existingIndex] = updatedRequest;
          set({ requests: updatedRequests });
        } else {
          // Add new request
          set({ requests: [...get().requests, updatedRequest] });
        }
      }
    } catch (error) {
      console.error("Failed to refresh request:", error);
    }
  },
}));
