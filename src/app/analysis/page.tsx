"use client";

import { useState, useMemo, useRef } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useAppContext } from "@/context/AppContext";
import { ActivitySquare, Camera, Plus, TrendingDown, Target, Search } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { WeightRecord } from "@/types";

const AREA_DATA = [
  {"部位": "お腹（腹部）", "狙い": "内臓脂肪＆皮下脂肪減少", "効果的な食べ物": "鶏むね肉、ゆで卵、納豆、オートミール、ブロッコリー", "理由": "高タンパク＋低GIで脂肪蓄積を抑える", "効果的な運動": "プランク、レッグレイズ、HIIT", "ポイント": "有酸素＋体幹が最重要"},
  {"部位": "胸", "狙い": "脂肪を落としつつ形を維持", "効果的な食べ物": "鶏むね肉、豆腐、プロテイン", "理由": "筋肉維持で“たるみ防止”", "効果的な運動": "プッシュアップ、ベンチプレス", "ポイント": "大胸筋を落とさない"},
  {"部位": "背中", "狙い": "脂肪＋姿勢改善", "効果的な食べ物": "サバ、鮭、ナッツ類", "理由": "良質脂質で代謝UP", "効果的な運動": "ラットプルダウン、懸垂", "ポイント": "姿勢改善＝見た目激変"},
  {"部位": "腕（二の腕）", "狙い": "たるみ改善", "効果的な食べ物": "鶏むね肉、ゆで卵、ヨーグルト", "理由": "筋肉合成を促す", "効果的な運動": "トライセプスディップス、腕立て", "ポイント": "回数多めで引き締め"},
  {"部位": "お尻", "狙い": "ヒップアップ", "効果的な食べ物": "牛赤身肉、卵、チーズ", "理由": "筋肥大に必要", "効果的な運動": "スクワット、ヒップスラスト", "ポイント": "大きい筋肉＝代謝UP"},
  {"部位": "太もも", "狙い": "脂肪燃焼＋引き締め", "効果的な食べ物": "鶏肉、玄米、さつまいも", "理由": "エネルギー効率◎", "効果的な運動": "スクワット、ランジ", "ポイント": "有酸素とセット必須"},
  {"部位": "ふくらはぎ", "狙い": "むくみ改善", "効果的な食べ物": "バナナ、ほうれん草、水", "理由": "カリウムでむくみ除去", "効果的な運動": "カーフレイズ、ウォーキング", "ポイント": "継続が超重要"},
  {"部位": "顔", "狙い": "むくみ・脂肪", "効果的な食べ物": "水、野菜、塩分控えめ", "理由": "むくみが主原因", "効果的な運動": "有酸素運動＋表情筋トレ", "ポイント": "塩分と睡眠が鍵"}
];

