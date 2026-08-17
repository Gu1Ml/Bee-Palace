import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { RootStackParamList } from '../navigation/AppNavigator';
import { addTask } from '../../store/slices/taskSlice';
import taskService from '../../data/services/taskService';
import { CreateTaskRequest } from '../../data/models/task';

type CreateTaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateTask'>;

interface Props {
  navigation: CreateTaskScreenNavigationProp;
}

const COLORS = {
  primary: '#2196F3',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#f44336',
  light: '#f5f5f5',
  text: '#333',
  textLight: '#666',
  border: '#ddd',
};

export default function CreateTaskScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [loading, setLoading] = useState(false);

  const handleCreateTask = async () => {
    if (!title.trim()) {
      Alert.alert('Atenção', 'O título é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      const request: CreateTaskRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        recurringType: 'NONE',
      };

      const newTask = await taskService.createTask(request);
      dispatch(addTask(newTask));

      Alert.alert('Sucesso', 'Tarefa criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Tasks'),
        },
      ]);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Erro ao criar tarefa';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova Tarefa</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Fazer compras"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Leite, pão, ovos..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.priorityContainer}>
              {(['LOW', 'MEDIUM', 'HIGH'] as const).map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    priority === p && styles.priorityButtonActive,
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      priority === p && styles.priorityButtonTextActive,
                    ]}
                  >
                    {p === 'HIGH' ? 'Alta' : p === 'MEDIUM' ? 'Média' : 'Baixa'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreateTask}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Criar Tarefa</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  form: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: COLORS.text,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  priorityButtonTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#90CAF9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});