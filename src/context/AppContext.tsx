"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { UserProfile, WeightRecord, FoodRecord } from "@/types";
import { supabase } from "@/lib/supabase";

interface AppContextType {
  profile: UserProfile | null;
  saveProfile: (profile: UserProfile) => Promise<void>;
  
  weightRecords: WeightRecord[];
  addWeightRecord: (record: WeightRecord) => Promise<void>;
  deleteWeightRecord: (id: string) => Promise<void>;
  
  foodRecords: FoodRecord[];
  addFoodRecord: (record: FoodRecord) => Promise<void>;
  updateFoodRecord: (record: FoodRecord) => Promise<void>;
  deleteFoodRecord: (id: string) => Promise<void>;
  
  logout: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [foodRecords, setFoodRecords] = useState<FoodRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all initial data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .single();
          
        if (profileData && !profileError) {
          setProfile({
            ...profileData,
            currentWeight: profileData.current_weight,
            goalWeight: profileData.goal_weight
          } as any);
        }

        // Fetch Weight Records
        const { data: weightData, error: weightError } = await supabase
          .from('weight_records')
          .select('*')
          .order('date', { ascending: true });
          
        if (weightData && !weightError) {
          setWeightRecords(weightData as WeightRecord[]);
        }

        // Fetch Food Records
        const { data: foodData, error: foodError } = await supabase
          .from('food_records')
          .select('*')
          .order('date', { ascending: true });
          
        if (foodData && !foodError) {
          setFoodRecords(foodData.map(d => ({
            ...d,
            imageUrl: d.image_url,
            isAiGenerated: d.is_ai_generated
          })) as any);
        }

      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const saveProfile = async (p: UserProfile) => {
    // Convert camelCase to snake_case for DB
    const dbProfile = {
      id: p.id,
      name: p.name,
      age: p.age,
      gender: p.gender,
      height: p.height,
      current_weight: p.currentWeight,
      goal_weight: p.goalWeight,
      registered: p.registered
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(dbProfile);
      
    if (!error) {
      setProfile(p);
    } else {
      console.error("Error saving profile", error);
    }
  };

  const addWeightRecord = async (record: WeightRecord) => {
    const { error } = await supabase
      .from('weight_records')
      .insert(record);
      
    if (!error) {
      setWeightRecords(prev => [...prev, record].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } else {
      console.error("Error adding weight record", error);
    }
  };

  const deleteWeightRecord = async (id: string) => {
    const { error } = await supabase
      .from('weight_records')
      .delete()
      .eq('id', id);
      
    if (!error) {
      setWeightRecords(prev => prev.filter(r => r.id !== id));
    } else {
      console.error("Error deleting weight record", error);
    }
  };

  const addFoodRecord = async (record: FoodRecord) => {
    const dbRecord = {
      id: record.id,
      date: record.date,
      calories: record.calories,
      protein: record.protein,
      image_url: record.imageUrl,
      is_ai_generated: record.isAiGenerated
    };

    const { error } = await supabase
      .from('food_records')
      .insert(dbRecord);
      
    if (!error) {
      setFoodRecords(prev => [...prev, record]);
    } else {
      console.error("Error adding food record", error);
    }
  };

  const updateFoodRecord = async (record: FoodRecord) => {
    const dbRecord = {
      calories: record.calories,
      protein: record.protein,
      image_url: record.imageUrl,
      is_ai_generated: record.isAiGenerated
    };

    const { error } = await supabase
      .from('food_records')
      .update(dbRecord)
      .eq('id', record.id);
      
    if (!error) {
      setFoodRecords(prev => prev.map(r => r.id === record.id ? record : r));
    } else {
      console.error("Error updating food record", error);
    }
  };

  const deleteFoodRecord = async (id: string) => {
    const { error } = await supabase
      .from('food_records')
      .delete()
      .eq('id', id);
      
    if (!error) {
      setFoodRecords(prev => prev.filter(r => r.id !== id));
    } else {
      console.error("Error deleting food record", error);
    }
  };

  const logout = () => {
    setProfile(null);
    setWeightRecords([]);
    setFoodRecords([]);
    // Remove old local storage data
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("mitame_v4_profile");
      window.localStorage.removeItem("mitame_v4_weight_records");
      window.localStorage.removeItem("mitame_v4_food_records");
    }
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        saveProfile,
        weightRecords,
        addWeightRecord,
        deleteWeightRecord,
        foodRecords,
        addFoodRecord,
        updateFoodRecord,
        deleteFoodRecord,
        logout,
        isLoading
      }}
    >
      {/* Show loading state to prevent flickering before data is loaded, unless maybe the app can handle null profile natively everywhere */}
      {/* For this app, simply rendering children and letting components handle !profile is fine. */}
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
