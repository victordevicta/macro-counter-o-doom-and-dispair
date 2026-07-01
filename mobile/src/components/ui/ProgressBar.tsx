import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';
import { FontSize } from '../../theme/typography';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  trackColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  showValue?: boolean;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  color = Colors.primaryLight,
  trackColor = Colors.surfaceElevated,
  height = 8,
  showLabel,
  label,
  showValue,
  animated = true,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const percentage = Math.min((value / max) * 100, 100);
  const isOver = value > max;

  useEffect(() => {
    if (animated) {
      Animated.spring(animatedWidth, {
        toValue: percentage,
        tension: 40,
        friction: 8,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(percentage);
    }
  }, [percentage]);

  const barColor = isOver ? Colors.errorLight : color;

  return (
    <View style={styles.container}>
      {(showLabel || label) && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {showValue && (
            <Text style={[styles.value, isOver && styles.overValue]}>
              {Math.round(value)}/{Math.round(max)}
            </Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height, backgroundColor: trackColor }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              height,
              backgroundColor: barColor,
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  track: { borderRadius: BorderRadius.full, overflow: 'hidden' },
  fill: { borderRadius: BorderRadius.full },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  overValue: { color: Colors.errorLight },
});
