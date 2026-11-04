import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useHabits } from '@/context/HabitContext';

export default function HomeScreen() {
  const { habits, completedCount, progress, toggleHabit } = useHabits();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>¡Buen día, Maxi! 👋</Text>
        <Text style={styles.date}>Es un buen día para avanzar.</Text>

        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Tu progreso de hoy</Text>

          <Text style={styles.progressNumber}>
            {Math.round(progress * 100)}%
          </Text>

          <Text style={styles.progressDescription}>
            {completedCount} de {habits.length} hábitos completados
          </Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis hábitos</Text>
          <Text style={styles.counter}>
            {completedCount}/{habits.length}
          </Text>
        </View>

        {habits.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🌱</Text>
            <Text style={styles.emptyTitle}>No tienes hábitos hoy</Text>
            <Text style={styles.emptySubtitle}>
              Ve a la pestaña Hábitos para agregar tu primer hábito.
            </Text>
          </View>
        ) : (
          habits.map(habit => (
            <Pressable
              key={habit.id}
              style={styles.habitCard}
              onPress={() => toggleHabit(habit.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: habit.completed }}
            >
              <Text style={styles.habitIcon}>{habit.icon}</Text>

              <Text
                style={[
                  styles.habitName,
                  habit.completed && styles.completedText,
                ]}
              >
                {habit.name}
              </Text>

              <View
                style={[
                  styles.checkCircle,
                  habit.completed && styles.checkedCircle,
                ]}
              >
                {habit.completed && <Text style={styles.check}>✓</Text>}
              </View>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#263B30',
  },
  date: {
    fontSize: 15,
    color: '#829187',
    marginTop: 8,
    marginBottom: 28,
  },
  progressCard: {
    backgroundColor: '#F3F7F3',
    borderRadius: 20,
    padding: 22,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#263B30',
  },
  progressNumber: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#77A98A',
    marginTop: 18,
  },
  progressDescription: {
    color: '#829187',
    marginTop: 4,
    marginBottom: 18,
  },
  progressBar: {
    height: 9,
    backgroundColor: '#DCE8DE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#77A98A',
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  counter: {
    color: '#77A98A',
    fontWeight: '600',
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF8',
    borderRadius: 16,
    padding: 17,
    marginBottom: 12,
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  habitName: {
    flex: 1,
    fontSize: 15,
    color: '#263B30',
    fontWeight: '500',
  },
  completedText: {
    color: '#9BA89E',
    textDecorationLine: 'line-through',
  },
  checkCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#C8D5CB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    backgroundColor: '#77A98A',
    borderColor: '#77A98A',
  },
  check: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: '#F3F7F3',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 12,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263B30',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#829187',
    textAlign: 'center',
    lineHeight: 20,
  },
});
