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
    video.loop = true;
    video.playbackRate = 1;
    video.load();

    const play = () => {
      if (video.readyState > 0 && video.currentTime === 0) {
        video.currentTime = 0.01;
      }
      void video.play().catch(() => {
        window.setTimeout(() => {
          void video.play().catch(() => undefined);
        }, 800);
      });
    };

    const restart = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = 0.01;
      } else {
        video.currentTime = 0;
      }
      play();
    };

    const retry = window.setInterval(() => {
      if (video.paused || video.ended) play();
      if (
        Number.isFinite(video.duration) &&
        video.duration > 0 &&
        video.currentTime >= video.duration - 0.2
      ) {
        restart();
      }
    }, 500);

    play();
    video.addEventListener("canplay", play);
    video.addEventListener("loadeddata", play);
    video.addEventListener("ended", restart);
    video.addEventListener("pause", play);
    window.addEventListener("scroll", play, { passive: true });
    window.addEventListener("pointerdown", play);
    window.addEventListener("touchstart", play, { passive: true });
    document.addEventListener("visibilitychange", play);

    return () => {
      window.clearInterval(retry);
      video.removeEventListener("canplay", play);
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("ended", restart);
      video.removeEventListener("pause", play);
      window.removeEventListener("scroll", play);
      window.removeEventListener("pointerdown", play);
      window.removeEventListener("touchstart", play);
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
      controls={false}
      disablePictureInPicture
      aria-hidden={hidden}
      aria-label={hidden ? undefined : label}
    />
  );
}
