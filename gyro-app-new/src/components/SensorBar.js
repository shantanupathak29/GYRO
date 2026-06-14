import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Fonts } from '../utils/theme';

export default function SensorBar({ label, value, unit = 'g', min = -2, max = 4, color = Colors.accent }) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const animWidth = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: pct,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const displayVal = value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: animWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={[styles.val, { color }]}>{displayVal} {unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  label: {
    
    fontSize: 11,
    color: Colors.muted,
    width: 28,
  },
  track: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.surface2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  val: {
    
    fontSize: 11,
    width: 72,
    textAlign: 'right',
  },
});
