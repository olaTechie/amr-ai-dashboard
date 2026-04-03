"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function StatCounter({ value, label, color = "white" }: { value: number; label: string; color?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <motion.div
        className="text-4xl font-extrabold"
        style={{ color, textShadow: `0 0 20px ${color}33` }}
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {display.toLocaleString()}
      </motion.div>
      <div className="text-[9px] uppercase tracking-[1.5px] text-white/50 mt-1">{label}</div>
    </div>
  );
}