export default function AnalysisPage() {
  const { profile, saveProfile, weightRecords, addWeightRecord } = useAppContext();
  const [selectedArea, setSelectedArea] = useState(AREA_DATA[0]);
  const [weightInput, setWeightInput] = useState("");
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);

  if (!profile) return null;

  const targetDiff = useMemo(() => {
    if (!profile.currentWeight || !profile.goalWeight) return null;
    return (profile.currentWeight - profile.goalWeight).toFixed(1);
  }, [profile.currentWeight, profile.goalWeight]);

  const handleManualWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightInput) return;
    saveWeight(Number(weightInput));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFakeOcr = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingOcr(true);
    // 擬似的なOCR処理（数秒待ってからランダムな体重を入力）
    setTimeout(() => {
      const baseWeight = profile.currentWeight || 60;
      const dummyWeight = Number((baseWeight + (Math.random() * 2 - 1)).toFixed(1));
      saveWeight(dummyWeight);
      setIsProcessingOcr(false);
    }, 1500);

    // 同じファイルを再度選べるようにリセット
    e.target.value = "";
  };

  const saveWeight = async (w: number) => {
    const newRecord: WeightRecord = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      weight: w
    };
    await addWeightRecord(newRecord);
    
    // Update profile's current weight.
    await saveProfile({ ...profile, currentWeight: w });
    
    setWeightInput("");
  };

  const chartData = weightRecords.map(r => ({
    date: format(new Date(r.date), "MM/dd"),
    weight: r.weight,
  })).slice(-14);

  return (
    <div className="p-4 space-y-6 pt-6 mb-8 mt-4">
      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFakeOcr} 
      />

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <ActivitySquare className="text-primary" />
          自己分析
        </h1>
        <p className="text-sm text-slate-500 mt-1">体の知識と進捗のトラッキング</p>
      </div>

      {/* Progress & Weight Input */}
      <div className="glass-panel bg-white p-5 space-y-4 relative overflow-hidden shadow-sm">
        <div className="flex justify-between items-center z-10 relative">
          <div>
            <div className="text-sm font-bold text-slate-500 flex items-center gap-1"><Target size={14}/> 目標まであと</div>
            <div className="text-3xl font-black text-slate-800 mt-1">
              {targetDiff !== null && Number(targetDiff) > 0 ? (
                <>{targetDiff} <span className="text-sm font-bold text-slate-500">kg</span></>
              ) : targetDiff !== null && Number(targetDiff) <= 0 ? (
                <span className="text-emerald-500 text-xl font-bold">達成！</span>
              ) : (
                "-"
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-slate-500">現在の体重</div>
            <div className="text-xl font-black text-slate-800 mt-1">
              {profile.currentWeight || "-"} <span className="text-sm font-bold text-slate-500">kg</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 relative z-10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">体重記録</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingOcr}
              className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 p-2.5 rounded-xl flex-shrink-0 transition-colors shadow-sm"
            >
              {isProcessingOcr ? <Search className="animate-spin" size={20} /> : <Camera size={20} />}
            </button>
            <form onSubmit={handleManualWeight} className="flex flex-1 gap-2">
              <input
                type="number"
                step="0.1"
                placeholder="60.5"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary font-bold shadow-sm"
              />
              <button
                type="submit"
                disabled={!weightInput}
                className="bg-primary hover:bg-primary-focus disabled:opacity-50 text-white p-2.5 flex-shrink-0 rounded-xl transition-transform active:scale-95 shadow-md shadow-primary/30"
              >
                <Plus size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="glass-panel bg-white p-4 h-64 mb-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-600 mb-4 flex items-center gap-2">
            <TrendingDown size={16} />
            体重推移
          </h3>
          <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#ffffff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Area Selector Data */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">部位別 落とし方</h2>
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
          {AREA_DATA.map((area) => (
            <button
              key={area.部位}
              onClick={() => setSelectedArea(area)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${
                selectedArea.部位 === area.部位
                  ? "bg-slate-800 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {area.部位}
            </button>
          ))}
        </div>

        <div className="glass-panel bg-white p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
          <div>
            <div className="text-xs text-primary font-black uppercase tracking-wider mb-1">狙い</div>
            <div className="text-slate-800 font-bold text-lg">{selectedArea.狙い}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
              <div className="text-xs text-emerald-600 font-black mb-1">効果的な食べ物</div>
              <div className="text-sm font-medium text-slate-700">{selectedArea.効果的な食べ物}</div>
            </div>
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl">
              <div className="text-xs text-rose-600 font-black mb-1">効果的な運動</div>
              <div className="text-sm font-medium text-slate-700">{selectedArea.効果的な運動}</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-black uppercase tracking-wider mb-1">理由</div>
            <div className="text-sm font-medium text-slate-600">{selectedArea.理由}</div>
          </div>

          <div className="bg-sky-50 p-4 rounded-xl border-l-4 border-sky-400">
            <div className="text-xs text-sky-600 font-black mb-1">ポイント</div>
            <div className="text-sm text-slate-800 font-black">{selectedArea.ポイント}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
