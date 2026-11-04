import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Pencil, Trash2, Plus } from 'lucide-react-native';
import { useHabits } from '@/context/HabitContext';
import { Habit, HabitFormData, formatHabitFrequency } from '@/types/habit';
import { HabitFormModal } from '@/components/HabitFormModal';

export default function HabitsScreen() {
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits();

  const [modalVisible, setModalVisible] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  function handleOpenCreate() {
    setHabitToEdit(null);
    setModalVisible(true);
  }

  function handleOpenEdit(habit: Habit) {
    setHabitToEdit(habit);
    setModalVisible(true);
  }

  function handleConfirmDelete(habit: Habit) {
    const message = `¿Estás seguro de que deseas eliminar el hábito "${habit.name}"?`;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(message)) {
        deleteHabit(habit.id);
      }
    } else {
      Alert.alert('Eliminar hábito', message, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteHabit(habit.id),
        },
      ]);
    }
  }

  function handleSaveHabit(data: HabitFormData) {
    if (habitToEdit) {
      updateHabit(habitToEdit.id, data);
    } else {
      addHabit(data);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Mis hábitos</Text>
        <Text style={styles.subtitle}>
          Gestiona tus rutinas y construye constancia día a día.
        </Text>

        {/* Prominent Create Habit Button */}
        <Pressable
          style={styles.createButton}
          onPress={handleOpenCreate}
          accessibilityRole="button"
          accessibilityLabel="Crear nuevo hábito"
        >
          <View style={styles.createButtonIconWrapper}>
            <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <Text style={styles.createButtonText}>Crear nuevo hábito</Text>
        </Pressable>

        {/* Section title & count */}
        <View style={styles.listHeader}>
          <Text style={styles.listSectionTitle}>Todos los hábitos</Text>
          <Text style={styles.listBadge}>{habits.length}</Text>
        </View>

        {/* Habits List */}
        {habits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✨</Text>
            <Text style={styles.emptyTitle}>Aún no tienes hábitos</Text>
            <Text style={styles.emptyDescription}>
              Comienza agregando tu primer hábito con el botón de arriba.
            </Text>
          </View>
        ) : (
          habits.map(habit => (
            <View key={habit.id} style={styles.habitCard}>
              <View style={styles.iconContainer}>
                <Text style={styles.habitEmoji}>{habit.icon}</Text>
              </View>

              <View style={styles.habitInfo}>
                <Text style={styles.habitName} numberOfLines={1}>
                  {habit.name}
                </Text>
                <View style={styles.frequencyBadge}>
                  <Text style={styles.frequencyText}>
                    {formatHabitFrequency(habit)}
                  </Text>
                </View>
              </View>

              {/* Action buttons */}
              <View style={styles.actionsContainer}>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => handleOpenEdit(habit)}
                  accessibilityRole="button"
                  accessibilityLabel={`Editar hábito ${habit.name}`}
                  hitSlop={8}
                >
                  <Pencil size={17} color="#77A98A" strokeWidth={2.2} />
                </Pressable>

                <Pressable
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleConfirmDelete(habit)}
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar hábito ${habit.name}`}
                  hitSlop={8}
                >
                  <Trash2 size={17} color="#D96363" strokeWidth={2.2} />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Create / Edit Modal */}
      <HabitFormModal
        visible={modalVisible}
        habitToEdit={habitToEdit}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveHabit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#263B30',
  },
  subtitle: {
    fontSize: 15,
    color: '#829187',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#77A98A',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 28,
    shadowColor: '#77A98A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  createButtonIconWrapper: {
    marginRight: 10,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#263B30',
  },
  listBadge: {
    backgroundColor: '#F3F7F3',
    color: '#77A98A',
    fontWeight: '700',
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFF4F0',
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F3F7F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  habitEmoji: {
    fontSize: 22,
  },
  habitInfo: {
    flex: 1,
    marginRight: 10,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263B30',
    marginBottom: 4,
  },
  frequencyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF4EF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  frequencyText: {
    fontSize: 12,
    color: '#658E75',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F5F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FDEEEE',
  },
  emptyContainer: {
    backgroundColor: '#F3F7F3',
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#263B30',
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#829187',
    textAlign: 'center',
    lineHeight: 20,
  },
});
