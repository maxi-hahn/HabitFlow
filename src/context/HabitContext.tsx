import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Habit, HabitFormData } from '@/types/habit';

const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Leer 20 minutos',
    icon: '📚',
    completed: true,
    frequency: 'daily',
    weekdays: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    id: '2',
    name: 'Tomar 2 litros de agua',
    icon: '💧',
    completed: false,
    frequency: 'daily',
    weekdays: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    id: '3',
    name: 'Entrenar',
    icon: '🏋️',
    completed: false,
    frequency: 'weekdays',
    weekdays: [1, 3, 5], // Lun, Mié, Vie
  },
  {
    id: '4',
    name: 'Estudiar programación',
    icon: '💻',
    completed: true,
    frequency: 'weekdays',
    weekdays: [1, 2, 3, 4, 5], // Lunes a Viernes
  },
];

interface HabitContextType {
  habits: Habit[];
  completedCount: number;
  totalCount: number;
  progress: number;
  toggleHabit: (id: string) => void;
  addHabit: (data: HabitFormData) => void;
  updateHabit: (id: string, data: HabitFormData) => void;
  deleteHabit: (id: string) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  function toggleHabit(id: string) {
    setHabits(currentHabits =>
      currentHabits.map(habit =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  }

  function addHabit(data: HabitFormData) {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: data.name.trim(),
      icon: data.icon || '🎯',
      completed: false,
      frequency: data.frequency,
      weekdays: data.frequency === 'weekdays' ? data.weekdays : [1, 2, 3, 4, 5, 6, 7],
    };

    setHabits(currentHabits => [newHabit, ...currentHabits]);
  }

  function updateHabit(id: string, data: HabitFormData) {
    setHabits(currentHabits =>
      currentHabits.map(habit => {
        if (habit.id !== id) return habit;
        return {
          ...habit,
          name: data.name.trim(),
          icon: data.icon || habit.icon,
          frequency: data.frequency,
          weekdays: data.frequency === 'weekdays' ? data.weekdays : [1, 2, 3, 4, 5, 6, 7],
        };
      })
    );
  }

  function deleteHabit(id: string) {
    setHabits(currentHabits => currentHabits.filter(habit => habit.id !== id));
  }

  return (
    <HabitContext.Provider
      value={{
        habits,
        completedCount,
        totalCount,
        progress,
        toggleHabit,
        addHabit,
        updateHabit,
        deleteHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits(): HabitContextType {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits debe utilizarse dentro de un HabitProvider');
  }
  return context;
}
