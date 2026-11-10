"use client";
import { MotionConfig } from "framer-motion";
import { createContext, useContext, type ReactNode } from "react";
import type { SiteSettings } from "@/lib/types";

export type PublicSettings = Pick<SiteSettings, "storeName" | "tagline" | "logoUrl" | "logoMode" | "announcement" | "social" | "contact" | "freeShippingThreshold" | "giftWrapPrice" | "footerColumns">;

const Ctx = createContext<PublicSettings | null>(null);
export const useSettings = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useSettings outside provider");
  return s;
};

export function Providers({ settings, children }: { settings: PublicSettings; children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <Ctx.Provider value={settings}>{children}</Ctx.Provider>
    </MotionConfig>
  );
}
