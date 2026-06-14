import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar, Easing, Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFall } from '../context/FallContext';
import { Colors, Radius, Shadow } from '../utils/theme';
import BackgroundWrapper from '../components/BackgroundWrapper';

const PulsingIndicator = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={styles.statusContainer}>
      <View style={styles.statusBadge}>
        <View style={styles.pulseContainer}>
          <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
          <View style={styles.solidCircle} />
        </View>
        <Text style={styles.statusText}>STATUS: ACTION REQUIRED</Text>
      </View>
      <Text style={styles.statusDesc}>Sensors have detected unusual activity at the monitored residence.</Text>
    </View>
  );
};

const StagePill = ({ label, active, completed }) => (
  <View style={[
    styles.stagePill,
    active && styles.stagePillActive,
    completed && styles.stagePillCompleted
  ]}>
    <Text style={[
      styles.stagePillText,
      (active || completed) && styles.stagePillTextActive
    ]}>{label}</Text>
  </View>
);

export default function AlertScreen() {
  const { fallState, markSafe, simulateFall, isSimulating, stageActive } = useFall();
  const isFallen = fallState === 'fallen';

  return (
    <BackgroundWrapper isAlert={isFallen || isSimulating}>
      <View style={styles.root}>
        <PulsingIndicator />

        {/* Fall Alert Card */}
        <View style={styles.alertCard}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleRow}>
              <MaterialCommunityIcons name="alert-decagram" size={24} color={Colors.secondary} />
              <Text style={styles.cardTitle}>Fall Detected</Text>
            </View>
            <Text style={styles.timeLabel}>Just now</Text>
          </View>

          {/* Simulation Stages */}
          <View style={styles.stagesRow}>
            <StagePill label="Impact" active={stageActive === 1} completed={stageActive > 1} />
            <StagePill label="Tilt" active={stageActive === 2} completed={stageActive > 2} />
            <StagePill label="Stillness" active={stageActive === 3} completed={isFallen} />
          </View>

          <View style={styles.cardBody}>
            <View style={styles.locationRow}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9IFlEa8XXA4X1vaEDP3947eG1A-KkqiOMD3IVtag0nAz4CPsAIpfmXgCyu8NMGn8K_8Q6dpmO-7EBYAh1XaI48pXLZwLItZI7ebZuk2lnWwQTkLefnh8X7FIjj5rZObVcnKhc5PE4yWiZ4xXk3_vjWfEffIbVmQwddqb3RQGb7Gb3HahbX-Rr1HP4gtmHEzo3l7LosehMQjYXL7izGollSoCckoW4XXHKu500fCh_q7qhoabhcUQCRB7ojJFVJ74DvIv6lS4IpRE' }}
                style={styles.roomImg}
              />
              <View style={styles.locationInfo}>
                <Text style={styles.roomName}>Living Room</Text>
                <Text style={styles.residenceName}>South Wing Residence</Text>
                <View style={styles.verificationRow}>
                  <MaterialCommunityIcons name="map-marker" size={14} color={Colors.primary} />
                  <Text style={styles.verificationText}>
                    {isFallen ? 'Verified via Motion Sensor 4' : isSimulating ? 'Analyzing movement...' : 'Monitoring...'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.btnEmergency, (isSimulating && !isFallen) && { opacity: 0.7 }]}
                onPress={() => alert('Emergency Call Initiated')}
              >
                <MaterialCommunityIcons name="phone-alert" size={28} color="#fff" />
                <Text style={styles.btnEmergencyText}>Emergency Call</Text>
              </TouchableOpacity>

              {isFallen ? (
                <TouchableOpacity style={styles.btnSafe} onPress={markSafe}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={Colors.primary} />
                  <Text style={styles.btnSafeText}>Mark as Safe</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.btnSafe, isSimulating && { opacity: 0.7 }]}
                  onPress={simulateFall}
                  disabled={isSimulating}
                >
                  <MaterialCommunityIcons name={isSimulating ? "timer-sand" : "play-circle"} size={20} color={Colors.primary} />
                  <Text style={styles.btnSafeText}>{isSimulating ? 'Simulating...' : 'Simulate Fall'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Map Ambient Layer */}
        <View style={styles.mapContainer}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFn2TCeXtv1By7LPVyoBFvPpnJHCDMNezQv5OdH3Sh6MgMX1cyLw3tLaujmeSHMZ1-t0oEziy1cG--sjHK-b68hRIffkgconISvCu81hin4aBKjo8qFYybaDKjrJUbULMeSyFwVJ4vjnFwSxpZGRGNOfE02sulMjGX4AL2H8AC6D-XDKdKTv9Bh7LUFcUdQy_UgyotsSg-Wjb8-jjZINuoTXxcgN1M2kp4XYnq_T7U2P08hXVPasbJ42qFwtCyE5PoQBe6PpHpQjQ' }}
            style={styles.mapImg}
            resizeMode="cover"
          />
          <View style={styles.mapPin}>
            <View style={styles.pinInner}>
              <MaterialCommunityIcons name="account-circle" size={24} color={isFallen ? Colors.error : Colors.primary} />
            </View>
          </View>
          <View style={styles.mapOverlay}>
            <Text style={styles.mapLabel}>CURRENT LOCATION</Text>
          </View>
        </View>
      </View>
    </BackgroundWrapper>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 218, 214, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.2)',
  },
  pulseContainer: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  pulseCircle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.error,
    opacity: 0.4,
  },
  solidCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.onErrorContainer,
    letterSpacing: 1.5,
  },
  statusDesc: {
    marginTop: 12,
    textAlign: 'center',
    color: Colors.onSurfaceVariant,
    fontSize: 14,
    paddingHorizontal: 20,
  },
  alertCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(69, 170, 242, 0.1)',
    ...Shadow.lg,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(254, 249, 195, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  timeLabel: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  stagesRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(240, 244, 248, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(69, 170, 242, 0.05)',
  },
  stagePill: {
    flex: 1,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(229, 232, 238, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stagePillActive: {
    backgroundColor: Colors.primary,
    ...Shadow.sm,
  },
  stagePillCompleted: {
    backgroundColor: 'rgba(0, 99, 152, 0.15)',
  },
  stagePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.outline,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  stagePillTextActive: {
    color: '#fff',
  },
  cardBody: {

    padding: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 24,
  },
  roomImg: {
    width: 96,
    height: 96,
    borderRadius: 16,
  },
  locationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  roomName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  residenceName: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  verificationText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  actionButtons: {
    gap: 12,
  },
  btnEmergency: {
    height: 80,
    backgroundColor: Colors.error,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...Shadow.md,
  },
  btnEmergencyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  btnSafe: {
    height: 56,
    backgroundColor: 'rgba(229, 232, 238, 0.5)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(69, 170, 242, 0.1)',
    gap: 8,
  },
  btnSafeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  mapContainer: {
    height: 200,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(69, 170, 242, 0.1)',
    backgroundColor: Colors.surfaceContainerLow,
    position: 'relative',
  },
  mapImg: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  mapPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -24,
    marginLeft: -24,
  },
  pinInner: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.md,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(69, 170, 242, 0.1)',
  },
  mapLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
});

