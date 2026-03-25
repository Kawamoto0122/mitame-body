"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Gender } from "@/types";

interface ProfileSetupProps {
  onCancel?: () => void;
}

export default function ProfileSetup({ onCancel }: ProfileSetupProps) {
  const { updateProfile } = useAppContext();
  
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<Gender>("male");
  const [height, setHeight] = useState<string>("");
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [goalWeight, setGoalWeight] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      id: crypto.randomUUID(), // New user gets new ID
      name,
      age: Number(age),
      gender,
      height: Number(height),
      currentWeight: Number(currentWeight),
      goalWeight: Number(goalWeight),
      registered: true,
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-sky-50/90 backdrop-blur-md">
      <div className="glass-panel w-full max-w-sm p-6 overflow-y-auto max-h-[90vh]">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">プロフィール作成</h2>
          <p className="text-sm text-slate-500">新しいアカウントの情報を入力してください</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">お名前 / ニックネーム</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              placeholder="例: たろう"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">年齢</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">性別</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">その他</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">身長 (cm)</label>
            <input
              type="number"
              required
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">現在の体重</label>
              <input
                type="number"
                required
                step="0.1"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">目標体重 (kg)</label>
              <input
                type="number"
                required
                step="0.1"
                placeholder="65.0"
                value={goalWeight}
                onChange={(e) => setGoalWeight(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3 rounded-lg transition-colors"
              >
                キャンセル
              </button>
            )}
            <button
              type="submit"
              className="flex-[2] bg-primary hover:bg-primary-focus text-white font-bold py-3 rounded-lg transition-transform active:scale-95 shadow-md shadow-primary/30"
            >
              作成する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
