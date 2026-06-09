import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../styles/colors';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';

type CadastroNavProp = NativeStackNavigationProp<AuthStackParamList, 'Cadastro'>;

interface Props {
  navigation: CadastroNavProp;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const CadastroScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCriarConta = async () => {
    if (!nome.trim() || !email.trim() || !senha || !confirmar) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Email inválido', 'Digite um email válido.');
      return;
    }
    if (senha.length < 8) {
      Alert.alert('Senha fraca', 'A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (senha !== confirmar) {
      Alert.alert('Senhas diferentes', 'A confirmação de senha não confere.');
      return;
    }

    setLoading(true);
    try {
      await register({ nome: nome.trim(), email: email.trim(), senha });
      // AuthContext updates user → AppNavigator switches to MainTabs automatically
    } catch (err: any) {
      Alert.alert('Erro no cadastro', err.message ?? 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="Criar Conta"
        showBack
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <Text style={styles.subtitle}>
            Preencha os dados abaixo para criar sua conta de Agente de Campo.
          </Text>

          <FormInput
            label="Nome completo"
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
            icon="person-outline"
          />
          <FormInput
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormInput
            label="Senha"
            placeholder="Mínimo 8 caracteres"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            icon="lock-closed-outline"
          />
          <FormInput
            label="Confirmar senha"
            placeholder="Repita a senha"
            value={confirmar}
            onChangeText={setConfirmar}
            secureTextEntry
            icon="lock-closed-outline"
          />

          <Button
            label="Criar Conta"
            onPress={handleCriarConta}
            loading={loading}
            style={styles.btnCriar}
          />
          <Button
            label="Voltar para Login"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.btnVoltar}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 19,
  },
  btnCriar: { marginTop: 8, marginBottom: 10 },
  btnVoltar: { marginBottom: 4 },
});

export default CadastroScreen;
