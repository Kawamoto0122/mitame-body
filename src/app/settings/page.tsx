"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { UserCircle, Settings as SettingsIcon, Trash2, ChevronRight, Download } from "lucide-react";
import ProfileSetup from "@/components/Account/ProfileSetup";

export default function SettingsPage() {
  const { profile, weightRecords, foodRecords, logout } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);

  if (!profile) return null;

  const handleBackup = () => {
    const dataToBackup = {
      profile,
      weightRecords,
      foodRecords,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mitame-body-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("バックアップデータをダウンロードしました。");
  };

  return (
    <div className="p-4 space-y-6 pt-6 mb-8 mt-4">
      {isEditing && (
        <ProfileSetup 
          initialProfile={profile} 
          onCancel={() => setIsEditing(false)} 
        />
      )}

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <SettingsIcon className="text-primary" />
          各種設定
        </h1>
        <p className="text-sm text-slate-500 mt-1">アプリとデータの管理</p>
      </div>

      <div className="glass-panel bg-white p-5 space-y-6 shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="bg-sky-100 p-4 rounded-full text-sky-500">
            <UserCircle size={32} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 tracking-wider mb-1">現在のプロフィール</div>
            <div className="text-xl font-bold text-slate-800">{profile.name}</div>
            <div className="text-xs text-slate-500 mt-1">Supabase連携中</div>
          </div>
        </div>

        <button 
          onClick={() => {
            if (window.confirm("この端末からログアウト状態にしますか？(Supabase上のデータは消えません)")) {
              logout();
            }
          }}
          className="w-full bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-sm"
        >
          <Trash2 size={18} />
          ログアウト (リセット)
        </button>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left transition-colors"
          >
            <span className="font-medium text-slate-700">プロフィールの編集</span>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
          
          <button 
            onClick={handleBackup}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <span>データのバックアップ (JSON)</span>
            </div>
            <Download size={18} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
