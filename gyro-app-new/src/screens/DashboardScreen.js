import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, StatusBar,
} from 'react-native';
import { useFall } from '../context/FallContext';
import SensorBar from '../components/SensorBar';
import StageIndicator from '../components/StageIndicator';
import MiniChart from '../components/MiniChart';
import { Colors, Radius, Shadow } from '../utils/theme';

function StatCard({ label, value, sub, valueColor }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: valueColor || Colors.text }]}>{value}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

function StatusBadge({ fallen }) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (fallen) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(0);
    }
  }, [fallen]);

  const color = fallen ? Colors.danger : Colors.safe;
  const bg = fallen ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)';
  const border = fallen ? 'rgba(220,38,38,0.25)' : 'rgba(22,163,74,0.25)';
  const label = fallen ? 'FALL DETECTED' : 'MONITORING';

  return (
    <Animated.View style={[
      styles.badge,
      { backgroundColor: bg, borderColor: border },
      fallen && { opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) },
    ]}>
      <View style={[styles.badgeDot, { backgroundColor: color }]} />
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </Animated.View>
  );
}

export default function DashboardScreen({ navigation }) {
  const {
    sensors, accelHistory, fallState, fallCount,
    uptime, stageActive, isSimulating,
    simulateFall, markSafe, resetAll,
  } = useFall();

  const isFallen = fallState === 'fallen';
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFallen) {
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();
    }
  }, [isFallen]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />

      <Animated.View
        pointerEvents="none"
        style={[styles.flashOverlay, { opacity: flashAnim }]}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>G</Text>
          </View>
          <View>
            <Text style={styles.brandName}>GYRO</Text>
            <Text style={styles.brandSub}>Fall Detection System</Text>
          </View>
        </View>
        <StatusBadge fallen={isFallen} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FALL ALERT BANNER */}
        {isFallen && (
          <View style={styles.alertBanner}>
            <View style={styles.alertStripe} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>⚠  Fall Detected</Text>
              <Text style={styles.alertSub}>
                All 3 stages confirmed · Alerting caregiver via WhatsApp
              </Text>
              <View style={styles.alertActions}>
                <TouchableOpacity style={styles.btnDanger} onPress={() => alert('In production: Twilio calls +91 98765 43210')}>
                  <Text style={styles.btnDangerText}>📞  Call Emergency</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSafe} onPress={markSafe}>
                  <Text style={styles.btnSafeText}>✓  Mark Safe</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnOutline} onPress={resetAll}>
                  <Text style={styles.btnOutlineText}>↺ Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* STAT CARDS */}
        <View style={styles.statsRow}>
          <StatCard
            label="FALLS TODAY"
            value={String(fallCount)}
            sub="total events"
            valueColor={fallCount > 0 ? Colors.danger : Colors.text}
          />
          <StatCard
            label="ACCEL"
            value={`${sensors.mag.toFixed(2)}g`}
            sub="magnitude"
            valueColor={sensors.mag > 2 ? Colors.danger : sensors.mag > 1.5 ? Colors.warn : Colors.safe}
          />
          <StatCard
            label="UPTIME"
            value={uptime}
            sub="device active"
          />
        </View>

        {/* SENSOR PANEL */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>MPU6050 — Live Sensor Data</Text>
            <View style={[styles.livePill, { borderColor: (isFallen ? Colors.danger : Colors.safe) + '44' }]}>
              <View style={[styles.liveDot, { backgroundColor: isFallen ? Colors.danger : Colors.safe }]} />
              <Text style={[styles.livePillText, { color: isFallen ? Colors.danger : Colors.safe }]}>LIVE</Text>
            </View>
          </View>

          <SensorBar label="AX" value={sensors.ax} min={-2} max={2} color={Colors.blue} />
          <SensorBar label="AY" value={sensors.ay} min={-2} max={2} color={Colors.purple} />
          <SensorBar label="AZ" value={sensors.az} min={0} max={2} color={Colors.safe} />
          <SensorBar label="|a|" value={sensors.mag} min={0} max={4} color={isFallen ? Colors.danger : Colors.accent} />

          <View style={styles.chartWrap}>
            <MiniChart
              data={accelHistory}
              width={styles.chartWrap.minWidth || 280}
              height={70}
              isFallen={isFallen}
            />
          </View>
        </View>

        {/* FALL DETECTION STAGES */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Fall Detection — 3-Stage Algorithm</Text>
          </View>
          <StageIndicator activeIndex={stageActive} isFallen={isFallen} />
        </View>

        {/* SIMULATE BUTTON */}
        {!isFallen && (
          <TouchableOpacity
            style={[styles.simBtn, isSimulating && styles.simBtnDisabled]}
            onPress={simulateFall}
            disabled={isSimulating}
            activeOpacity={0.8}
          >
            <Text style={styles.simBtnText}>
              {isSimulating ? '⏳  Simulating...' : '▶  Simulate Fall'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(220,38,38,0.10)',
    zIndex: 999,
    pointerEvents: 'none',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: {
    width: 36, height: 36,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  brandName: { color: Colors.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  brandSub: { color: Colors.muted, fontSize: 10, letterSpacing: 0.3, marginTop: -1 },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },

  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  alertBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(220,38,38,0.05)',
    borderWidth: 2, borderColor: Colors.border,
    borderBottomWidth: 6, borderRightWidth: 4,
    borderRadius: Radius.lg,
    marginBottom: 14,
    overflow: 'hidden',
  },
  alertStripe: { width: 4, backgroundColor: Colors.danger },
  alertContent: { flex: 1, padding: 16 },
  alertTitle: { color: Colors.danger, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  alertSub: { color: Colors.muted, fontSize: 12, marginBottom: 12 },
  alertActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  btnDanger: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.sm,
  },
  btnDangerText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  btnSafe: {
    backgroundColor: 'rgba(22,163,74,0.1)',
    borderWidth: 1, borderColor: 'rgba(22,163,74,0.3)',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.sm,
  },
  btnSafeText: { color: Colors.safe, fontSize: 12, fontWeight: '700' },
  btnOutline: {
    borderWidth: 1, borderColor: Colors.border2,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.sm,
  },
  btnOutlineText: { color: Colors.muted, fontSize: 12, fontWeight: '600' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 2, borderColor: Colors.border,
    borderBottomWidth: 6, borderRightWidth: 4,
    borderRadius: Radius.md,
    padding: 12,
  },
  statLabel: {
    fontSize: 9, fontWeight: '700', letterSpacing: 1,
    textTransform: 'uppercase', color: Colors.muted2, marginBottom: 6,
  },
  statValue: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5, marginBottom: 2 },
  statSub: { fontSize: 10, color: Colors.muted2 },

  card: {
    backgroundColor: Colors.surface,
    borderWidth: 2, borderColor: Colors.border,
    borderBottomWidth: 6, borderRightWidth: 4,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14,
  },
  cardTitle: { color: Colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  livePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20,
  },
  liveDot: { width: 5, height: 5, borderRadius: 3 },
  livePillText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },

  chartWrap: {
    marginTop: 14,
    minWidth: 280,
    height: 70,
    backgroundColor: Colors.surface2,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },

  simBtn: {
    backgroundColor: Colors.accent2,
    borderWidth: 2, borderColor: Colors.border,
    borderBottomWidth: 6, borderRightWidth: 4,
    borderRadius: Radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  simBtnDisabled: {
    backgroundColor: Colors.surface3,
    shadowOpacity: 0,
  },
  simBtnText: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 0.2 },
});
