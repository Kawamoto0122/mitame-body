"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import ProfileSetup from "./ProfileSetup";
import { UserPlus, UserRound, Dumbbell, Target } from "lucide-react";

export default function UserSelect() {
  const { users, currentUserId, setCurrentUserId } = useAppContext();
  const [showNewUser, setShowNewUser] = useState(false);

  // If there's an active user and we're not explicitly creating one, hide this screen.
  if (currentUserId && !showNewUser) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-sky-50/90 backdrop-blur-md">
      
      {!showNewUser ? (
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm mb-3">
              MITAME-BODY
            </h1>
            <p className="text-sm font-medium text-slate-500">
              なりたい自分へ。アカウントを選択してください。
            </p>
          </div>

          <div className="space-y-3">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => setCurrentUserId(user.id)}
                className="w-full glass-panel p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform text-left group"
              >
                <div className="bg-sky-100 p-3 rounded-full text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <UserRound size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1"><Dumbbell size={12}/> {user.currentWeight}kg</span>
                    <span className="flex items-center gap-1"><Target size={12}/> {user.goalWeight}kg</span>
                  </div>
                </div>
              </button>
            ))}

            <button
              onClick={() => setShowNewUser(true)}
              className="w-full mt-4 border-2 border-dashed border-sky-300 hover:border-sky-500 hover:bg-sky-50 text-sky-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <UserPlus size={20} />
              新しいアカウントを作成
            </button>
          </div>
        </div>
      ) : (
        <ProfileSetup onCancel={users.length > 0 ? () => setShowNewUser(false) : undefined} />
      )}
    </div>
  );
}
