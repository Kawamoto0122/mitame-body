"use client";

import { useAppContext } from "@/context/AppContext";
import { UserCircle, Settings as SettingsIcon, LogOut, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const { profile, logout } = useAppContext();

  if (!profile) return null;

  return (
    <div className="p-4 space-y-6 pt-6 mb-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <SettingsIcon className="text-primary" />
          各種設定
        </h1>
        <p className="text-sm text-slate-500 mt-1">アカウント管理・その他</p>
      </div>

      <div className="glass-panel p-5 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="bg-sky-100 p-4 rounded-full text-sky-500">
            <UserCircle size={32} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">現在のユーザー</div>
            <div className="text-xl font-bold text-slate-800">{profile.name}</div>
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <LogOut size={18} className="text-slate-500" />
          別のアカウントに切り替える
        </button>

        {/* Placeholder for future features */}
        <div className="space-y-2 pt-4">
          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-left transition-colors">
            <span className="font-medium text-slate-700">プロフィールの編集</span>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-left transition-colors">
            <span className="font-medium text-slate-700">データのバックアップ (近日公開)</span>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
