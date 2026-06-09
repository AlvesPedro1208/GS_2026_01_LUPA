import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import MapaMonitoramento from '../components/MapaMonitoramento';
import { TabParamList } from '../navigation/TabNavigator';
import { Colors } from '../styles/colors';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboardService';
import { DashboardStats, RecentAlert } from '../types/Dashboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type DashboardNavProp = BottomTabNavigationProp<TabParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardNavProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([]);

  useEffect(() => {
    dashboardService.getStats().then(setStats);
    dashboardService.getRecentAlerts().then(setRecentAlerts);
  }, []);

  const isVisitor = user?.tipoConta === 'visitante';
  const greeting = isVisitor ? 'Modo Visitante' : `Olá, ${user?.nome.split(' ')[0]}!`;

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.headerSub}>🛰️ Painel Satelital de Monitoramento</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={24} color={Colors.white} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Satellite status strip */}
        <View style={styles.satStrip}>
          <View style={styles.satStripDot} />
          <Text style={styles.satStripText}>
            CBERS-6 (INPE) · Sentinel-2 (ESA) — dados atualizados
          </Text>
          <Text style={styles.satStripTime}>Agora</Text>
        </View>

        {/* Top metric cards */}
        <View style={styles.topCards}>
          <View style={styles.bigCard}>
            <Ionicons name="map-outline" size={28} color={Colors.primaryDark} />
            <Text style={styles.bigCardValue}>{stats?.areasMonitoradas ?? '—'}</Text>
            <Text style={styles.bigCardLabel}>Áreas{'\n'}Monitoradas</Text>
          </View>
          <View style={styles.bigCard}>
            <Ionicons name="warning-outline" size={28} color={Colors.danger} />
            <Text style={[styles.bigCardValue, { color: Colors.danger }]}>
              {stats?.alertasAtivos ?? '—'}
            </Text>
            <Text style={styles.bigCardLabel}>Alertas{'\n'}Ativos</Text>
          </View>
        </View>

        {/* Risk cards */}
        <View style={styles.riskRow}>
          {[
            { label: 'Alto risco', value: stats?.altoRisco, color: Colors.riskHigh },
            { label: 'Médio risco', value: stats?.medioRisco, color: Colors.riskMedium },
            { label: 'Baixo risco', value: stats?.baixoRisco, color: Colors.riskLow },
          ].map((item) => (
            <View key={item.label} style={[styles.riskCard, { borderLeftColor: item.color }]}>
              <Text style={[styles.riskValue, { color: item.color }]}>{item.value ?? '—'}</Text>
              <Text style={styles.riskLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Interactive map */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Mapa de Monitoramento</Text>
            <View style={styles.satSourceBadge}>
              <Text style={styles.satSourceText}>🛰 CBERS-6</Text>
            </View>
          </View>
          <MapaMonitoramento height={260} />
        </View>

        {/* Quick actions */}
        <View style={styles.actionsRow}>
          {[
            { label: 'Ver Mapa', icon: 'map-outline', bg: '#e8f5e9', color: Colors.primaryDark, tab: 'Dashboard' as const },
            { label: 'Relatórios', icon: 'bar-chart-outline', bg: '#e3f2fd', color: Colors.info, tab: 'Relatorios' as const },
            { label: 'Registrar\nOcorrência', icon: 'add-circle-outline', bg: '#fce4ec', color: Colors.danger, tab: 'Registrar' as const },
          ].map((action) => (
            <TouchableOpacity key={action.label} style={styles.actionBtn} onPress={() => navigation.navigate(action.tab)}>
              <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon as any} size={26} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas Recentes</Text>
          {recentAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <View style={[styles.alertDot, { backgroundColor: alert.color }]} />
              <View style={styles.alertInfo}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertSub}>{alert.community} • {alert.time}</Text>
              </View>
              <View style={[styles.riskBadge, { backgroundColor: alert.color + '22' }]}>
                <Text style={[styles.riskBadgeText, { color: alert.color }]}>{alert.risk}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  satStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#c8e6c9',
    gap: 8,
  },
  satStripDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.riskLow,
  },
  satStripText: {
    flex: 1,
    fontSize: 11,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  satStripTime: {
    fontSize: 11,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  satSourceBadge: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  satSourceText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  header: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 22, fontWeight: '700', color: Colors.white },
  headerSub: { fontSize: 12, color: Colors.primaryLight, marginTop: 2 },
  notifBtn: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.danger,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: Colors.white, fontSize: 9, fontWeight: 'bold' },
  scroll: { flex: 1 },
  topCards: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  bigCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
  },
  bigCardValue: { fontSize: 32, fontWeight: '900', color: Colors.primaryDark, marginTop: 6 },
  bigCardLabel: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center', marginTop: 4, lineHeight: 16 },
  riskRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 12, gap: 8 },
  riskCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    elevation: 2,
  },
  riskValue: { fontSize: 22, fontWeight: '800' },
  riskLabel: { fontSize: 10, color: Colors.textSecondary, marginTop: 2 },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 0 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, paddingHorizontal: 16 },
  actionBtn: { alignItems: 'center' },
  actionIcon: { width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8, elevation: 2 },
  actionLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', fontWeight: '500' },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
  },
  alertDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  alertInfo: { flex: 1 },
  alertTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  alertSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  riskBadgeText: { fontSize: 11, fontWeight: '700' },
});

export default DashboardScreen;
