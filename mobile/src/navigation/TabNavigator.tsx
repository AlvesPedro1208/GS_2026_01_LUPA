import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import RegisterOccurrenceScreen from '../screens/RegisterOccurrenceScreen';
import ReportsScreen from '../screens/ReportsScreen';
import AlertScreen from '../screens/AlertScreen';
import PerfilScreen from '../screens/PerfilScreen';
import { Colors } from '../styles/colors';

export type TabParamList = {
  Dashboard: undefined;
  Registrar: undefined;
  Relatorios: undefined;
  Alertas: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Dashboard: ['home', 'home-outline'],
  Registrar: ['add-circle', 'add-circle-outline'],
  Relatorios: ['bar-chart', 'bar-chart-outline'],
  Alertas: ['warning', 'warning-outline'],
  Perfil: ['person-circle', 'person-circle-outline'],
};

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primaryDark,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = TAB_ICONS[route.name as keyof TabParamList];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="Registrar" component={RegisterOccurrenceScreen} options={{ tabBarLabel: 'Registrar' }} />
      <Tab.Screen name="Relatorios" component={ReportsScreen} options={{ tabBarLabel: 'Relatórios' }} />
      <Tab.Screen name="Alertas" component={AlertScreen} options={{
        tabBarLabel: 'Alertas',
        tabBarBadge: 12,
        tabBarBadgeStyle: styles.badge,
      }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 62,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  tabLabel: { fontSize: 10, fontWeight: '600' },
  badge: { backgroundColor: Colors.danger, fontSize: 10 },
});

export default TabNavigator;
