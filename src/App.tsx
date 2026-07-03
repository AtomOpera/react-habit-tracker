export default function App() {
  return (
    <div className="App">
      <Header />
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
      <div> </div>
    </header>
  );
}