import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/colors';
import Header from '../components/Header';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { TipoConta } from '../types/User';

const TIPO_LABEL: Record<TipoConta, string> = {
  agente: 'Agente de Campo',
  visitante: 'Visitante',
};

const TIPO_COLOR: Record<TipoConta, string> = {
  agente: Colors.primaryDark,
  visitante: Colors.riskMedium,
};

const PerfilScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSair = async () => {
    Alert.alert('Sair', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          await logout();
          // AuthContext sets user = null → AppNavigator redirects to Login
        },
      },
    ]);
  };

  const handleTrocarConta = async () => {
    setLoading(true);
    await logout();
    // Same effect as logout — navigator redirects to Login
  };

  if (!user) return null;

  const initials = user.nome
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <View style={styles.screen}>
      <Header title="Meu Perfil" />
      <ScrollView contentContainerStyle={styles.container}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user.nome}</Text>
          <View style={[styles.tipoBadge, { backgroundColor: TIPO_COLOR[user.tipoConta] + '20' }]}>
            <Text style={[styles.tipoText, { color: TIPO_COLOR[user.tipoConta] }]}>
              {TIPO_LABEL[user.tipoConta]}
            </Text>
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Informações da Conta</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="person-outline" size={18} color={Colors.primaryDark} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>{user.nome}</Text>
            </View>
          </View>

          {user.email ? (
            <View style={styles.infoRow}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="mail-outline" size={18} color={Colors.primaryDark} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primaryDark} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Tipo de conta</Text>
              <Text style={styles.infoValue}>{TIPO_LABEL[user.tipoConta]}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionRow} onPress={handleTrocarConta} disabled={loading}>
            <Ionicons name="swap-horizontal-outline" size={20} color={Colors.primaryDark} />
            <Text style={styles.actionText}>Trocar Conta</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow} onPress={handleSair} disabled={loading}>
            <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
            <Text style={[styles.actionText, { color: Colors.danger }]}>Sair</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        {user.tipoConta === 'visitante' && (
          <View style={styles.visitorBanner}>
            <Ionicons name="information-circle-outline" size={18} color={Colors.riskMedium} />
            <Text style={styles.visitorBannerText}>
              Você está em modo visitante. Crie uma conta para acessar todos os recursos.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 4,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: Colors.white },
  userName: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  tipoBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tipoText: { fontSize: 13, fontWeight: '700' },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  infoIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: { fontSize: 11, color: Colors.textSecondary, marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  actionsCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },
  visitorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.riskMedium + '18',
    borderRadius: 10,
    padding: 14,
    gap: 10,
  },
  visitorBannerText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
});

export default PerfilScreen;
