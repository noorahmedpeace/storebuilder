"use client";

import { useEffect, useRef } from "react";

type AutoplayVideoProps = {
  src: string;
  className?: string;
  label?: string;
  hidden?: boolean;
};

export function AutoplayVideo({
  src,
  className,
  label,
  hidden = false,
}: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const play = () => {
      void video.play().catch(() => {
        window.setTimeout(() => {
          void video.play().catch(() => undefined);
        }, 800);
      });
    };

    play();
    video.addEventListener("canplay", play);
    video.addEventListener("loadeddata", play);
    document.addEventListener("visibilitychange", play);

    return () => {
      video.removeEventListener("canplay", play);
      video.removeEventListener("loadeddata", play);
      document.removeEventListener("visibilitychange", play);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden={hidden}
      aria-label={hidden ? undefined : label}
    />
  );
}
