import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  StatusBar, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFall } from '../context/FallContext';
import { Colors, Radius, Shadow } from '../utils/theme';
import BackgroundWrapper from '../components/BackgroundWrapper';

function HistoryItem({ item }) {
  const isFall = item.type === 'fall';
  const iconName = isFall ? 'alert-octagon' : 'check-circle';
  const iconColor = isFall ? Colors.secondary : Colors.primary;
  const iconBg = isFall ? 'rgba(147, 68, 103, 0.1)' : 'rgba(0, 99, 152, 0.1)';

  const timeStr = item.time instanceof Date
    ? item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : item.time;

  const dateStr = item.time instanceof Date
    ? item.time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <View style={styles.historyItem}>
      <View style={[styles.itemIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemRelativeTime}>Today</Text>
        </View>
        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.detailText}>{dateStr}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.detailText}>{timeStr}</Text>
          </View>
          <View style={[styles.detailRow, { marginTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(69, 170, 242, 0.1)', paddingTop: 8 }]}>
            <MaterialCommunityIcons name="map-marker" size={14} color={Colors.primary} />
            <Text style={[styles.detailText, { color: Colors.primary }]}>{item.badge || 'Living Room'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { alertHistory } = useFall();
  const fallEvents = alertHistory.filter(e => e.type === 'fall').length;

  return (
    <BackgroundWrapper>
      <View style={styles.root}>
        {/* Counter Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>OCTOBER STATUS</Text>
            <Text style={styles.heroTitle}>
              Total Falls This Month: <Text style={styles.heroHighlight}>{fallEvents}</Text>
            </Text>
            <Text style={styles.heroDesc}>Maintaining precision and care.</Text>
          </View>
          <View style={styles.heroDecor} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activity History</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Recent logs</Text>
          </View>
        </View>

        <FlatList
          data={alertHistory}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <HistoryItem item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            alertHistory.length > 0 ? (
              <View style={styles.footer}>
                <View style={styles.footerIcon}>
                  <MaterialCommunityIcons name="check-circle" size={24} color={Colors.primary} />
                </View>
                <Text style={styles.footerText}>End of historical log</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={64} color={Colors.outlineVariant} />
              <Text style={styles.emptyText}>No events recorded yet</Text>
            </View>
          }
        />
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  heroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 32,
    padding: 32,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(69, 170, 242, 0.1)',
    ...Shadow.md,
  },
  heroContent: { zIndex: 1 },
  heroLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  heroHighlight: {
    color: Colors.primary,
    fontWeight: '900',
  },
  heroDesc: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  heroDecor: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 120,
    height: 120,
    backgroundColor: 'rgba(69, 170, 242, 0.05)',
    borderRadius: 60,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  badge: {
    backgroundColor: 'rgba(0, 99, 152, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  list: { paddingBottom: 100 },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(69, 170, 242, 0.1)',
    ...Shadow.sm,
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: { flex: 1 },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  itemRelativeTime: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  itemDetails: { gap: 4 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(69, 170, 242, 0.08)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
});

