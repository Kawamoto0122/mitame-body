"use client";

import { useAppContext } from "@/context/AppContext";
import ProfileSetup from "./ProfileSetup";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { profile } = useAppContext();

  // If there's no profile, only show the ProfileSetup screen
  if (!profile) {
    return <ProfileSetup />;
  }

  // Otherwise, render the app content
  return <>{children}</>;
}
