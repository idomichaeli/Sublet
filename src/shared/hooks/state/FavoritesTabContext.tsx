import React, { createContext, useContext, useState, ReactNode } from "react";

type FavoritesTab = "favorites" | "chat";

interface FavoritesTabContextType {
  activeTab: FavoritesTab;
  setActiveTab: (tab: FavoritesTab) => void;
}

const FavoritesTabContext = createContext<FavoritesTabContextType | undefined>(
  undefined
);

interface FavoritesTabProviderProps {
  children: ReactNode;
}

export function FavoritesTabProvider({ children }: FavoritesTabProviderProps) {
  const [activeTab, setActiveTab] = useState<FavoritesTab>("favorites");

  return (
    <FavoritesTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </FavoritesTabContext.Provider>
  );
}

export function useFavoritesTab() {
  const context = useContext(FavoritesTabContext);
  if (context === undefined) {
    throw new Error(
      "useFavoritesTab must be used within a FavoritesTabProvider"
    );
  }
  return context;
}
