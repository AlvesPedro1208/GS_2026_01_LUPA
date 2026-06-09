import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../styles/colors';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { useAuth } from '../hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginNavProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, loginAsVisitor } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingVisitor, setLoadingVisitor] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha email e senha.');
      return;
    }
    setLoading(true);
    try {
      await login({ email: email.trim(), senha });
      // AuthContext updates user → AppNavigator switches to MainTabs
    } catch (err: any) {
      Alert.alert('Erro', err.message ?? 'Não foi possível fazer login.');
    } finally {
      setLoading(false);
    }
  };

  const handleVisitor = async () => {
    setLoadingVisitor(true);
    await loginAsVisitor();
    setLoadingVisitor(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🛰️</Text>
          </View>
          <Text style={styles.appName}>LUPA</Text>
          <Text style={styles.subtitle}>
            Monitoramento urbano por imagens{'\n'}satelitais em tempo real
          </Text>
          <View style={styles.satBadgeRow}>
            <View style={styles.satBadge}>
              <Text style={styles.satBadgeText}>🛰 CBERS-6 (INPE)</Text>
            </View>
            <View style={styles.satBadge}>
              <Text style={styles.satBadgeText}>🌍 Sentinel-2 (ESA)</Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <FormInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormInput
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            icon="lock-closed-outline"
          />

          <Button label="ENTRAR" onPress={handleLogin} loading={loading} style={styles.btnLogin} />

          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={styles.cadastroLink}>
            <Text style={styles.cadastroLinkText}>
              Não tem conta? <Text style={styles.cadastroLinkBold}>Criar conta</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.btnVisitor} onPress={handleVisitor} disabled={loadingVisitor}>
            <Text style={styles.btnVisitorIcon}>🏛️</Text>
            <Text style={styles.btnVisitorText}>Entrar como visitante</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.demoHint}>
          Demo: joao@prefeitura.gov.br / senha123
        </Text>

        <Text style={styles.footer}>
          LUPA — Powered by Space Economy{'\n'}CBERS-6 · Sentinel-2 · INPE · ESA
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.primaryDark },
  container: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24 },
  logoArea: { alignItems: 'center', marginBottom: 36 },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    elevation: 6,
  },
  logoEmoji: { fontSize: 44 },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.primaryLight,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  satBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  satBadge: {
    backgroundColor: 'rgba(152,251,152,0.15)',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  satBadgeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    elevation: 8,
  },
  btnLogin: { marginTop: 8, marginBottom: 12 },
  cadastroLink: { alignItems: 'center', marginBottom: 16 },
  cadastroLinkText: { fontSize: 13, color: Colors.textSecondary },
  cadastroLinkBold: { color: Colors.primaryDark, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  divider: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { marginHorizontal: 12, color: Colors.textLight, fontSize: 13 },
  btnVisitor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: '#fafafa',
    gap: 8,
  },
  btnVisitorIcon: { fontSize: 18 },
  btnVisitorText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  demoHint: {
    marginTop: 16,
    fontSize: 11,
    color: Colors.primaryLight,
    textAlign: 'center',
    opacity: 0.8,
  },
  footer: {
    marginTop: 12,
    fontSize: 11,
    color: Colors.primaryLight,
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default LoginScreen;
