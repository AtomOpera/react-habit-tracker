import { createContext, useContext, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import { isSameDay } from "date-fns";

export type Habit = {
  id: string;
  name: string;
  completions: Date[];
};

type HabitState = {
  habits: Habit[];
  name: string;
};

type HabitAction =
  | { type: "setName"; payload: string }
  | { type: "addHabit"; payload: string }
  | { type: "deleteHabit"; payload: string }
  | { type: "toggleHabit"; payload: { id: string; date: Date } };

type HabitContextValue = HabitState & {
  setName: (name: string) => void;
  addHabit: (name: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date: Date) => void;
};

const initialState: HabitState = {
  habits: [],
  name: "",
};

const HabitContext = createContext<HabitContextValue | undefined>(undefined);

function habitReducer(state: HabitState, action: HabitAction): HabitState {
  switch (action.type) {
    case "setName":
      return { ...state, name: action.payload };
    case "addHabit": {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        name: action.payload,
        completions: [],
      };
      return {
        ...state,
        habits: [...state.habits, newHabit],
      };
    }
    case "deleteHabit":
      return {
        ...state,
        habits: state.habits.filter((habit) => habit.id !== action.payload),
      };
    case "toggleHabit":
      return {
        ...state,
        habits: state.habits.map((habit) => {
          if (habit.id !== action.payload.id) {
            return habit;
          }

          const isCompleted = habit.completions.some((d) => isSameDay(d, action.payload.date));
          const newCompletions = isCompleted
            ? habit.completions.filter((d) => !isSameDay(d, action.payload.date))
            : [...habit.completions, action.payload.date];

          return { ...habit, completions: newCompletions };
        }),
      };
    default:
      return state;
  }
}

export function HabitProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  const value = useMemo<HabitContextValue>(
    () => ({
      ...state,
      setName: (name: string) => dispatch({ type: "setName", payload: name }),
      addHabit: (name: string) => dispatch({ type: "addHabit", payload: name }),
      deleteHabit: (id: string) => dispatch({ type: "deleteHabit", payload: id }),
      toggleHabit: (id: string, date: Date) => dispatch({ type: "toggleHabit", payload: { id, date } }),
    }),
    [state]
  );

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabitContext() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabitContext must be used within HabitProvider");
  }
  return context;
}
