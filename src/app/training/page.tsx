"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Dumbbell, Target, Zap, ChevronRight, CheckCircle2 } from "lucide-react";
import type { TrainingLevel } from "@/types";

const LEVELS: TrainingLevel[] = ["初級", "中級", "上級", "超人", "鬼"];
const AREAS = ["お腹（腹部）", "胸", "背中", "腕（二の腕）", "お尻", "太もも", "ふくらはぎ", "全身"];

interface Exercise {
  name: string;
  reps: string;
  sets: number;
}

export default function TrainingPage() {
  const { profile } = useAppContext();
  const [selectedLevel, setSelectedLevel] = useState<TrainingLevel>("初級");
  const [selectedArea, setSelectedArea] = useState<string>(AREAS[0]);
  const [menu, setMenu] = useState<Exercise[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!profile) return null;

  const generateMenu = () => {
    setIsGenerating(true);
    setMenu(null);
    
    setTimeout(() => {
      const baseReps = selectedLevel === "初級" ? 10 : selectedLevel === "中級" ? 15 : selectedLevel === "上級" ? 20 : selectedLevel === "超人" ? 50 : 100;
      const baseSets = selectedLevel === "初級" ? 2 : selectedLevel === "中級" ? 3 : selectedLevel === "上級" ? 4 : selectedLevel === "超人" ? 5 : 10;
      
      const newMenu: Exercise[] = [
        { name: `${selectedArea}特化ウォームアップ`, reps: "3分", sets: 1 },
        { name: `${selectedArea}メイン種目 A`, reps: `${baseReps}回`, sets: baseSets },
        { name: `${selectedArea}メイン種目 B`, reps: `${baseReps}回`, sets: baseSets },
        { name: `追い込みアイソメトリック`, reps: `${baseReps}秒`, sets: selectedLevel === "初級" ? 1 : 3 },
      ];
      setMenu(newMenu);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="p-4 space-y-6 pt-6 mb-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <Dumbbell className="text-primary" />
          筋トレメニュー立案
        </h1>
        <p className="text-sm text-slate-500 mt-1">あなた専用のトレーニングメニューを作成します</p>
      </div>

      <div className="space-y-4">
        {/* Level Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
            <Zap size={16} className="text-yellow-500" />
            レベル選択
          </label>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedLevel === level
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Area Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
            <Target size={16} className="text-rose-500" />
            重点部位
          </label>
          <div className="grid grid-cols-2 gap-2">
            {AREAS.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`p-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
                  selectedArea === area
                    ? "bg-emerald-50 border-2 border-emerald-400 text-emerald-700"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateMenu}
          disabled={isGenerating}
          className="w-full mt-6 bg-gradient-to-r from-primary to-emerald-500 hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-md transition-transform active:scale-95 flex justify-center items-center gap-2"
        >
          {isGenerating ? (
            <span className="animate-pulse">メニュー作成中...</span>
          ) : (
            <>
              メニューを生成する <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>

      {/* Generated Menu Display */}
      {menu && (
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
            <CheckCircle2 className="text-primary" />
            本日の専用メニュー
          </h2>
          <div className="space-y-3">
            {menu.map((exercise, i) => (
              <div key={i} className="glass-panel p-4 flex justify-between items-center bg-white shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{exercise.name}</h3>
                  <div className="text-xs text-slate-500 mt-1">
                    {profile.age ? `${profile.age}歳` : ""} {profile.gender === "male" ? "男性" : profile.gender === "female" ? "女性" : ""} 向け調整済
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-primary">{exercise.reps}</div>
                  <div className="text-sm font-medium text-slate-500">× {exercise.sets} セット</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
