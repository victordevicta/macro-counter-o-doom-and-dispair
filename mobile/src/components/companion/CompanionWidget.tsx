import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CompanionWidgetProps {
  caloriesConsumed: number;
  caloriesGoal: number;
  proteinConsumed: number;
  proteinGoal: number;
  hasEntries: boolean;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const CompanionWidget: React.FC<CompanionWidgetProps> = ({
  caloriesConsumed,
  caloriesGoal,
  proteinConsumed,
  proteinGoal,
  hasEntries,
}) => {
  const theme = useTheme();
  const { companion, messages, colors } = theme;

  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    setMessage(getContextualMessage());
  }, [caloriesConsumed, proteinConsumed, hasEntries, theme.id]);

  const getContextualMessage = (): string => {
    const hour = new Date().getHours();
    const caloriePct = caloriesGoal > 0 ? caloriesConsumed / caloriesGoal : 0;
    const proteinPct = proteinGoal > 0 ? proteinConsumed / proteinGoal : 0;

    if (!hasEntries) return pickRandom(messages.noDataYet);
    if (proteinPct >= 1) return pickRandom(messages.proteinGoalReached);
    if (caloriePct >= 1.1) return pickRandom(messages.calorieSurplus);
    if (caloriePct >= 0.95 && caloriePct <= 1.05) return pickRandom(messages.calorieGoalReached);
    if (hour < 10) return pickRandom(messages.goodMorning);
    if (hour < 14) return pickRandom(messages.goodAfternoon);
    if (hour < 20) return pickRandom(messages.goodEvening);
    return pickRandom(messages.goodNight);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: floatAnim }] }]}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => setIsExpanded((v) => !v)}
        activeOpacity={0.85}
      >
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: companion.accentColor + '22', borderColor: companion.accentColor + '55' }]}>
          <Text style={styles.avatarEmoji}>{companion.avatarEmoji}</Text>
        </View>

        {/* Info + Message */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: companion.accentColor }]}>{companion.name}</Text>
            <Text style={[styles.title, { color: colors.text.muted }]}>{companion.title}</Text>
          </View>
          {isExpanded && (
            <View style={[styles.bubble, { backgroundColor: companion.bubbleColor, borderColor: companion.accentColor + '44' }]}>
              <Text style={[styles.bubbleText, { color: companion.textColor }]}>{message}</Text>
            </View>
          )}
        </View>

        <Text style={[styles.chevron, { color: colors.text.muted }]}>{isExpanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 26,
  },
  info: {
    flex: 1,
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 10,
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  bubble: {
    borderRadius: 12,
    borderTopLeftRadius: 4,
    padding: 10,
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  chevron: {
    fontSize: 10,
    marginTop: 4,
  },
});
