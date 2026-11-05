import * as SQLite from 'expo-sqlite';
import { Habit, HabitFormData, FrequencyType } from '@/types/habit';

const DATABASE_NAME = 'habitflow.db';

export const INITIAL_HABITS: Habit[] = [
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

interface HabitRow {
  id: string;
  name: string;
  icon: string;
  completed: number;
  frequency: string;
  weekdays: string | null;
  created_at: number;
}

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }
  return dbPromise;
}

function mapRowToHabit(row: HabitRow): Habit {
  let weekdays: number[] | undefined;
  if (row.weekdays) {
    try {
      const parsed = JSON.parse(row.weekdays);
      if (Array.isArray(parsed)) {
        weekdays = parsed;
      }
    } catch {
      weekdays = undefined;
    }
  }

  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    completed: row.completed === 1,
    frequency: (row.frequency === 'weekdays' ? 'weekdays' : 'daily') as FrequencyType,
    weekdays,
  };
}

export async function initDatabase(): Promise<void> {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      frequency TEXT NOT NULL,
      weekdays TEXT,
      created_at INTEGER NOT NULL
    );
  `);

  const versionResult = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const userVersion = versionResult?.user_version ?? 0;

  if (userVersion === 0) {
    const countResult = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM habits'
    );
    const existingCount = countResult?.count ?? 0;

    if (existingCount === 0) {
      const now = Date.now();
      for (let i = 0; i < INITIAL_HABITS.length; i++) {
        const habit = INITIAL_HABITS[i];
        const createdAt = now - i * 1000;
        await db.runAsync(
          `INSERT OR IGNORE INTO habits (id, name, icon, completed, frequency, weekdays, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          habit.id,
          habit.name,
          habit.icon,
          habit.completed ? 1 : 0,
          habit.frequency,
          JSON.stringify(habit.weekdays ?? [1, 2, 3, 4, 5, 6, 7]),
          createdAt
        );
      }
    }

    await db.execAsync('PRAGMA user_version = 1;');
  }
}

export async function getAllHabits(): Promise<Habit[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<HabitRow>(
    'SELECT id, name, icon, completed, frequency, weekdays, created_at FROM habits ORDER BY created_at DESC'
  );
  return rows.map(mapRowToHabit);
}

export async function insertHabit(habit: Habit, createdAt = Date.now()): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO habits (id, name, icon, completed, frequency, weekdays, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    habit.id,
    habit.name,
    habit.icon,
    habit.completed ? 1 : 0,
    habit.frequency,
    JSON.stringify(habit.weekdays ?? [1, 2, 3, 4, 5, 6, 7]),
    createdAt
  );
}

export async function updateHabitInDb(id: string, data: HabitFormData): Promise<void> {
  const db = await getDatabase();
  const weekdays = data.frequency === 'weekdays' ? data.weekdays : [1, 2, 3, 4, 5, 6, 7];
  await db.runAsync(
    `UPDATE habits
     SET name = ?, icon = ?, frequency = ?, weekdays = ?
     WHERE id = ?`,
    data.name.trim(),
    data.icon,
    data.frequency,
    JSON.stringify(weekdays),
    id
  );
}

export async function toggleHabitInDb(id: string, completed: boolean): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE habits SET completed = ? WHERE id = ?',
    completed ? 1 : 0,
    id
  );
}

export async function deleteHabitFromDb(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM habits WHERE id = ?', id);
}
