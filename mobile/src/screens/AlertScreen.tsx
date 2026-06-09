import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/colors';
import Header from '../components/Header';
import { alertService } from '../services/alertService';
import { AlertItem, ExpansionAlert } from '../types/Alert';

const AlertScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [expansion, setExpansion] = useState<ExpansionAlert | null>(null);

  useEffect(() => {
    alertService.getAll().then(setAlerts);
    alertService.getExpansionDetail().then(setExpansion);
  }, []);

  const handleEnviarAnalise = async () => {
    await alertService.sendForAnalysis(1);
    Alert.alert('Enviado', 'O alerta foi encaminhado para a equipe técnica.');
  };

  return (
    <View style={styles.screen}>
      <Header title="Alertas" rightIcon="filter-outline" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Featured expansion alert */}
        {expansion && (
          <View style={styles.alertCard}>
            <View style={styles.alertCardHeader}>
              <Ionicons name="warning" size={24} color={Colors.riskHigh} />
              <Text style={styles.alertCardTitle}>Nova expansão detectada</Text>
            </View>

            <View style={styles.communityRow}>
              <Text style={styles.communityLabel}>Comunidade:</Text>
              <Text style={styles.communityName}>{expansion.community}</Text>
            </View>

            {/* Satellite source badges */}
            <View style={styles.satSourceRow}>
              <View style={styles.satBadge}>
                <Text style={styles.satBadgeText}>🛰 CBERS-6 (INPE)</Text>
              </View>
              <View style={styles.satBadge}>
                <Text style={styles.satBadgeText}>🌍 Sentinel-2 (ESA)</Text>
              </View>
            </View>

            <Text style={styles.comparisonLabel}>Comparação por imagem satelital:</Text>
            <View style={styles.imagesRow}>
              <View style={styles.imageBox}>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="planet-outline" size={28} color="#aaa" />
                  <Text style={styles.imagePlaceholderText}>30 dias atrás</Text>
                </View>
                <Text style={styles.imageCaption}>30 dias atrás</Text>
              </View>
              <View style={styles.imageBox}>
                <View style={[styles.imagePlaceholder, styles.imagePlaceholderCurrent]}>
                  <Ionicons name="planet-outline" size={28} color="#888" />
                  <Text style={styles.imagePlaceholderText}>Imagem atual</Text>
                </View>
                <Text style={styles.imageCaption}>Atual</Text>
              </View>
            </View>

            <Text style={styles.iaTitle}>🤖 IA Satelital detectou:</Text>
            <View style={styles.iaList}>
              {expansion.findings.map((f, i) => (
                <View key={i} style={styles.iaItem}>
                  <View style={styles.iaBullet} />
                  <Text style={styles.iaItemText}>{f}</Text>
                </View>
              ))}
            </View>

            <View style={styles.riskLevelRow}>
              <Text style={styles.riskLevelLabel}>Nível de risco:</Text>
              <View style={styles.riskBadgeHigh}>
                <Text style={styles.riskBadgeText}>{expansion.riskLevel}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.sendBtn} onPress={handleEnviarAnalise} activeOpacity={0.8}>
              <Text style={styles.sendBtnText}>🚀 Enviar para análise técnica</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* All alerts feed */}
        <Text style={styles.feedTitle}>Todos os Alertas</Text>
        {alerts.map((alert) => (
          <View key={alert.id} style={styles.feedItem}>
            <View style={[styles.feedSeverity, { backgroundColor: alert.color }]}>
              <Ionicons name={alert.icon as any} size={16} color={Colors.white} />
            </View>
            <View style={styles.feedInfo}>
              <Text style={styles.feedItemTitle}>{alert.title}</Text>
              <Text style={styles.feedItemSub}>{alert.community} • {alert.time}</Text>
            </View>
            <View style={[styles.feedBadge, { backgroundColor: alert.color + '22' }]}>
              <Text style={[styles.feedBadgeText, { color: alert.color }]}>{alert.risk}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  alertCard: {
    margin: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.riskHigh,
  },
  alertCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  satSourceRow: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  satBadge: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: Colors.riskLow,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  satBadgeText: { fontSize: 11, color: Colors.primaryDark, fontWeight: '600' },
  alertCardTitle: { fontSize: 17, fontWeight: '700', color: Colors.riskHigh },
  communityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 6 },
  communityLabel: { fontSize: 13, color: Colors.textSecondary },
  communityName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  comparisonLabel: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10, fontWeight: '500' },
  imagesRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  imageBox: { flex: 1, alignItems: 'center' },
  imagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderCurrent: {
    backgroundColor: '#ffcdd2',
    borderWidth: 2,
    borderColor: Colors.riskHigh,
  },
  imagePlaceholderText: { fontSize: 11, color: '#888', marginTop: 4 },
  imageCaption: { fontSize: 11, color: Colors.textSecondary, marginTop: 5, fontWeight: '500' },
  iaTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  iaList: { marginBottom: 16 },
  iaItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  iaBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.textPrimary, marginRight: 10 },
  iaItemText: { fontSize: 13, color: Colors.textPrimary },
  riskLevelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  riskLevelLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  riskBadgeHigh: { backgroundColor: Colors.riskHigh, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 8 },
  riskBadgeText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  sendBtn: { backgroundColor: Colors.riskHigh, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  sendBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  feedTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, paddingHorizontal: 16, marginBottom: 10, marginTop: 4 },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  feedSeverity: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  feedInfo: { flex: 1 },
  feedItemTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  feedItemSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  feedBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  feedBadgeText: { fontSize: 11, fontWeight: '700' },
});

export default AlertScreen;
