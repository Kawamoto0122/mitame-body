"use client";

import { useMemo } from "react";
import { format, differenceInDays } from "date-fns";
import { ja } from "date-fns/locale";
import { useAppContext } from "@/context/AppContext";
import { AlertTriangle, TrendingDown, Target, Info } from "lucide-react";

const QUOTES = [
  "筋肉は裏切らない！",
  "ローマは一日にして成らず。美しい体も同じ。",
  "今日の努力が、明日の「いいね」を作る。",
  "限界を決めるのは自分自身。もっといける！",
  "少しずつでも前へ。継続こそが最大の力。",
  "鏡の前の自分に、誇れる体になろう。",
  "食べ物は体を作り、思考は人生を作る。",
  "No Pain, No Gain."
];

export default function Home() {
  const { profile, userWeightRecords } = useAppContext();

  // Pick a stable quote based on the day of the year
  const quote = useMemo(() => {
    const dayOfYear = Math.floor(Date.now() / 86400000);
    return QUOTES[dayOfYear % QUOTES.length];
  }, []);

  const requiresMeasurement = useMemo(() => {
    if (userWeightRecords.length === 0) return true;
    const sorted = [...userWeightRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = sorted[0];
    const daysSince = differenceInDays(new Date(), new Date(latest.date));
    return daysSince >= 7;
  }, [userWeightRecords]);

  if (!profile) return null;

  const targetDiff = useMemo(() => {
    if (!profile?.currentWeight || !profile?.goalWeight) return null;
    return (profile.currentWeight - profile.goalWeight).toFixed(1);
  }, [profile?.currentWeight, profile?.goalWeight]);

  const todayStr = format(new Date(), "yyyy年MM月dd日 (E)", { locale: ja });

  return (
    <div className="p-4 space-y-6 pt-8">
      {/* Header / Date */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
            MITAME-BODY
          </h1>
          <p className="text-gray-400 font-medium mt-1">{todayStr}</p>
        </div>
      </div>

      {requiresMeasurement && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 backdrop-blur-md">
          <AlertTriangle className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-500 font-bold mb-1">体重計測のお願い</h3>
            <p className="text-sm text-red-200">
              1週間以上、体重の記録がありません。自己分析画面から記録を追加し、現状を把握しましょう！
            </p>
          </div>
        </div>
      )}

      {/* Progress Card */}
      <div className="glass-panel p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Target size={100} />
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="text-primary" />
            目標到達まで
          </h2>
          
          <div className="flex items-end gap-2">
            {targetDiff !== null && Number(targetDiff) > 0 ? (
              <>
                <span className="text-5xl font-black text-white">{targetDiff}</span>
                <span className="text-xl text-gray-400 mb-1">kg</span>
              </>
            ) : targetDiff !== null && Number(targetDiff) <= 0 ? (
              <span className="text-3xl font-bold text-emerald-400">目標達成！🎉</span>
            ) : (
              <span className="text-xl text-gray-400">データがありません</span>
            )}
          </div>

          <div className="flex justify-between mt-4 text-sm text-slate-500 pt-4 border-t border-slate-100">
            <div>
              現在の体重: <span className="text-slate-800 font-bold">{profile?.currentWeight || "-"}</span> kg
            </div>
            <div>
              目標の体重: <span className="text-slate-800 font-bold">{profile?.goalWeight || "-"}</span> kg
            </div>
          </div>
        </div>
      </div>

      {/* Quote Card */}
      <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-6 relative">
        <div className="absolute -top-3 -left-2 text-6xl text-indigo-400 opacity-20 font-serif">"</div>
        <h2 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2">
          <Info size={16} /> 今日のひとこと
        </h2>
        <p className="text-lg font-bold text-white leading-relaxed pt-2">
          {quote}
        </p>
      </div>
      
    </div>
  );
}
