import React, { useState, useEffect } from 'react';
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
import { foodsApi } from '../../api/foods.api';
import { Colors } from '../../theme/colors';
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
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || isLoading) return;

    setScanned(true);
    setIsLoading(true);

    try {
      const food = await foodsApi.getByBarcode(data);
      onFoodFound(food);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'The barcode leads to the void.';
      Alert.alert('Barcode Cursed', message, [
        { text: 'Scan Again', onPress: () => setScanned(false) },
        { text: 'Go Back', onPress: onBack },
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
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          "The scanner requires your vision to decipher the cursed barcodes."
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>GRANT ACCESS</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Return to the darkness</Text>
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
                <ActivityIndicator size="large" color={Colors.primaryLight} />
                <Text style={styles.loadingText}>Consulting the dark oracle...</Text>
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
          <Ionicons name="close" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🔮 Barcode Scanner</Text>
        <TouchableOpacity
          style={styles.flashBtn}
          onPress={() => setFlashOn(!flashOn)}
        >
          <Ionicons
            name={flashOn ? 'flash' : 'flash-off'}
            size={24}
            color={flashOn ? Colors.gold : Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          {scanned && !isLoading
            ? '⚠️ Scan failed. Retry?'
            : '🩸 Align barcode within the frame'}
        </Text>
        {scanned && !isLoading && (
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.retryText}>SCAN AGAIN</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.subInstruction}>
          "The cursed mark shall reveal its nutritional secrets."
        </Text>
      </View>
    </View>
  );
};

const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permissionContainer: {
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: 16,
  },
  permissionEmoji: { fontSize: 64 },
  permissionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
  },
  permissionButtonText: {
    color: Colors.textPrimary,
    fontWeight: '800',
    letterSpacing: 2,
  },
  backLink: { marginTop: 8 },
  backLinkText: { color: Colors.textMuted, fontStyle: 'italic' },
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
    borderColor: Colors.primaryLight,
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
  loadingText: { color: Colors.textSecondary, fontSize: FontSize.sm, fontStyle: 'italic' },
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
    color: Colors.textPrimary,
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
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  retryText: { color: Colors.textPrimary, fontWeight: '800', letterSpacing: 2 },
  subInstruction: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
