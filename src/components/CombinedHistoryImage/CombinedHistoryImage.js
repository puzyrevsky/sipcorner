import { useEffect, useRef, useState } from "react";
import styles from "./CombinedHistoryImage.module.scss";
import CircularProgress from "@mui/material/CircularProgress";

const CombinedHistoryImage = ({
  background,
  cocktail,
  isStub,
  x,
  y,
  title,
  titleX,
  titleY,
  onWidth,
  onImageLoad,
}) => {
    
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);


// 

const getYOffset = () => {
    const h = window.innerHeight;
    if (h <= 350) return 35;
    if (h <= 400) return 40;
    if (h <= 450) return 45; 
    if (h <= 500) return 50; 
    if (h <= 530) return 55; 
    if (h <= 670) return 60;
    return 70;
};

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let cancelled = false;

    const bgImg = new Image();
    const cocktailImg = new Image();
    let loaded = 0;

    const tryDraw = () => {
      if (cancelled) return;
      if (
        bgImg.complete &&
        bgImg.naturalWidth > 0 &&
        cocktailImg.complete &&
        cocktailImg.naturalWidth > 0
      ) {
        const aspectRatio = bgImg.naturalWidth / bgImg.naturalHeight;
        const maxWidth = 450;
        const availableWidth = Math.min(window.innerWidth, maxWidth);

        let targetHeight = window.innerHeight * 0.82;
        let targetWidth = targetHeight * aspectRatio;

        if (targetWidth > availableWidth) {
          targetWidth = availableWidth;
          targetHeight = targetWidth / aspectRatio;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        onWidth?.(targetWidth);

        // фон
        ctx.drawImage(bgImg, 0, 0, targetWidth, targetHeight);

        // коктейль
        // const cocktailW = targetWidth * 0.8;
        const cocktailW = isStub ? (targetWidth * 0.7) : (targetWidth * 0.8);
        const cocktailH =
          cocktailImg.naturalHeight * (cocktailW / cocktailImg.naturalWidth);
        const posX = (targetWidth * x) / 100 - cocktailW / 2;
        const posY =
          y != null
            ? (targetHeight * y) / 100 - cocktailH / 2 - getYOffset()
            : targetHeight - cocktailH - 35;

        ctx.drawImage(cocktailImg, posX, posY, cocktailW, cocktailH);

        setReady(true);
        setError(false);
        onImageLoad?.();
      }
    };

    const handleLoad = () => {
        loaded++;
        if (loaded === 2) {
            tryDraw();
        }
    };

    const handleError = () => {
      if (!cancelled) {
        setError(true);
        setReady(true); // отключаем спиннер, показываем fallback
      }
    };

    bgImg.onload = handleLoad;
    cocktailImg.onload = handleLoad;
    bgImg.onerror = handleError;
    cocktailImg.onerror = handleError;

    bgImg.src = background;
    cocktailImg.src = cocktail;

    // таймаут на случай зависшей загрузки
    const timeout = setTimeout(() => {
      if (!ready && !error) {
        setError(true);
        setReady(true);
      }
    }, 10000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [background, cocktail, x, y, onWidth, onImageLoad]);

  return (
    <div
      style={{
        position: "relative",
        margin: "0 auto",
        display: "block",
        maxWidth: "450px",
        // height: window.innerHeight * 0.82, // фиксированная высота
      }}
    >
      {/* Canvas всегда есть */}
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          height: "auto",
          width: "100%",
          margin: "0 auto",
          borderRadius: "0 0 13px 13px",
          opacity: ready && !error ? 1 : 0, // 👈 пока грузится — прозрачный
          transition: "opacity 0.2s ease",
        }}
      />

      {/* Спиннер пока грузится */}
      {!ready && !error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "#0e5541" }} />
        </div>
      )}

      {/* Fallback если ошибка */}
      {error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "0 0 13px 13px",
          }}
        >
          <p style={{ color: "#0e5541" }}>Ошибка загрузки</p>
        </div>
      )}

      {/* Заголовок (если есть) */}
      {ready && !error && title && (
        <p
          className={styles.userDrinksHistoryTitle}
          style={{
            top: `${titleY}%`,
            left: `${titleX}%`,
            position: "absolute",
          }}
        >
          {title}
        </p>
      )}
    </div>
  );
};

export default CombinedHistoryImage;
