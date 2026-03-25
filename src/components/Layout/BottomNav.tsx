"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Utensils, ActivitySquare, Settings } from "lucide-react";
import clsx from "clsx";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Top", href: "/", icon: Home },
    { name: "Training", href: "/training", icon: Dumbbell },
    { name: "Meals", href: "/food", icon: Utensils },
    { name: "Analysis", href: "/analysis", icon: ActivitySquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel rounded-t-2xl rounded-b-none border-b-0">
      <nav className="flex items-center justify-around h-16 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center justify-center w-full h-full flex-col space-y-1 transition-colors duration-200",
                isActive ? "text-primary" : "text-gray-400 hover:text-gray-300"
              )}
            >
              <Icon
                size={24}
                className={clsx("transition-transform duration-200", isActive && "scale-110")}
              />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
