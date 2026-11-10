"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/** Fades/slides a section in when it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: { children: ReactNode; className?: string; delay?: number; y?: number; as?: "div" | "section" | "li" }) {
  const reduce = useReducedMotion();
  const C = motion[as];
  return (
    <C className={className} initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 0.8, ease, delay }}>
      {children}
    </C>
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } };
const item: Variants = { hidden: { opacity: 0, y: 24, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease } } };

/** Grid/list whose children enter one after another. */
export function Stagger({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" }) {
  const reduce = useReducedMotion();
  const C = motion[as];
  return (
    <C className={className} variants={container} initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, margin: "0px 0px -8% 0px" }}>
      {children}
    </C>
  );
}
export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  const C = motion[as];
  return (
    <C className={cn(className)} variants={item}>
      {children}
    </C>
  );
}
