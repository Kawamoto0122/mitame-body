"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { UserProfile, WeightRecord, FoodRecord } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface AppContextType {
  users: UserProfile[];
  setUsers: (users: UserProfile[]) => void;
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
  profile: UserProfile | null;
  updateProfile: (profile: UserProfile) => void;
  weightRecords: WeightRecord[];
  setWeightRecords: (records: WeightRecord[]) => void;
  foodRecords: FoodRecord[];
  setFoodRecords: (records: FoodRecord[]) => void;
  userWeightRecords: WeightRecord[];
  userFoodRecords: FoodRecord[];
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Use new keys mitame_v2_* to clear old local memory
  const [users, setUsers] = useLocalStorage<UserProfile[]>("mitame_v2_users", []);
  const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>("mitame_v2_currentUserId", null);
  const [weightRecords, setWeightRecords] = useLocalStorage<WeightRecord[]>("mitame_v2_weight_records", []);
  const [foodRecords, setFoodRecords] = useLocalStorage<FoodRecord[]>("mitame_v2_food_records", []);

  const profile = users.find(u => u.id === currentUserId) || null;

  const updateProfile = (updatedProfile: UserProfile) => {
    setUsers(prev => {
      const exists = prev.find(p => p.id === updatedProfile.id);
      if (exists) {
        return prev.map(p => p.id === updatedProfile.id ? updatedProfile : p);
      }
      return [...prev, updatedProfile];
    });
    if (!currentUserId) setCurrentUserId(updatedProfile.id);
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const userWeightRecords = currentUserId ? weightRecords.filter(r => r.userId === currentUserId) : [];
  const userFoodRecords = currentUserId ? foodRecords.filter(r => r.userId === currentUserId) : [];

  return (
    <AppContext.Provider
      value={{
        users,
        setUsers,
        currentUserId,
        setCurrentUserId,
        profile,
        updateProfile,
        weightRecords,
        setWeightRecords,
        foodRecords,
        setFoodRecords,
        userWeightRecords,
        userFoodRecords,
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
