export type FrequencyType = 'daily' | 'weekdays';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  frequency: FrequencyType;
  weekdays?: number[]; // 1 = Lunes, ..., 7 = Domingo
}

export interface HabitFormData {
  name: string;
  icon: string;
  frequency: FrequencyType;
  weekdays: number[];
}

export const WEEKDAYS_MAP = [
  { id: 1, label: 'L', name: 'Lun', fullName: 'Lunes' },
  { id: 2, label: 'M', name: 'Mar', fullName: 'Martes' },
  { id: 3, label: 'M', name: 'Mié', fullName: 'Miércoles' },
  { id: 4, label: 'J', name: 'Jue', fullName: 'Jueves' },
  { id: 5, label: 'V', name: 'Vie', fullName: 'Viernes' },
  { id: 6, label: 'S', name: 'Sáb', fullName: 'Sábado' },
  { id: 7, label: 'D', name: 'Dom', fullName: 'Domingo' },
] as const;

export function formatHabitFrequency(habit: Habit): string {
  if (habit.frequency === 'daily') {
    return 'Diario';
  }

  const days = habit.weekdays ?? [];
  if (days.length === 0 || days.length === 7) {
    return 'Diario';
  }

  const sorted = [...days].sort((a, b) => a - b);

  // Check if Monday to Friday (1..5)
  if (sorted.length === 5 && sorted.every((d, i) => d === i + 1)) {
    return 'Lunes a Viernes';
  }

  // Check if weekend (6, 7)
  if (sorted.length === 2 && sorted.includes(6) && sorted.includes(7)) {
    return 'Fines de semana';
  }

  return sorted
    .map(dayId => WEEKDAYS_MAP.find(w => w.id === dayId)?.name ?? '')
    .filter(Boolean)
    .join(', ');
}
