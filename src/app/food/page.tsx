"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useAppContext } from "@/context/AppContext";
import { Utensils, Camera, Plus, CheckCircle2, Flame, Beef } from "lucide-react";
import type { FoodRecord } from "@/types";

export default function FoodPage() {
  const { profile, userFoodRecords, setFoodRecords, foodRecords } = useAppContext();
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  if (!profile) return null;

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const displayDate = format(new Date(), "yyyy年MM月dd日", { locale: ja });

  const requiredProtein = profile.currentWeight ? profile.currentWeight * 2 : 0;
  
  const todaysRecords = userFoodRecords.filter(r => r.date === todayStr);
  const totalCalories = todaysRecords.reduce((sum, r) => sum + r.calories, 0);
  const totalProtein = todaysRecords.reduce((sum, r) => sum + r.protein, 0);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calories || !protein) return;

    const newRecord: FoodRecord = {
      id: crypto.randomUUID(),
      userId: profile.id,
      date: todayStr,
      calories: Number(calories),
      protein: Number(protein),
      isAiGenerated: false
    };

    setFoodRecords([...foodRecords, newRecord]);
    setCalories("");
    setProtein("");
  };

  const handleAiCamera = () => {
    setIsAiProcessing(true);
    // Simulate AI image recognition delay
    setTimeout(() => {
      const dummyCalories = Math.floor(Math.random() * 300) + 400; // 400-700
      const dummyProtein = Math.floor(Math.random() * 20) + 15; // 15-35
      
      const newRecord: FoodRecord = {
        id: crypto.randomUUID(),
        userId: profile.id,
        date: todayStr,
        calories: dummyCalories,
        protein: dummyProtein,
        isAiGenerated: true,
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" 
      };
      
      setFoodRecords([...foodRecords, newRecord]);
      setIsAiProcessing(false);
    }, 1500);
  };

  return (
    <div className="p-4 space-y-6 pt-6 mb-8 mt-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Utensils className="text-primary" />
          食事記録
        </h1>
        <p className="text-sm text-gray-400 mt-1">{displayDate} の記録</p>
      </div>

      {/* Target Summary */}
      <div className="flex gap-4">
        <div className="flex-1 glass-panel p-4 flex flex-col items-center justify-center">
          <Beef className="text-rose-400 mb-2" size={24} />
          <div className="text-sm text-gray-400">必要タンパク質</div>
          <div className="text-xl font-bold text-white flex items-baseline gap-1">
            {requiredProtein} <span className="text-sm font-normal text-gray-400">g</span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1">体重 × 2g</div>
        </div>
        
        <div className="flex-1 glass-panel p-4 flex flex-col items-center justify-center">
          <Flame className="text-orange-400 mb-2" size={24} />
          <div className="text-sm text-gray-400">本日の摂取量</div>
          <div className="text-xl font-bold text-white flex items-baseline gap-1">
            {totalProtein} <span className="text-sm font-normal text-gray-400">g</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-orange-400 h-full transition-all duration-700"
              style={{ width: `${Math.min(100, requiredProtein > 0 ? (totalProtein / requiredProtein) * 100 : 0)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <button 
            onClick={handleAiCamera}
            disabled={isAiProcessing}
            className="flex-1 bg-gradient-to-br from-indigo-500 to-purple-600 hover:opacity-90 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            {isAiProcessing ? (
              <span className="animate-pulse">AI解析中...</span>
            ) : (
              <>
                <Camera size={20} />
                写真でAI判定
              </>
            )}
          </button>
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-xs text-gray-500 uppercase">または手入力</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <form onSubmit={handleManualSubmit} className="glass-panel p-4 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">カロリー (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">タンパク質 (g)</label>
              <input
                type="number"
                value={protein}
                step="0.1"
                onChange={(e) => setProtein(e.target.value)}
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={!calories || !protein}
                className="bg-primary hover:bg-primary-focus disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-transform active:scale-95"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="mt-8 space-y-3">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">
          本日の記録 ({todaysRecords.length}件)
        </h2>
        {todaysRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            まだ記録がありません。
          </div>
        ) : (
          <div className="space-y-3">
            {todaysRecords.map((record) => (
              <div key={record.id} className="glass-panel p-4 flex gap-4 items-center bg-white/5 animate-in slide-in-from-right-4 duration-300">
                <div className="h-12 w-12 rounded-lg bg-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                  {record.imageUrl ? (
                    <img src={record.imageUrl} alt="Food" className="w-full h-full object-cover" />
                  ) : (
                    <Utensils className="text-gray-400" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">
                      {record.calories} <span className="text-xs font-normal text-gray-400">kcal</span>
                    </span>
                    {record.isAiGenerated && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        AI判定
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-rose-300 mt-0.5">
                    タンパク質 {record.protein}g
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
