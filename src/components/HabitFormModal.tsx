import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Habit, HabitFormData, FrequencyType, WEEKDAYS_MAP } from '@/types/habit';

const EMOJI_OPTIONS = [
  '📚', '💧', '🏋️', '💻', '🧘', '🏃',
  '🍏', '😴', '✍️', '🎯', '🌿', '🚶',
  '🎨', '🎵', '🚴', '💊', '🥑', '⚡',
];

interface HabitFormModalProps {
  visible: boolean;
  habitToEdit?: Habit | null;
  onClose: () => void;
  onSave: (data: HabitFormData) => void;
}

export function HabitFormModal({
  visible,
  habitToEdit,
  onClose,
  onSave,
}: HabitFormModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [weekdays, setWeekdays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = Boolean(habitToEdit);

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name);
      setIcon(habitToEdit.icon);
      setFrequency(habitToEdit.frequency);
      setWeekdays(
        habitToEdit.weekdays && habitToEdit.weekdays.length > 0
          ? habitToEdit.weekdays
          : [1, 2, 3, 4, 5]
      );
    } else {
      setName('');
      setIcon('🎯');
      setFrequency('daily');
      setWeekdays([1, 2, 3, 4, 5]);
    }
    setErrorMessage('');
  }, [habitToEdit, visible]);

  function toggleWeekday(dayId: number) {
    setWeekdays(currentDays => {
      if (currentDays.includes(dayId)) {
        // Prevent deselecting all days
        if (currentDays.length === 1) return currentDays;
        return currentDays.filter(id => id !== dayId);
      } else {
        return [...currentDays, dayId].sort((a, b) => a - b);
      }
    });
  }

  function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('Por favor, ingresa un nombre para el hábito.');
      return;
    }

    onSave({
      name: trimmedName,
      icon,
      frequency,
      weekdays: frequency === 'weekdays' ? weekdays : [1, 2, 3, 4, 5, 6, 7],
    });

    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? 'Editar hábito' : 'Nuevo hábito'}
            </Text>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Cerrar modal"
              accessibilityRole="button"
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Habit Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Nombre del hábito *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  errorMessage ? styles.inputError : null,
                ]}
                placeholder="Ej. Meditar 10 minutos"
                placeholderTextColor="#829187"
                value={name}
                onChangeText={text => {
                  setName(text);
                  if (errorMessage) setErrorMessage('');
                }}
                maxLength={45}
                returnKeyType="done"
              />
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
            </View>

            {/* Icon Picker */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Elige un icono</Text>
              <View style={styles.emojiGrid}>
                {EMOJI_OPTIONS.map(item => {
                  const isSelected = icon === item;
                  return (
                    <Pressable
                      key={item}
                      style={[
                        styles.emojiButton,
                        isSelected && styles.emojiButtonSelected,
                      ]}
                      onPress={() => setIcon(item)}
                      accessibilityRole="button"
                    >
                      <Text style={styles.emojiText}>{item}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Frequency Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Frecuencia</Text>
              <View style={styles.frequencyTabs}>
                <Pressable
                  style={[
                    styles.freqTab,
                    frequency === 'daily' && styles.freqTabSelected,
                  ]}
                  onPress={() => setFrequency('daily')}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.freqTabText,
                      frequency === 'daily' && styles.freqTabTextSelected,
                    ]}
                  >
                    Todos los días
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.freqTab,
                    frequency === 'weekdays' && styles.freqTabSelected,
                  ]}
                  onPress={() => setFrequency('weekdays')}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.freqTabText,
                      frequency === 'weekdays' && styles.freqTabTextSelected,
                    ]}
                  >
                    Días específicos
                  </Text>
                </Pressable>
              </View>

              {/* Day pills if weekdays frequency is selected */}
              {frequency === 'weekdays' && (
                <View style={styles.weekdaysContainer}>
                  <Text style={styles.weekdaysSubLabel}>
                    Selecciona los días:
                  </Text>
                  <View style={styles.weekdaysRow}>
                    {WEEKDAYS_MAP.map(day => {
                      const isDaySelected = weekdays.includes(day.id);
                      return (
                        <Pressable
                          key={day.id}
                          style={[
                            styles.dayPill,
                            isDaySelected && styles.dayPillSelected,
                          ]}
                          onPress={() => toggleWeekday(day.id)}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: isDaySelected }}
                        >
                          <Text
                            style={[
                              styles.dayPillText,
                              isDaySelected && styles.dayPillTextSelected,
                            ]}
                          >
                            {day.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Pressable
              style={styles.cancelButton}
              onPress={onClose}
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={styles.saveButton}
              onPress={handleSave}
              accessibilityRole="button"
            >
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Guardar cambios' : 'Crear hábito'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#263B30',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F7F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 14,
    color: '#829187',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#263B30',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#F3F7F3',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#263B30',
    borderWidth: 1,
    borderColor: '#E2ECE4',
  },
  inputError: {
    borderColor: '#E25B5B',
  },
  errorText: {
    color: '#D94343',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  emojiButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F8FAF8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8EFEA',
  },
  emojiButtonSelected: {
    backgroundColor: '#F3F7F3',
    borderColor: '#77A98A',
    transform: [{ scale: 1.05 }],
  },
  emojiText: {
    fontSize: 22,
  },
  frequencyTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F7F3',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  freqTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  freqTabSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  freqTabText: {
    fontSize: 14,
    color: '#829187',
    fontWeight: '500',
  },
  freqTabTextSelected: {
    color: '#263B30',
    fontWeight: '600',
  },
  weekdaysContainer: {
    marginTop: 14,
  },
  weekdaysSubLabel: {
    fontSize: 13,
    color: '#829187',
    marginBottom: 8,
  },
  weekdaysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAF8',
    borderWidth: 1,
    borderColor: '#E8EFEA',
  },
  dayPillSelected: {
    backgroundColor: '#77A98A',
    borderColor: '#77A98A',
  },
  dayPillText: {
    fontSize: 13,
    color: '#829187',
    fontWeight: '500',
  },
  dayPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F1',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F3F7F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#829187',
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#77A98A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
