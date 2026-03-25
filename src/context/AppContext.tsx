"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { UserProfile, WeightRecord, FoodRecord } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface AppContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  weightRecords: WeightRecord[];
  setWeightRecords: (records: WeightRecord[]) => void;
  foodRecords: FoodRecord[];
  setFoodRecords: (records: FoodRecord[]) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Use new keys mitame_v3_* to clear old local memory and match the new architecture
  const [profile, setProfile] = useLocalStorage<UserProfile | null>("mitame_v3_profile", null);
  const [weightRecords, setWeightRecords] = useLocalStorage<WeightRecord[]>("mitame_v3_weight_records", []);
  const [foodRecords, setFoodRecords] = useLocalStorage<FoodRecord[]>("mitame_v3_food_records", []);

  const logout = () => {
    // Clear the current user profile
    setProfile(null);
    setWeightRecords([]);
    setFoodRecords([]);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        weightRecords,
        setWeightRecords,
        foodRecords,
        setFoodRecords,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
