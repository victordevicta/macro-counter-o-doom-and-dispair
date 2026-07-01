import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { weightApi } from '../../api/diary.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

export const ProgressScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [notes, setNotes] = useState('');

  const { data: progress, isLoading } = useQuery({
    queryKey: ['weight', 'progress'],
    queryFn: weightApi.getProgress,
  });

  const { data: logs } = useQuery({
    queryKey: ['weight', 'logs'],
    queryFn: () => weightApi.getLogs(30),
  });

  const addLogMutation = useMutation({
    mutationFn: weightApi.addLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight'] });
      setShowAddWeight(false);
      setNewWeight('');
      setBodyFat('');
      setNotes('');
    },
    onError: (error: any) => {
      Alert.alert('Failed', error?.response?.data?.message || 'The scales refused to cooperate.');
    },
  });

  const handleAddWeight = () => {
    const w = parseFloat(newWeight);
    if (!w || w < 10) {
      Alert.alert('Invalid', 'Enter a valid weight in kg.');
      return;
    }
    addLogMutation.mutate({
      weightKg: w,
      bodyFatPercent: bodyFat ? parseFloat(bodyFat) : undefined,
      notes: notes || undefined,
    });
  };

  const weightChange = progress?.change?.weightKg;
  const current = progress?.current;
  const starting = progress?.starting;

  return (
    <LinearGradient colors={[Colors.background, '#0A140A']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📈 Progress Chronicle</Text>
        <Text style={styles.subtitle}>"Witness your transformation through the abyss."</Text>

        {/* Current Stats */}
        {current && (
          <Card style={styles.statsCard}>
            <Text style={styles.cardTitle}>⚖️ CURRENT FORM</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{current.weightKg}</Text>
                <Text style={styles.statLabel}>kg</Text>
              </View>
              {current.bodyFatPercent && (
                <>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{current.bodyFatPercent}%</Text>
                    <Text style={styles.statLabel}>Body Fat</Text>
                  </View>
                </>
              )}
              {weightChange !== null && weightChange !== undefined && (
                <>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={[
                      styles.statValue,
                      weightChange < 0 ? styles.valueGood : styles.valueBad,
                    ]}>
                      {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
                    </Text>
                    <Text style={styles.statLabel}>kg Change</Text>
                  </View>
                </>
              )}
            </View>
            {weightChange !== null && (
              <Text style={styles.doomQuote}>
                {weightChange < 0
                  ? '"The burden lightens. The curse retreats."'
                  : weightChange > 0
                    ? '"The mass accumulates. Power grows."'
                    : '"Stasis achieved. The scales hold firm."'}
              </Text>
            )}
          </Card>
        )}

        {/* Add Weight Button */}
        <Button
          title="+ LOG TODAY'S MASS"
          onPress={() => setShowAddWeight(!showAddWeight)}
          variant={showAddWeight ? 'outline' : 'primary'}
          fullWidth
          style={styles.addButton}
        />

        {/* Add Weight Form */}
        {showAddWeight && (
          <Card style={styles.addForm}>
            <Text style={styles.cardTitle}>📏 MEASURE THE VESSEL</Text>
            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>WEIGHT (kg)</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={newWeight}
                  onChangeText={setNewWeight}
                  keyboardType="decimal-pad"
                  placeholder="75.0"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>BODY FAT %</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={bodyFat}
                  onChangeText={setBodyFat}
                  keyboardType="decimal-pad"
                  placeholder="15.0"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>
            <View style={styles.formFieldFull}>
              <Text style={styles.fieldLabel}>NOTES (optional)</Text>
              <TextInput
                style={[styles.fieldInput, styles.notesInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Morning, post-workout..."
                placeholderTextColor={Colors.textMuted}
                multiline
              />
            </View>
            <Button
              title={addLogMutation.isPending ? 'Recording...' : 'RECORD THE MASS'}
              onPress={handleAddWeight}
              isLoading={addLogMutation.isPending}
              fullWidth
              style={styles.recordButton}
            />
          </Card>
        )}

        {/* Weight Log List */}
        <Card style={styles.logCard}>
          <Text style={styles.cardTitle}>📜 THE CHRONICLE</Text>
          {!logs || (Array.isArray(logs) && logs.length === 0) ? (
            <Text style={styles.emptyText}>
              "No measurements inscribed. Begin the chronicle."
            </Text>
          ) : (
            (Array.isArray(logs) ? logs : []).map((log: any) => (
              <View key={log.id} style={styles.logRow}>
                <View style={styles.logLeft}>
                  <Text style={styles.logDate}>
                    {format(new Date(log.loggedAt), 'MMM d, yyyy')}
                  </Text>
                  {log.notes && (
                    <Text style={styles.logNotes}>{log.notes}</Text>
                  )}
                </View>
                <View style={styles.logRight}>
                  <Text style={styles.logWeight}>{log.weightKg} kg</Text>
                  {log.bodyFatPercent && (
                    <Text style={styles.logBodyFat}>{log.bodyFatPercent}% BF</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  content: { padding: Spacing.base, paddingTop: 56, paddingBottom: 100 },
  title: { fontSize: FontSize['2xl'], fontWeight: '900', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, fontStyle: 'italic', marginBottom: 24 },
  statsCard: { marginBottom: Spacing.base },
  cardTitle: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.base,
  },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  statDivider: { width: 1, height: 50, backgroundColor: Colors.border },
  statValue: {
    fontSize: FontSize['2xl'],
    fontWeight: '900',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  valueGood: { color: Colors.successLight },
  valueBad: { color: Colors.errorLight },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  doomQuote: {
    fontSize: FontSize.xs,
    color: Colors.primaryLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
  addButton: { marginBottom: Spacing.base },
  addForm: { marginBottom: Spacing.base },
  formRow: { flexDirection: 'row', gap: 12 },
  formField: { flex: 1 },
  formFieldFull: { marginTop: 8 },
  fieldLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  notesInput: { minHeight: 60 },
  recordButton: { marginTop: 16 },
  logCard: { marginBottom: Spacing.base },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logLeft: {},
  logRight: { alignItems: 'flex-end' },
  logDate: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  logNotes: { fontSize: FontSize.xs, color: Colors.textMuted, fontStyle: 'italic', marginTop: 2 },
  logWeight: {
    fontSize: FontSize.base,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  logBodyFat: { fontSize: FontSize.xs, color: Colors.fat },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, fontStyle: 'italic', textAlign: 'center', padding: 20 },
});
