import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline, Line } from 'react-native-svg';
import { Colors } from '../utils/theme';

export default function MiniChart({ data = [], width = 280, height = 80, isFallen = false }) {
  const strokeColor = isFallen ? Colors.danger : Colors.accent;

  const maxVal = 4;
  const minVal = 0;
  const pts = data.slice(-40);
  const count = pts.length;

  if (count < 2) return null;

  const points = pts.map((v, i) => {
    const x = (i / (count - 1)) * width;
    const y = height - ((v - minVal) / (maxVal - minVal)) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const gridLines = [1, 2, 3].map(v => ({
    y: height - ((v - minVal) / (maxVal - minVal)) * (height - 4) - 2,
  }));

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        {gridLines.map((g, i) => (
          <Line
            key={i}
            x1="0" y1={g.y}
            x2={width} y2={g.y}
            stroke={Colors.border}
            strokeWidth="1"
          />
        ))}
        <Polyline
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.9"
        />
      </Svg>
    </View>
  );
}
