"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useAppContext } from "@/context/AppContext";
import { Utensils, Camera, Plus, Flame, Beef, Image as ImageIcon, Edit2, Trash2, X } from "lucide-react";
import type { FoodRecord } from "@/types";

export default function FoodPage() {
  const { profile, foodRecords, setFoodRecords } = useAppContext();
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!profile) return null;

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const displayDate = format(new Date(), "yyyy年MM月dd日", { locale: ja });

  const requiredProtein = profile.currentWeight ? profile.currentWeight * 2 : 0;
  
  const todaysRecords = foodRecords.filter(r => r.date === todayStr);
  const totalCalories = todaysRecords.reduce((sum, r) => sum + r.calories, 0);
  const totalProtein = todaysRecords.reduce((sum, r) => sum + r.protein, 0);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calories || !protein) return;

    if (editingId) {
      const updated = foodRecords.map(r => 
        r.id === editingId 
          ? { ...r, calories: Number(calories), protein: Number(protein) } 
          : r
      );
      setFoodRecords(updated);
      setEditingId(null);
    } else {
      const newRecord: FoodRecord = {
        id: crypto.randomUUID(),
        date: todayStr,
        calories: Number(calories),
        protein: Number(protein),
        isAiGenerated: false
      };
      setFoodRecords([...foodRecords, newRecord]);
    }

    setCalories("");
    setProtein("");
  };

  const handleEdit = (record: FoodRecord) => {
    setEditingId(record.id);
    setCalories(record.calories.toString());
    setProtein(record.protein.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("この食事記録を削除してよろしいですか？")) {
      setFoodRecords(foodRecords.filter(r => r.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setCalories("");
        setProtein("");
      }
    }
  };

  const processImageToDummyRecord = (file: File) => {
    setIsAiProcessing(true);
    
    // Scale down image to save localStorage quota (prevent 5MB limits)
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      const MAX_WIDTH = 300;
      let width = img.width;
      let height = img.height;
      if (width > MAX_WIDTH) {
        height = Math.floor((MAX_WIDTH / width) * height);
        width = MAX_WIDTH;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }
      // Compress to 60% quality JPEG
      const dataUrl = canvas.toDataURL("image/jpeg", 0.6); 
      URL.revokeObjectURL(objectUrl);
      
      // Artificial delay for "AI processing" feel
      setTimeout(() => {
        const dummyCalories = Math.floor(Math.random() * 300) + 400; // 400-700
        const dummyProtein = Math.floor(Math.random() * 20) + 15; // 15-35
        
        const newRecord: FoodRecord = {
          id: crypto.randomUUID(),
          date: todayStr,
          calories: dummyCalories,
          protein: dummyProtein,
          isAiGenerated: true,
          imageUrl: dataUrl 
        };
        
        setFoodRecords((prev) => [...prev, newRecord]);
        setIsAiProcessing(false);
      }, 1500);
    };

    img.onerror = () => {
      alert("画像の読み込みに失敗しました");
      setIsAiProcessing(false);
      URL.revokeObjectURL(objectUrl);
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageToDummyRecord(file);
    }
    // reset input so the same file can be selected again
    e.target.value = "";
  };

  return (
    <div className="p-4 space-y-6 pt-6 mb-8 mt-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <Utensils className="text-primary" />
          食事記録
        </h1>
        <p className="text-sm text-slate-500 mt-1">{displayDate} の記録</p>
      </div>

      {/* Target Summary */}
      <div className="flex gap-4">
        <div className="flex-1 glass-panel bg-rose-50 border-rose-100 p-4 flex flex-col items-center justify-center">
          <Beef className="text-rose-500 mb-2" size={24} />
          <div className="text-sm font-bold text-slate-600">必要タンパク質</div>
          <div className="text-xl font-black text-rose-600 flex items-baseline gap-1">
            {requiredProtein} <span className="text-sm font-bold text-rose-400">g</span>
          </div>
          <div className="text-[10px] text-rose-400 mt-1">体重 × 2g</div>
        </div>
        
        <div className="flex-1 glass-panel bg-orange-50 border-orange-100 p-4 flex flex-col items-center justify-center">
          <Flame className="text-orange-500 mb-2" size={24} />
          <div className="text-sm font-bold text-slate-600">本日の摂取量</div>
          <div className="text-xl font-black text-orange-600 flex items-baseline gap-1">
            {totalProtein} <span className="text-sm font-bold text-orange-400">g</span>
          </div>
          <div className="w-full bg-orange-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-orange-500 h-full transition-all duration-700"
              style={{ width: `${Math.min(100, requiredProtein > 0 ? (totalProtein / requiredProtein) * 100 : 0)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleFileChange} />

      {/* Input Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => cameraInputRef.current?.click()}
            disabled={isAiProcessing}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:opacity-90 text-white font-bold py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-indigo-500/20 disabled:opacity-70 disabled:pointer-events-none"
          >
            {isAiProcessing ? (
              <span className="animate-pulse flex items-center gap-2"><Camera size={18} /> 解析中...</span>
            ) : (
              <>
                <Camera size={18} />
                カメラで撮る
              </>
            )}
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isAiProcessing}
            className="bg-white border-2 border-indigo-100 hover:bg-indigo-50 text-indigo-600 font-bold py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm disabled:opacity-70 disabled:pointer-events-none"
          >
            <ImageIcon size={18} />
            写真を選ぶ
          </button>
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase">
            {editingId ? "記録の編集" : "または手入力"}
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleManualSubmit} className={`glass-panel p-4 space-y-4 transition-colors ${editingId ? 'bg-sky-50 border-sky-200' : 'bg-white'}`}>
          <div className="flex gap-4 items-end">
            <div className="flex-[2]">
              <label className="block text-xs font-bold text-slate-500 mb-1">カロリー (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              />
            </div>
            <div className="flex-[2]">
              <label className="block text-xs font-bold text-slate-500 mb-1">タンパク質 (g)</label>
              <input
                type="number"
                value={protein}
                step="0.1"
                onChange={(e) => setProtein(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <button
                type="submit"
                disabled={!calories || !protein}
                className={`${editingId ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-primary hover:bg-primary-focus'} disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-transform active:scale-95 shadow-md flex justify-center w-full`}
              >
                {editingId ? <CheckCircle2 size={20} /> : <Plus size={20} />}
              </button>
            </div>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setCalories("");
                setProtein("");
              }}
              className="text-xs text-slate-500 flex items-center gap-1 justify-center w-full mt-2 hover:text-slate-800"
            >
              <X size={14} /> 編集をキャンセル
            </button>
          )}
        </form>
      </div>

      {/* History */}
      <div className="mt-8 space-y-3">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">
          本日の記録 ({todaysRecords.length}件)
        </h2>
        {todaysRecords.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm font-medium">
            まだ記録がありません。
          </div>
        ) : (
          <div className="space-y-3">
            {todaysRecords.map((record) => (
              <div key={record.id} className={`glass-panel p-4 flex gap-4 items-center bg-white shadow-sm transition-all duration-300 ${editingId === record.id ? 'ring-2 ring-emerald-400' : ''}`}>
                <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                  {record.imageUrl ? (
                    <img src={record.imageUrl} alt="Food" className="w-full h-full object-cover" />
                  ) : (
                    <Utensils className="text-slate-400" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-lg">
                      {record.calories} <span className="text-xs font-normal text-slate-500">kcal</span>
                    </span>
                    {record.isAiGenerated && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-500 border border-indigo-200">
                        AI
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-rose-500 mt-0.5">
                    タンパク質 {record.protein}g
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button 
                    onClick={() => handleEdit(record)}
                    className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(record.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
