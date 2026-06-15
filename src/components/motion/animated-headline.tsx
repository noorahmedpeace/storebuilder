"use client";

import { motion, useReducedMotion } from "motion/react";

const SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 24,
  mass: 0.9,
} as const;

export function AnimatedHeadline({
  text,
  className,
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;

  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      style={{ display: "inline-block" }}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.075, delayChildren: delay } },
      }}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="headline-word"
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "top",
          }}
        >
          <motion.span
            className="headline-word-inner"
            style={{ display: "inline-block", transformOrigin: "50% 85%" }}
            variants={{
              hidden: { y: "115%", rotateX: -22, scale: 0.92, opacity: 0 },
              show: { y: 0, rotateX: 0, scale: 1, opacity: 1 },
            }}
            transition={SPRING}
            whileHover={{
              y: -5,
              rotate: index % 2 === 0 ? -1.5 : 1.5,
              scale: 1.035,
              transition: { duration: 0.18 },
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00a0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
