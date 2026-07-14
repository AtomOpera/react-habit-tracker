import { Button } from "./Components/Button";

export default function App() {
  return (
    <div className="max-w-2xl mx-auto px-4 flex flex-col gap-4">
      <Header />
      <HabitForm />
      <HabitList/>
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

function HabitForm() {
  return (
    <form className="flex gap-2">
      <input
        type="text"
        placeholder="New habit"
        className="flex-1 rounded-lg bg-zinc-800 
        px-4 py-2 outline-none focus-visible:ring-2
        focus-visible:ring-violet-500"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded px-3 py-2"
      >
        Add Habit
      </button>
    </form>
  );
}

function HabitList() {
  const habits = [
    { id: "1", name: "Exercise" },
    { id: "2", name: "Read" },
    { id: "3", name: "Meditate" }
  ];
  return (
    <ul className="flex flex-col gap-2">
      {habits.map((habit) => (
        <li key={habit.id} className="flex items-center justify-between bg-zinc-800 p-4 rounded-lg">
          <span>{habit.name}</span>
          <input type="checkbox" />
        </li>
      ))}
    </ul>
  );
}

type HabitItemProps = {
  habit: {
    id: string;
    name: string;
  };
};

function HabitItem({ habit }: HabitItemProps) {
  return (
    <div className="rounded-x1 bg-zinc-800 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium">{habit.name}</span>
          <span className="text-sm text-amber-400">🔥 3</span>
        </div>
        <Button>Delete</Button>
      </div>
    </div>
  );
}