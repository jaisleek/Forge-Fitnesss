export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface Routine {
  id: string;
  userId: string;
  name: string;
  description: string;
  exercises: Exercise[];
  createdAt: number;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  routineId: string;
  routineName: string;
  date: number; // timestamp
  durationMinutes: number;
}
