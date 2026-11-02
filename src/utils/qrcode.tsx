import React from 'react';

/**
 * Deterministic SVG QR Code Generator
 * Generates an authentic QR-pattern vector matrix from input text (e.g., student NIS)
 */
export const QrCodeSvg: React.FC<{
  value: string;
  size?: number;
  className?: string;
}> = ({ value, size = 100, className = '' }) => {
  // Generate pseudo-random deterministic 21x21 QR matrix based on value hash
  const matrixSize = 21;
  const matrix: boolean[][] = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

  // 1. Draw Finder Patterns (Top-Left, Top-Right, Bottom-Left)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[startY + r][startX + c] = isBorder || isCenter;
      }
    }
  };

  drawFinder(0, 0); // Top-Left
  drawFinder(14, 0); // Top-Right
  drawFinder(0, 14); // Bottom-Left

  // 2. Timing Patterns (horizontal & vertical lines)
  for (let i = 8; i < 13; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Simple hash for payload modules
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  // Seed fill in data area
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Don't overwrite finder patterns & separators
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c > 12;
      const inBL = r > 12 && c < 8;
      const inTiming = r === 6 || c === 6;

      if (!inTL && !inTR && !inBL && !inTiming) {
        // Bit calculation using prime congruences
        const bit = ((hash ^ (r * 13 + c * 37 + (r ^ c))) % 7) > 2;
        matrix[r][c] = bit;
      }
    }
  }

  const cellSize = size / matrixSize;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`bg-white p-1 rounded ${className}`}
      aria-label={`QR Code for ${value}`}
    >
      <rect width={size} height={size} fill="#ffffff" />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.1}
              height={cellSize + 0.1}
              fill="#0f172a"
            />
          ) : null
        )
      )}
    </svg>
  );
};

/**
 * Deterministic Barcode SVG Generator (Code 39/128 aesthetic)
 */
export const BarcodeSvg: React.FC<{
  value: string;
  width?: number;
  height?: number;
  className?: string;
}> = ({ value, width = 160, height = 36, className = '' }) => {
  // Generate consistent bar widths based on char codes
  const bars: { width: number; isBlack: boolean }[] = [];
  bars.push({ width: 3, isBlack: true });
  bars.push({ width: 2, isBlack: false });
  bars.push({ width: 2, isBlack: true });
  bars.push({ width: 3, isBlack: false });

  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    const b1 = (code % 3) + 1;
    const s1 = ((code >> 1) % 2) + 1;
    const b2 = ((code >> 2) % 3) + 1;
    const s2 = ((code >> 3) % 2) + 1;

    bars.push({ width: b1, isBlack: true });
    bars.push({ width: s1, isBlack: false });
    bars.push({ width: b2, isBlack: true });
    bars.push({ width: s2, isBlack: false });
  }

  bars.push({ width: 2, isBlack: true });
  bars.push({ width: 3, isBlack: false });
  bars.push({ width: 3, isBlack: true });

  const totalUnits = bars.reduce((acc, b) => acc + b.width, 0);
  const unitPx = width / totalUnits;

  let currentX = 0;

  return (
    <div className={`inline-flex flex-col items-center bg-white p-1.5 rounded ${className}`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <rect width={width} height={height} fill="#ffffff" />
        {bars.map((bar, idx) => {
          const barW = bar.width * unitPx;
          const x = currentX;
          currentX += barW;
          if (!bar.isBlack) return null;
          return (
            <rect
              key={idx}
              x={x}
              y={0}
              width={barW}
              height={height}
              fill="#0f172a"
            />
          );
        })}
      </svg>
      <span className="text-[10px] tracking-widest font-mono text-slate-600 mt-0.5">
        *{value}*
      </span>
    </div>
  );
};
