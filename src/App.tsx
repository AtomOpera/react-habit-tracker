import { useState } from "react";
import type { SubmitEvent } from "react";
import { Button } from "./Components/Button";
import {startOfWeek, endOfWeek, eachDayOfInterval, format, isFuture, isSameDay, subDays} from "date-fns";
export default function App() {
  const [habits, setHabits] = useState<Habit[]>([
    // { id: "1", name: "Exercise" }
  ]);

  function addHabit(name: string) {
    const newHabit = {
      id: crypto.randomUUID(),
      name,
      completions: []
    };
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  }

  function deleteHabit(id: string) {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
  }

  function toggleHabit(id: string, date: Date) {
    setHabits((curr) =>
      curr.map((h) => {
        if (h.id === id) {
          const isCompleted = h.completions.some((d) => isSameDay(d, date));
          const newCompletions = isCompleted
            ? h.completions.filter((d) => !isSameDay(d, date))
            : [...h.completions, date];
          return { ...h, completions: newCompletions };
        }
        return h;
      })
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 flex flex-col gap-4">
      <Header />
      <HabitForm addHabit={addHabit} />
      <HabitList habits={habits} deleteHabit={deleteHabit} toggleHabit={toggleHabit} />
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex flex-col gap-1"> 
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
        <span className="text-zinc-400 text-sm">1 / 1 done today</span>
      </div>
      <div className="flex flex-col gap-1 items-end">
        <span className="text-zinc-400 text-sm">April 6 - April 12</span>
        <div className="flex items-center gap-3">
          <Button>Prev</Button>
          <Button>Next</Button>
        </div>
      </div>
    </header>
  );
}

type HabitFormProps = {
  addHabit: (name: string) => void;
};

function HabitForm({ addHabit }: HabitFormProps) {
  const [name, setName] = useState("");

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if(name.trim() === "") return;
    addHabit(name);
    setName("");
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="New habit..."
        className="flex-1 rounded-lg bg-zinc-800 
        px-4 py-2 outline-none focus-visible:ring-2
        focus-visible:ring-violet-500"
      />
      <Button
        type="submit"
        className="rounded-lg px-4 py-2 font-medium"
      >
        Add Habit
      </Button>
    </form>
  );
}

type Habit = {
  id: string;
  name: string;
  completions: Date[]; // Array of dates when the habit was completed
};

type HabitsListProps = {
  habits: Habit[];
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date: Date) => void;
};

function HabitList( {habits, deleteHabit, toggleHabit}: HabitsListProps) {
  // const habits = [
  //   { id: "1", name: "Exercise" },
  //   { id: "2", name: "Read" },
  //   { id: "3", name: "Meditate" }
  // ];
  if (habits.length === 0) {
    return (
      <p className="text-center text-zinc-500 py-12">
        No habits yet. Add one above to get started!
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} deleteHabit={deleteHabit} toggleHabit={toggleHabit} />
      ))}
    </ul>
  );
}

type HabitItemProps = {
  habit: Habit;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date: Date) => void;
};

function HabitItem({ habit, deleteHabit, toggleHabit }: HabitItemProps) {
  const visibleDates = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 })
  });
  const streak = getStreak(habit.completions)
  console.log("streak", streak, habit.completions);

  return (
    <div className="rounded-xl bg-zinc-800 p-4 flex flex-col gap-3">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium">{habit.name}</span>
          {streak !== 0 && (
            <span className="text-sm text-amber-400">🔥 {streak}</span>
          )}
        </div>
        <Button variant="ghost-destructive" className="text-sm" onClick={() => deleteHabit(habit.id)}>Delete</Button>
      </div>
      {/* footer */}
      <div className="flex gap-1.5">
        {visibleDates.map((date) => (
          <Button 
            className="flex flex-1 flex-col items-center gap-0.5 rounded-lg text-xs" 
            key={date.toISOString()} 
            disabled={isFuture(date)}
            variant={habit.completions.some(d => isSameDay(d, date)) ? "primary" : "secondary"}
            onClick={() => toggleHabit(habit.id, date)}
          >
            <span className="font-medium">{format(date, "EEE")}</span>
            <span>{format(date, "d")}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

function getStreak(completions: Date[]) {
  let streak = 0
  let date = new Date()

  while (completions.some(c => isSameDay(c, date))) {
    streak++
    date = subDays(date, 1)
  }

  return streak
}