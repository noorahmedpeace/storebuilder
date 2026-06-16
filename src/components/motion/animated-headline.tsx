"use client";

import { motion, useReducedMotion } from "motion/react";

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
            paddingBottom: "0.02em",
          }}
        >
          <motion.span
            className="headline-word-inner"
            style={{ display: "inline-block" }}
            variants={{
              hidden: { y: "0.55em", filter: "blur(7px)", opacity: 0 },
              show: {
                y: 0,
                filter: "blur(0px)",
                opacity: 1,
              },
            }}
            transition={{
              duration: 0.62,
              ease: [0.17, 0.84, 0.28, 1],
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
