import { create } from "zustand";
import { RentalRequest } from "../../types/request";

interface RequestStore {
  requests: RentalRequest[];
  addRequest: (request: RentalRequest) => void;
  updateRequest: (id: string, updates: Partial<RentalRequest>) => void;
  removeRequest: (id: string) => void;
  getRequestsByProperty: (propertyId: string) => RentalRequest[];
  getRequestsByRenter: (renterId: string) => RentalRequest[];
}

export const useRequestStore = create<RequestStore>((set, get) => ({
  requests: [],
  addRequest: (request) =>
    set((state) => ({
      requests: [...state.requests, request],
    })),
  updateRequest: (id, updates) =>
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id ? { ...request, ...updates } : request
      ),
    })),
  removeRequest: (id) =>
    set((state) => ({
      requests: state.requests.filter((request) => request.id !== id),
    })),
  getRequestsByProperty: (propertyId) =>
    get().requests.filter((request) => request.propertyId === propertyId),
  getRequestsByRenter: (renterId) =>
    get().requests.filter((request) => request.renterId === renterId),
}));
