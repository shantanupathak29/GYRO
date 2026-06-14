import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Radius } from '../utils/theme';

const STAGES = [
  { num: 1, label: 'Impact', desc: '|a| > 2.0g' },
  { num: 2, label: 'Tilt', desc: 'Angle > 45°' },
  { num: 3, label: 'Stillness', desc: '2s no move' },
];

function StageChip({ stage, activeIndex, isFallen }) {
  const isActive = activeIndex >= stage.num;
  const isCurrent = activeIndex === stage.num;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCurrent && !isFallen) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isCurrent, isFallen]);

  const color = isFallen ? Colors.danger : isActive ? Colors.accent : Colors.muted2;
  const bgColor = isFallen
    ? 'rgba(220,38,38,0.07)'
    : isActive
    ? 'rgba(37,99,235,0.07)'
    : Colors.surface2;

  return (
    <View style={[styles.chip, { backgroundColor: bgColor, borderColor: isActive || isFallen ? color + '40' : Colors.border }]}>
      <Animated.View
        style={[
          styles.dot,
          { backgroundColor: color, opacity: isCurrent ? pulseAnim : 1 },
        ]}
      />
      <View style={styles.chipText}>
        <Text style={[styles.chipNum, { color: Colors.muted }]}>S{stage.num}</Text>
        <Text style={[styles.chipLabel, { color }]}>{stage.label}</Text>
        <Text style={styles.chipDesc}>{stage.desc}</Text>
      </View>
    </View>
  );
}

export default function StageIndicator({ activeIndex, isFallen }) {
  return (
    <View style={styles.row}>
      {STAGES.map((s, i) => (
        <React.Fragment key={s.num}>
          <StageChip stage={s} activeIndex={activeIndex} isFallen={isFallen} />
          {i < STAGES.length - 1 && (
            <View style={[styles.connector, {
              backgroundColor: activeIndex > s.num
                ? (isFallen ? Colors.danger : Colors.accent)
                : Colors.border2,
            }]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipText: { flex: 1 },
  chipNum: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  chipDesc: {
    fontSize: 9,
    color: Colors.muted2,
    marginTop: 1,
  },
  connector: {
    width: 6,
    height: 1.5,
    borderRadius: 1,
  },
});
