import React, { createContext, useContext, useState, ReactNode } from "react";

type FavoritesTabType = "favorites" | "chats";

interface FavoritesTabContextType {
  activeTab: FavoritesTabType;
  setActiveTab: (tab: FavoritesTabType) => void;
}

const FavoritesTabContext = createContext<FavoritesTabContextType | undefined>(
  undefined
);

export const useFavoritesTab = () => {
  const context = useContext(FavoritesTabContext);
  if (!context) {
    throw new Error(
      "useFavoritesTab must be used within a FavoritesTabProvider"
    );
  }
  return context;
};

interface FavoritesTabProviderProps {
  children: ReactNode;
}

export const FavoritesTabProvider: React.FC<FavoritesTabProviderProps> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<FavoritesTabType>("favorites");

  return (
    <FavoritesTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </FavoritesTabContext.Provider>
  );
};
