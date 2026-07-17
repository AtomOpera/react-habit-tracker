import { createSlice, configureStore, type PayloadAction } from '@reduxjs/toolkit';
import { isSameDay } from 'date-fns';

export type Habit = {
  id: string;
  name: string;
  completions: Date[];
};

interface HabitsState {
  items: Habit[];
}

const initialState: HabitsState = {
  items: [],
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    addHabit: (state, action: PayloadAction<string>) => {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        name: action.payload,
        completions: [],
      };
      state.items.push(newHabit);
    },
    deleteHabit: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((habit) => habit.id !== action.payload);
    },
    toggleHabit: (state, action: PayloadAction<{ id: string; date: Date }>) => {
      const habit = state.items.find((h) => h.id === action.payload.id);
      if (habit) {
        const isCompleted = habit.completions.some((d) =>
          isSameDay(d, action.payload.date)
        );
        if (isCompleted) {
          habit.completions = habit.completions.filter(
            (d) => !isSameDay(d, action.payload.date)
          );
        } else {
          habit.completions.push(action.payload.date);
        }
      }
    },
  },
});

export const { addHabit, deleteHabit, toggleHabit } = habitsSlice.actions;

export const store = configureStore({
  reducer: {
    habits: habitsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
