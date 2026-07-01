import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { FoodEntry } from '../../types/diary.types';

interface FoodEntryItemProps {
  entry: FoodEntry;
  onDelete: () => void;
  onEdit: () => void;
}

export const FoodEntryItem: React.FC<FoodEntryItemProps> = ({
  entry,
  onDelete,
  onEdit,
}) => {
  const handleDelete = () => {
    Alert.alert(
      'Purge from Record',
      `Remove "${entry.food.name}" from the dark tome?`,
      [
        { text: 'Spare It', style: 'cancel' },
        {
          text: 'Purge',
          style: 'destructive',
          onPress: onDelete,
        },
      ],
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onEdit} activeOpacity={0.7}>
      <View style={styles.left}>
        <Text style={styles.name} numberOfLines={1}>
          {entry.food.name}
        </Text>
        <Text style={styles.serving}>
          {entry.servings > 1
            ? `${entry.servings}x `
            : ''}{entry.servingSize}{entry.servingUnit}
          {entry.food.brand ? ` • ${entry.food.brand}` : ''}
        </Text>
      </View>
      <View style={styles.right}>
        <View style={styles.macros}>
          <Text style={[styles.macroChip, { color: Colors.protein }]}>
            {Math.round(entry.proteinG)}P
          </Text>
          <Text style={[styles.macroChip, { color: Colors.carbs }]}>
            {Math.round(entry.carbsG)}C
          </Text>
          <Text style={[styles.macroChip, { color: Colors.fat }]}>
            {Math.round(entry.fatG)}F
          </Text>
        </View>
        <Text style={styles.calories}>{Math.round(entry.calories)}</Text>
        <Text style={styles.kcal}>kcal</Text>
        <TouchableOpacity
          onPress={handleDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  left: { flex: 1, marginRight: 8 },
  name: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  serving: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  macros: { flexDirection: 'row', gap: 6 },
  macroChip: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  calories: {
    fontSize: FontSize.base,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  kcal: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  deleteBtn: { marginTop: 2 },
});
