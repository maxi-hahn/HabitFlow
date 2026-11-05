import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Habit, HabitFormData } from '@/types/habit';
import {
  initDatabase,
  getAllHabits,
  insertHabit,
  updateHabitInDb,
  toggleHabitInDb,
  deleteHabitFromDb,
} from '@/database';

interface HabitContextType {
  habits: Habit[];
  isLoading: boolean;
  completedCount: number;
  totalCount: number;
  progress: number;
  toggleHabit: (id: string) => Promise<void>;
  addHabit: (data: HabitFormData) => Promise<void>;
  updateHabit: (id: string, data: HabitFormData) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHabits() {
      try {
        await initDatabase();
        const loadedHabits = await getAllHabits();
        if (isMounted) {
          setHabits(loadedHabits);
        }
      } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHabits();

    return () => {
      isMounted = false;
    };
  }, []);

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  async function toggleHabit(id: string) {
    const targetHabit = habits.find(h => h.id === id);
    if (!targetHabit) return;

    const nextCompleted = !targetHabit.completed;

    // Optimistic update
    setHabits(currentHabits =>
      currentHabits.map(habit =>
        habit.id === id ? { ...habit, completed: nextCompleted } : habit
      )
    );

    try {
      await toggleHabitInDb(id, nextCompleted);
    } catch (error) {
      console.error('Error al alternar estado del hábito en la base de datos:', error);
      // Revert in case of error
      setHabits(currentHabits =>
        currentHabits.map(habit =>
          habit.id === id ? { ...habit, completed: targetHabit.completed } : habit
        )
      );
    }
  }

  async function addHabit(data: HabitFormData) {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: data.name.trim(),
      icon: data.icon || '🎯',
      completed: false,
      frequency: data.frequency,
      weekdays: data.frequency === 'weekdays' ? data.weekdays : [1, 2, 3, 4, 5, 6, 7],
    };

    // Optimistic update
    setHabits(currentHabits => [newHabit, ...currentHabits]);

    try {
      await insertHabit(newHabit);
    } catch (error) {
      console.error('Error al guardar el hábito en la base de datos:', error);
      // Revert in case of error
      setHabits(currentHabits => currentHabits.filter(habit => habit.id !== newHabit.id));
    }
  }

  async function updateHabit(id: string, data: HabitFormData) {
    const previousHabits = habits;

    // Optimistic update
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

    try {
      await updateHabitInDb(id, data);
    } catch (error) {
      console.error('Error al actualizar el hábito en la base de datos:', error);
      // Revert in case of error
      setHabits(previousHabits);
    }
  }

  async function deleteHabit(id: string) {
    const previousHabits = habits;

    // Optimistic update
    setHabits(currentHabits => currentHabits.filter(habit => habit.id !== id));

    try {
      await deleteHabitFromDb(id);
    } catch (error) {
      console.error('Error al eliminar el hábito de la base de datos:', error);
      // Revert in case of error
      setHabits(previousHabits);
    }
  }

  return (
    <HabitContext.Provider
      value={{
        habits,
        isLoading,
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
