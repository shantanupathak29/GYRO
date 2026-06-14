import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AlertScreen from '../screens/AlertScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors, Radius, Shadow } from '../utils/theme';
import { useFall } from '../context/FallContext';

const Tab = createBottomTabNavigator();

const icons = {
  Alert: { active: 'bell', inactive: 'bell-outline' },
  History: { active: 'calendar-clock', inactive: 'calendar-clock-outline' },
  Profile: { active: 'account', inactive: 'account-outline' },
};

function TopAppBar() {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwIWSC6Al3ktrP62pRevZu7-t7-6ezRG-1tA6oAtu7qSKaxC2Clez1M_kWZNaUBB3_Ln4XOvM88DdoNXgyHDlxF7KM3ewW0akq7X1Q_SMoa6hBBwgXAFX5CaVD_VzD_vWaoYuuaPjxqO59KvY149lFciGVZWxwyKylLz6Cc831SiVLFL-o6y_1yCPen5JuvCgdwet5mjGCG5gtNdOylmORfLUEzcTUCFFSLkcwEL2bWSe7Lf1hmPGZJ9vQSseD1C-YWjYxLyJigXI' }}
            style={styles.profilePic}
          />
        </View>
        <Text style={styles.logo}>GYRO</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <MaterialCommunityIcons name="cog" size={24} color={Colors.outline} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TabBar({ state, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconConfig = icons[route.name];
          const color = isFocused ? Colors.primary : Colors.outline;
          const iconName = isFocused ? iconConfig.active : iconConfig.inactive;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tab, isFocused && styles.tabActive]}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name={iconName} size={24} color={color} />
              <Text style={[styles.tabLabel, { color, fontWeight: isFocused ? '700' : '500' }]}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <TopAppBar />
      <Tab.Navigator tabBar={props => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Alert" component={AlertScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 44, // For iOS notch, roughly
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(69, 170, 242, 0.12)',
    zIndex: 100,
  },
  headerContent: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primaryContainer,
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0284c7', // Sky-600
    letterSpacing: 2,
  },
  settingsBtn: {
    padding: 8,
    borderRadius: 20,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(69, 170, 242, 0.1)',
    ...Shadow.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 16,
  },
  tabActive: {
    backgroundColor: 'rgba(69, 170, 242, 0.08)',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

