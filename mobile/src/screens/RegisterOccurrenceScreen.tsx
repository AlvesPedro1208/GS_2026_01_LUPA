import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/colors';
import Header from '../components/Header';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { occurrenceService } from '../services/occurrenceService';
import { OccurrenceType } from '../types/Occurrence';
import { ComunidadeDTO } from '../services/lupaApi';

const RegisterOccurrenceScreen: React.FC = () => {
  const [types, setTypes] = useState<OccurrenceType[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [photoAdded, setPhotoAdded] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Integração com a API real
  const [comunidades, setComunidades] = useState<ComunidadeDTO[]>([]);
  const [selectedComunidadeId, setSelectedComunidadeId] = useState<number | null>(null);
  const [loadingComunidades, setLoadingComunidades] = useState(true);
  const [persistedOnServer, setPersistedOnServer] = useState(false);

  const backendOnline = comunidades.length > 0;

  useEffect(() => {
    setTypes(occurrenceService.getTypes());
    occurrenceService
      .getComunidades()
      .then(setComunidades)
      .finally(() => setLoadingComunidades(false));
  }, []);

  const handleAddPhoto = () => {
    Alert.alert('Adicionar Foto', 'Selecione a origem', [
      { text: 'Câmera', onPress: () => setPhotoAdded(true) },
      { text: 'Galeria', onPress: () => setPhotoAdded(true) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleCapturarLocalizacao = () => {
    setLocationCaptured(true);
    Alert.alert('Localização capturada', 'Lat: -23.5505 / Long: -46.6333');
  };

  const handleEnviar = async () => {
    if (backendOnline && selectedComunidadeId == null) {
      Alert.alert('Atenção', 'Selecione a comunidade da ocorrência.');
      return;
    }
    if (!selectedType) {
      Alert.alert('Atenção', 'Selecione o tipo de ocorrência.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Atenção', 'Preencha a descrição.');
      return;
    }

    setSending(true);
    try {
      const result = await occurrenceService.submit({
        typeId: selectedType,
        comunidadeId: selectedComunidadeId ?? undefined,
        description: description.trim(),
        hasPhoto: photoAdded,
        latitude: locationCaptured ? -23.5505 : undefined,
        longitude: locationCaptured ? -46.6333 : undefined,
      });
      setPersistedOnServer(result.persisted);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedType('');
        setDescription('');
        setPhotoAdded(false);
        setLocationCaptured(false);
        setSelectedComunidadeId(null);
      }, 2500);
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar a ocorrência.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Header title="Nova Ocorrência" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Backend connection status */}
        <View style={[styles.statusBanner, backendOnline ? styles.statusOnline : styles.statusOffline]}>
          <Ionicons
            name={backendOnline ? 'cloud-done-outline' : 'cloud-offline-outline'}
            size={16}
            color={backendOnline ? Colors.success : Colors.textSecondary}
          />
          <Text style={[styles.statusText, { color: backendOnline ? Colors.success : Colors.textSecondary }]}>
            {loadingComunidades
              ? 'Conectando ao servidor...'
              : backendOnline
                ? 'Conectado ao servidor LUPA'
                : 'Servidor offline — será salvo localmente'}
          </Text>
        </View>

        {/* Community selection (real API) */}
        {backendOnline && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comunidade</Text>
            <View style={styles.typeGrid}>
              {comunidades.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.typeOption, selectedComunidadeId === c.id && styles.typeOptionSelected]}
                  onPress={() => setSelectedComunidadeId(c.id)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.typeRadio,
                    selectedComunidadeId === c.id && { borderColor: Colors.primaryDark, backgroundColor: Colors.primaryDark },
                  ]}>
                    {selectedComunidadeId === c.id && <View style={styles.typeRadioInner} />}
                  </View>
                  <Ionicons name="business-outline" size={18} color={Colors.textSecondary} style={{ marginRight: 10 }} />
                  <Text style={[
                    styles.typeLabel,
                    selectedComunidadeId === c.id && { color: Colors.primaryDark, fontWeight: '700' },
                  ]}>
                    {c.nome} · {c.setor}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Type selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de ocorrência</Text>
          <View style={styles.typeGrid}>
            {types.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeOption, selectedType === type.id && styles.typeOptionSelected]}
                onPress={() => setSelectedType(type.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.typeRadio,
                  selectedType === type.id && { borderColor: type.color, backgroundColor: type.color },
                ]}>
                  {selectedType === type.id && <View style={styles.typeRadioInner} />}
                </View>
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={[
                  styles.typeLabel,
                  selectedType === type.id && { color: type.color, fontWeight: '700' },
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <FormInput
            label="Descrição"
            placeholder="Descreva o problema..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Foto</Text>
          <TouchableOpacity
            style={[styles.mediaBtn, photoAdded && styles.mediaBtnDone]}
            onPress={handleAddPhoto}
          >
            <Ionicons
              name={photoAdded ? 'checkmark-circle-outline' : 'camera-outline'}
              size={22}
              color={photoAdded ? Colors.success : Colors.textSecondary}
            />
            <Text style={[styles.mediaBtnText, photoAdded && { color: Colors.success }]}>
              {photoAdded ? 'Foto adicionada ✓' : 'Tirar Foto'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Localização</Text>
          <TouchableOpacity
            style={[styles.mediaBtn, locationCaptured && styles.mediaBtnDone]}
            onPress={handleCapturarLocalizacao}
          >
            <Ionicons
              name={locationCaptured ? 'checkmark-circle-outline' : 'location-outline'}
              size={22}
              color={locationCaptured ? Colors.success : Colors.textSecondary}
            />
            <Text style={[styles.mediaBtnText, locationCaptured && { color: Colors.success }]}>
              {locationCaptured ? 'Localização capturada ✓' : 'Capturar localização'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sendSection}>
          <Button label="Enviar" onPress={handleEnviar} loading={sending} />
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal transparent visible={showSuccess} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={60} color={Colors.success} />
            <Text style={styles.successTitle}>Ocorrência Enviada!</Text>
            <Text style={styles.successMsg}>
              {persistedOnServer
                ? 'Registrada no servidor LUPA e será analisada em breve.'
                : 'Salva localmente (servidor offline). Será sincronizada depois.'}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  statusOnline: { backgroundColor: '#eaf7ea' },
  statusOffline: { backgroundColor: Colors.border + '55' },
  statusText: { fontSize: 12, fontWeight: '600' },
  section: { marginTop: 16, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  typeGrid: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 8,
    elevation: 2,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 2,
  },
  typeOptionSelected: { backgroundColor: Colors.primary + '22' },
  typeRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeRadioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.white },
  typeIcon: { fontSize: 18, marginRight: 10, width: 26, textAlign: 'center' },
  typeLabel: { fontSize: 14, color: Colors.textPrimary },
  fieldLabel: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary, marginBottom: 8 },
  mediaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    paddingVertical: 16,
    gap: 8,
  },
  mediaBtnDone: { borderColor: Colors.success, borderStyle: 'solid', backgroundColor: '#f0fff0' },
  mediaBtnText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  sendSection: { marginTop: 24, paddingHorizontal: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    elevation: 10,
    gap: 12,
  },
  successTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  successMsg: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});

export default RegisterOccurrenceScreen;
