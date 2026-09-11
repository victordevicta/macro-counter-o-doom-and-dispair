import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { weightApi } from '../../api/diary.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useThemeColors } from '../../hooks/useTheme';
import { useLanguageStore } from '../../store/languageStore';
import { getDateFnsLocale } from '../../i18n/dateLocale';
import { ThemeColors } from '../../themes/types';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

export const ProgressScreen: React.FC = () => {
  const { t } = useTranslation('progress');
  const colors = useThemeColors();
  const styles = makeStyles(colors);
  const { languageId } = useLanguageStore();
  const dateLocale = getDateFnsLocale(languageId);
  const queryClient = useQueryClient();
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [notes, setNotes] = useState('');

  const { data: progress } = useQuery({
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
      Alert.alert(t('alerts.failedTitle'), error?.response?.data?.message || t('alerts.failedFallback'));
    },
  });

  const handleAddWeight = () => {
    const w = parseFloat(newWeight);
    if (!w || w < 10) {
      Alert.alert(t('alerts.invalidTitle'), t('alerts.invalidMessage'));
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

  return (
    <LinearGradient colors={colors.gradient as any} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('title')}</Text>
        <Text style={styles.subtitle}>{t('subtitle')}</Text>

        {/* Current Stats */}
        {current && (
          <Card style={styles.statsCard}>
            <Text style={styles.cardTitle}>{t('currentForm.sectionTitle')}</Text>
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
                    <Text style={styles.statLabel}>{t('currentForm.bodyFat')}</Text>
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
                    <Text style={styles.statLabel}>{t('currentForm.kgChange')}</Text>
                  </View>
                </>
              )}
            </View>
            {weightChange !== null && weightChange !== undefined && (
              <Text style={styles.trendText}>
                {weightChange < 0 ? t('trend.down') : weightChange > 0 ? t('trend.up') : t('trend.stable')}
              </Text>
            )}
          </Card>
        )}

        {/* Add Weight Button */}
        <Button
          title={t('logButton')}
          onPress={() => setShowAddWeight(!showAddWeight)}
          variant={showAddWeight ? 'outline' : 'primary'}
          fullWidth
          style={styles.addButton}
        />

        {/* Add Weight Form */}
        {showAddWeight && (
          <Card style={styles.addForm}>
            <Text style={styles.cardTitle}>{t('measureVessel.sectionTitle')}</Text>
            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>{t('measureVessel.weightLabel')}</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={newWeight}
                  onChangeText={setNewWeight}
                  keyboardType="decimal-pad"
                  placeholder="75.0"
                  placeholderTextColor={colors.text.muted}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>{t('measureVessel.bodyFatLabel')}</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={bodyFat}
                  onChangeText={setBodyFat}
                  keyboardType="decimal-pad"
                  placeholder="15.0"
                  placeholderTextColor={colors.text.muted}
                />
              </View>
            </View>
            <View style={styles.formFieldFull}>
              <Text style={styles.fieldLabel}>{t('measureVessel.notesLabel')}</Text>
              <TextInput
                style={[styles.fieldInput, styles.notesInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder={t('measureVessel.notesPlaceholder')}
                placeholderTextColor={colors.text.muted}
                multiline
              />
            </View>
            <Button
              title={addLogMutation.isPending ? t('measureVessel.recordingButton') : t('measureVessel.recordButton')}
              onPress={handleAddWeight}
              isLoading={addLogMutation.isPending}
              fullWidth
              style={styles.recordButton}
            />
          </Card>
        )}

        {/* Weight Log List */}
        <Card style={styles.logCard}>
          <Text style={styles.cardTitle}>{t('chronicle.sectionTitle')}</Text>
          {!logs || (Array.isArray(logs) && logs.length === 0) ? (
            <Text style={styles.emptyText}>{t('chronicle.empty')}</Text>
          ) : (
            (Array.isArray(logs) ? logs : []).map((log: any) => (
              <View key={log.id} style={styles.logRow}>
                <View style={styles.logLeft}>
                  <Text style={styles.logDate}>
                    {format(new Date(log.loggedAt), 'MMM d, yyyy', { locale: dateLocale })}
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

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    gradient: { flex: 1 },
    content: { padding: Spacing.base, paddingTop: 56, paddingBottom: 100 },
    title: { fontSize: FontSize['2xl'], fontWeight: '900', color: colors.text.primary },
    subtitle: { fontSize: FontSize.sm, color: colors.text.muted, marginBottom: 24 },
    statsCard: { marginBottom: Spacing.base },
    cardTitle: {
      fontSize: FontSize.xs,
      fontWeight: '800',
      color: colors.secondary,
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: Spacing.base,
    },
    statsRow: { flexDirection: 'row', alignItems: 'center' },
    statItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
    statDivider: { width: 1, height: 50, backgroundColor: colors.border },
    statValue: {
      fontSize: FontSize['2xl'],
      fontWeight: '900',
      color: colors.text.primary,
      fontVariant: ['tabular-nums'],
    },
    valueGood: { color: colors.status.successLight },
    valueBad: { color: colors.status.errorLight },
    statLabel: { fontSize: FontSize.xs, color: colors.text.muted, marginTop: 2 },
    trendText: {
      fontSize: FontSize.xs,
      color: colors.primaryLight,
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
      color: colors.text.secondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    fieldInput: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      fontSize: FontSize.base,
      color: colors.text.primary,
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
      borderBottomColor: colors.border,
    },
    logLeft: {},
    logRight: { alignItems: 'flex-end' },
    logDate: { fontSize: FontSize.sm, color: colors.text.secondary, fontWeight: '600' },
    logNotes: { fontSize: FontSize.xs, color: colors.text.muted, fontStyle: 'italic', marginTop: 2 },
    logWeight: {
      fontSize: FontSize.base,
      fontWeight: '800',
      color: colors.text.primary,
      fontVariant: ['tabular-nums'],
    },
    logBodyFat: { fontSize: FontSize.xs, color: colors.macros.fat },
    emptyText: { fontSize: FontSize.sm, color: colors.text.muted, textAlign: 'center', padding: 20 },
  });
}
