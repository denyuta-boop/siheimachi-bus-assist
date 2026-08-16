import { useState, useEffect } from 'react';
import { routes } from './data/timetable';
import { getRouteStatus } from './lib/schedule';
import { RecommendBanner } from './components/RecommendBanner';
import { RouteCard } from './components/RouteCard';
import { TimetableView } from './components/TimetableView';

function formatClock(d: Date): string {
  return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function App() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const currentMin = now.getHours() * 60 + now.getMinutes();
  const statuses = routes.map((r) => getRouteStatus(r, currentMin));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <header className="text-center">
          <h1 className="text-lg font-bold text-slate-700 dark:text-slate-200">
            子平町・壽徳寺前 → 仙台駅
          </h1>
          <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 mt-1">
            {formatClock(now)}
          </p>
        </header>

        <RecommendBanner statuses={statuses} />

        <div className="space-y-3">
          {statuses.map((s) => (
            <RouteCard key={s.route.id} status={s} allStatuses={statuses} />
          ))}
        </div>

        <TimetableView currentMin={currentMin} />

        <footer className="text-center text-xs text-slate-400 pt-2 pb-6">
          ※ 時刻はモックデータです。実際の運行と異なる場合があります。
        </footer>
      </div>
    </div>
  );
}
