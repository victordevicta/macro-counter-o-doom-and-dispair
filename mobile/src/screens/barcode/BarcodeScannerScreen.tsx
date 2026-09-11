import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { foodsApi } from '../../api/foods.api';
import { useThemeColors } from '../../hooks/useTheme';
import { ThemeColors } from '../../themes/types';
import { FontSize } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Food } from '../../types/food.types';

interface BarcodeScannerScreenProps {
  onFoodFound: (food: Food) => void;
  onBack: () => void;
}

export const BarcodeScannerScreen: React.FC<BarcodeScannerScreenProps> = ({
  onFoodFound,
  onBack,
}) => {
  const { t } = useTranslation('barcode');
  const colors = useThemeColors();
  const styles = makeStyles(colors);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    if (scanned || isLoading) return;

    setScanned(true);
    setIsLoading(true);

    try {
      const food = await foodsApi.getByBarcode(data);
      onFoodFound(food);
    } catch (error: any) {
      const message = error?.response?.data?.message || t('alerts.fallbackMessage');
      Alert.alert(t('alerts.title'), message, [
        { text: t('alerts.scanAgain'), onPress: () => setScanned(false) },
        { text: t('alerts.goBack'), onPress: onBack },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <Text style={styles.permissionEmoji}>📷</Text>
        <Text style={styles.permissionTitle}>{t('permission.title')}</Text>
        <Text style={styles.permissionText}>{t('permission.message')}</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>{t('permission.grantButton')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack} style={styles.backLink}>
          <Text style={styles.backLinkText}>{t('permission.backLink')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
        }}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanWindow}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.primaryLight} />
                <Text style={styles.loadingText}>{t('loadingText')}</Text>
              </View>
            )}
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onBack}>
          <Ionicons name="close" size={28} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('title')}</Text>
        <TouchableOpacity
          style={styles.flashBtn}
          onPress={() => setFlashOn(!flashOn)}
        >
          <Ionicons
            name={flashOn ? 'flash' : 'flash-off'}
            size={24}
            color={flashOn ? colors.secondary : colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          {scanned && !isLoading ? t('instructions.retry') : t('instructions.align')}
        </Text>
        {scanned && !isLoading && (
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.retryText}>{t('instructions.retryButton')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    permissionContainer: {
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.xl,
      gap: 16,
    },
    permissionEmoji: { fontSize: 64 },
    permissionTitle: {
      fontSize: FontSize.xl,
      fontWeight: '800',
      color: colors.text.primary,
      textAlign: 'center',
    },
    permissionText: {
      fontSize: FontSize.sm,
      color: colors.text.muted,
      textAlign: 'center',
    },
    permissionButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 14,
      borderRadius: BorderRadius.lg,
    },
    permissionButtonText: {
      color: colors.text.onPrimary,
      fontWeight: '800',
      letterSpacing: 2,
    },
    backLink: { marginTop: 8 },
    backLinkText: { color: colors.text.muted },
    overlay: { ...StyleSheet.absoluteFillObject },
    topOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
    middleRow: { flexDirection: 'row', height: 240 },
    sideOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
    scanWindow: {
      width: 280,
      height: 240,
      borderRadius: 8,
      overflow: 'hidden',
    },
    bottomOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
    corner: {
      position: 'absolute',
      width: CORNER_SIZE,
      height: CORNER_SIZE,
      borderColor: colors.primaryLight,
    },
    cornerTL: {
      top: 0, left: 0,
      borderTopWidth: CORNER_THICKNESS,
      borderLeftWidth: CORNER_THICKNESS,
      borderTopLeftRadius: 4,
    },
    cornerTR: {
      top: 0, right: 0,
      borderTopWidth: CORNER_THICKNESS,
      borderRightWidth: CORNER_THICKNESS,
      borderTopRightRadius: 4,
    },
    cornerBL: {
      bottom: 0, left: 0,
      borderBottomWidth: CORNER_THICKNESS,
      borderLeftWidth: CORNER_THICKNESS,
      borderBottomLeftRadius: 4,
    },
    cornerBR: {
      bottom: 0, right: 0,
      borderBottomWidth: CORNER_THICKNESS,
      borderRightWidth: CORNER_THICKNESS,
      borderBottomRightRadius: 4,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.7)',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    loadingText: { color: colors.text.secondary, fontSize: FontSize.sm },
    header: {
      position: 'absolute',
      top: 52,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.base,
    },
    closeBtn: {
      width: 44,
      height: 44,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: FontSize.base,
      fontWeight: '800',
      color: colors.text.primary,
    },
    flashBtn: {
      width: 44,
      height: 44,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    instructions: {
      position: 'absolute',
      bottom: 60,
      left: 0,
      right: 0,
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: Spacing.xl,
    },
    instructionText: {
      fontSize: FontSize.base,
      fontWeight: '700',
      color: colors.text.primary,
      textAlign: 'center',
    },
    retryBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 10,
      borderRadius: BorderRadius.md,
    },
    retryText: { color: colors.text.onPrimary, fontWeight: '800', letterSpacing: 2 },
  });
}
