export type Gender = "male" | "female" | "other";

export interface UserProfile {
  id: string;
  name: string;
  age: number | null;
  gender: Gender | null;
  height: number | null;
  currentWeight: number | null;
  goalWeight: number | null;
  registered: boolean;
}

export type TrainingLevel = "初級" | "中級" | "上級" | "超人" | "鬼";

export interface WeightRecord {
  id: string;
  date: string; // ISO string
  weight: number;
}

export interface FoodRecord {
  id: string;
  date: string; // ISO format wrapper (e.g. "2023-10-01")
  calories: number;
  protein: number;
  imageUrl?: string;
  isAiGenerated?: boolean;
}
