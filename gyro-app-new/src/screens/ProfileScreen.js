import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  StatusBar, Image, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFall } from '../context/FallContext';
import { Colors, Radius, Shadow } from '../utils/theme';
import BackgroundWrapper from '../components/BackgroundWrapper';

function CardHeader({ icon, title }) {
  return (
    <View style={styles.cardHeader}>
      <MaterialCommunityIcons name={icon} size={20} color={Colors.primary} />
      <Text style={styles.cardHeaderText}>{title}</Text>
    </View>
  );
}

function InfoItem({ label, value, icon, last }) {
  return (
    <View style={[styles.infoItem, last && { borderBottomWidth: 0 }]}>
      <View style={styles.infoIconContainer}>
        <MaterialCommunityIcons name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.outlineVariant} />
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <BackgroundWrapper>
      <ScrollView style={styles.root} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.screenTitle}>About</Text>
          <Text style={styles.screenSubtitle}>Primary contact and profile information.</Text>
        </View>

        {/* Patient Profile Card */}
        <View style={styles.card}>
          <CardHeader icon="account" title="Patient Details" />
          <View style={styles.cardBody}>
            <View style={styles.patientGrid}>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>FULL NAME</Text>
                <Text style={styles.gridValue}>Eleanor Vance</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>AGE</Text>
                <Text style={styles.gridValue}>82 Years</Text>
              </View>
            </View>

            <View style={styles.emergencyContactBox}>
              <Text style={styles.emergencyLabel}>EMERGENCY CONTACT</Text>
              <View style={styles.emergencyInfo}>
                <View style={styles.emergencyIcon}>
                  <MaterialCommunityIcons name="alert-circle" size={24} color={Colors.secondary} />
                </View>
                <View>
                  <Text style={styles.emergencyName}>Medical Response Team</Text>
                  <Text style={styles.emergencyPhone}>911 / Local EMS</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Primary Caregiver Card */}
        <View style={styles.card}>
          <CardHeader icon="heart-outline" title="Primary Caregiver" />
          <View style={styles.cardBody}>
            <View style={styles.caregiverHeader}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHMNFJOQVmWaHZV7eJ0Ks-FSYXNPW8pKmVZ0q9HVhiSLPV1ui7V4xW1C5seCwRFGgLTUFb11x4EFgjqV7etPNdyzpTnDh86gY86E7TgZ0EJTsugJ8VFNmHx6GaRiAxQ4q3hVSWu2sHousPsolbfZtp8Wpb2gWDzWTqrHCz7P9F4OB0vcGTYN2J5TXhrfiesfAIQvNfqoWss1UrXJpcX2ZqVr0oF6lpJ0zvhqZduGWVs42YupKTKCFJz4_5lY-n_SMTb4EW4Ber5ek' }}
                style={styles.caregiverImg}
              />
              <View>
                <Text style={styles.gridLabel}>NAME</Text>
                <Text style={styles.caregiverName}>Sarah Mitchell</Text>
                <Text style={styles.caregiverRelation}>Daughter</Text>
              </View>
            </View>

            <View style={styles.caregiverActions}>
              <InfoItem label="Phone Number" value="+1 (555) 234-8890" icon="phone" />
              <InfoItem label="Email Address" value="s.mitchell@carelink.com" icon="email" last />
            </View>
          </View>
        </View>

        {/* Info/Help Banner */}
        <View style={styles.helpBanner}>
          <MaterialCommunityIcons name="information-outline" size={24} color={Colors.tertiary} />
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Need Support?</Text>
            <Text style={styles.helpDesc}>
              For technical issues with the GYRO system, please reach out to our 24/7 support line listed in the Help Center.
            </Text>
            <TouchableOpacity style={styles.helpBtn}>
              <Text style={styles.helpBtnText}>Help Center</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  titleSection: { marginBottom: 32 },
  screenTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  screenSubtitle: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(69, 170, 242, 0.1)',
    ...Shadow.sm,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(254, 249, 195, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(69, 170, 242, 0.05)',
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  cardBody: { padding: 20 },
  patientGrid: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
  },
  gridItem: { flex: 1 },
  gridLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.outline,
    letterSpacing: 1.5,
  },
  gridValue: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.onSurface,
    marginTop: 4,
  },
  emergencyContactBox: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceVariant,
  },
  emergencyLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.secondary,
    letterSpacing: 1.5,
  },
  emergencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 176, 206, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    gap: 16,
  },
  emergencyIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.secondaryContainer,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  emergencyPhone: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  caregiverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  caregiverImg: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  caregiverName: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.onSurface,
    marginTop: 4,
  },
  caregiverRelation: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  caregiverActions: {
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceVariant,
    paddingTop: 16,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(69, 170, 242, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: { flex: 1 },
  infoLabel: {
    fontSize: 10,
    color: Colors.outline,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.onSurface,
  },
  helpBanner: {
    backgroundColor: 'rgba(143, 206, 244, 0.2)',
    padding: 24,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(143, 206, 244, 0.3)',
  },
  helpContent: { flex: 1 },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onTertiaryContainer,
  },
  helpDesc: {
    fontSize: 14,
    color: Colors.onTertiaryContainer,
    opacity: 0.8,
    marginTop: 4,
  },
  helpBtn: {
    backgroundColor: Colors.tertiaryContainer,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginTop: 16,
    ...Shadow.sm,
  },
  helpBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onTertiaryContainer,
  },
});

