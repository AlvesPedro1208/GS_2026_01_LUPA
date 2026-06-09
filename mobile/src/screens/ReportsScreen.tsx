import React, { useState, useEffect } from 'react';
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
import { reportService } from '../services/reportService';
import { ReportMetric, HistoryRow, ReportPeriod } from '../types/Report';

const ReportsScreen: React.FC = () => {
  const [period, setPeriod] = useState<ReportPeriod>('Relatório Mensal');
  const [periods, setPeriods] = useState<ReportPeriod[]>([]);
  const [metrics, setMetrics] = useState<ReportMetric[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setPeriods(reportService.getPeriods());
    reportService.getHistory().then(setHistory);
  }, []);

  useEffect(() => {
    reportService.getMetrics(period).then(setMetrics);
  }, [period]);

  const handleExportPDF = async () => {
    setExporting(true);
    const path = await reportService.exportPDF(period);
    setExporting(false);
    Alert.alert('Exportar PDF', `Relatório salvo em:\n${path}`);
  };

  const handleShare = async () => {
    const url = await reportService.share(period);
    Alert.alert('Compartilhar', `Link gerado:\n${url}`);
  };

  return (
    <View style={styles.screen}>
      <Header title="Relatórios" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Satellite data source note */}
        <View style={styles.satNote}>
          <Ionicons name="planet-outline" size={14} color={Colors.primaryDark} />
          <Text style={styles.satNoteText}>
            Dados processados via CBERS-6 (INPE) e Sentinel-2 (ESA)
          </Text>
        </View>

        {/* Period selector */}
        <View style={styles.periodRow}>
          <TouchableOpacity style={styles.periodSelector} onPress={() => setShowPicker(!showPicker)}>
            <Text style={styles.periodText}>{period}</Text>
            <Ionicons name={showPicker ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.calendarBtn}>
            <Ionicons name="calendar-outline" size={22} color={Colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {showPicker && (
          <View style={styles.dropdown}>
            {periods.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.dropdownItem, period === p && styles.dropdownItemSelected]}
                onPress={() => { setPeriod(p); setShowPicker(false); }}
              >
                <Text style={[styles.dropdownText, period === p && styles.dropdownTextSelected]}>{p}</Text>
                {period === p && <Ionicons name="checkmark" size={16} color={Colors.primaryDark} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Metrics */}
        <View style={styles.metricsContainer}>
          {metrics.map((item) => (
            <View key={item.id} style={styles.metricRow}>
              <View style={[styles.metricIconCircle, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={styles.metricLabel}>{item.label}</Text>
              <Text style={[styles.metricValue, { color: item.color }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleExportPDF} disabled={exporting}>
            <Ionicons name="document-text-outline" size={18} color={Colors.white} />
            <Text style={styles.actionBtnText}>{exporting ? 'Exportando...' : 'Exportar PDF'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnShare]} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={18} color={Colors.primaryDark} />
            <Text style={[styles.actionBtnText, { color: Colors.primaryDark }]}>Compartilhar</Text>
          </TouchableOpacity>
        </View>

        {/* History */}
        <TouchableOpacity style={styles.historyHeader}>
          <Ionicons name="time-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.historyTitle}>Histórico</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.historyTable}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 2 }]}>Período</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Com.</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Ocorr.</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>Críticas</Text>
          </View>
          {history.map((row, idx) => (
            <View key={row.month} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowEven]}>
              <Text style={[styles.tableCell, { flex: 2, fontWeight: '500' }]}>{row.month}</Text>
              <Text style={styles.tableCell}>{row.communities}</Text>
              <Text style={styles.tableCell}>{row.occurrences}</Text>
              <Text style={[styles.tableCell, { color: Colors.riskHigh, fontWeight: '600' }]}>{row.critical}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  satNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#c8e6c9',
  },
  satNoteText: {
    fontSize: 11,
    color: Colors.primaryDark,
    fontWeight: '600',
    flex: 1,
  },
  periodRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  periodSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  periodText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  calendarBtn: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  dropdown: {
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemSelected: { backgroundColor: Colors.primary + '22' },
  dropdownText: { fontSize: 14, color: Colors.textPrimary },
  dropdownTextSelected: { fontWeight: '700', color: Colors.primaryDark },
  metricsContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    elevation: 3,
    overflow: 'hidden',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  metricIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  metricLabel: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  metricValue: { fontSize: 22, fontWeight: '800' },
  actionsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 16, gap: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
    elevation: 3,
  },
  actionBtnShare: { backgroundColor: Colors.primary },
  actionBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    elevation: 2,
    gap: 8,
  },
  historyTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  historyTable: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableRowEven: { backgroundColor: '#fafafa' },
  tableHeader: { backgroundColor: Colors.primaryDark },
  tableCell: { flex: 1, fontSize: 12, color: Colors.textPrimary, textAlign: 'center' },
  tableCellHeader: { color: Colors.white, fontWeight: '700' },
});

export default ReportsScreen;
