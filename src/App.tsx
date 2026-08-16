import { useState, useEffect } from 'react';
import { routes, getSchedule } from './data/timetable';
import { getRouteStatus, formatTime, getRecommendedRoute, scheduleLabel } from './lib/schedule';
import { BusCard } from './components/BusCard';
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
  const schedule = getSchedule(now);
  const statuses = routes.map((r) => getRouteStatus(r, currentMin, schedule));
  const recommendedId = getRecommendedRoute(statuses);
  const recommended = statuses.find((s) => s.route.id === recommendedId);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <header className="text-center">
          <h1 className="text-base font-semibold text-slate-400">
            子平町・壽徳寺前 → 仙台駅
          </h1>
          <p className="text-3xl font-mono font-bold text-teal-400 mt-1">
            {formatClock(now)}
          </p>
          <p className="text-xs text-slate-500 mt-1">{scheduleLabel(schedule)}</p>
        </header>

        {recommended && recommended.next ? (
          <div className="rounded-2xl bg-blue-950 border border-amber-400 p-5">
            <div className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-1">
              今すぐ乗るなら
            </div>
            <div className="text-xl font-bold text-white mb-0.5">
              {recommended.route.label}
            </div>
            <div className="text-xs text-slate-400 mb-4">
              {recommended.route.platform}（{recommended.route.direction}）
            </div>
            <div className="flex items-end gap-4">
              <div>
                <div className="text-xs text-slate-400">発車</div>
                <div className="text-3xl font-bold tabular-nums text-white">
                  {formatTime(recommended.next.departureMin)}
                </div>
              </div>
              <div className="text-slate-500 text-sm mb-1">→</div>
              <div>
                <div className="text-xs text-slate-400">仙台駅着（目安）</div>
                <div className="text-3xl font-bold tabular-nums text-teal-400">
                  {formatTime(recommended.next.arrivalMin)}
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xs text-slate-400">待ち</div>
                <div className="text-2xl font-bold text-amber-400">
                  {recommended.next.waitMin}
                  <span className="text-base ml-0.5">分</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-800 border border-slate-700 p-5 text-center text-slate-500">
            本日の運行は終了しました
          </div>
        )}

        <div className="space-y-3">
          {statuses.map((s) => (
            <BusCard key={s.route.id} status={s} allStatuses={statuses} />
          ))}
        </div>

        <TimetableView currentMin={currentMin} schedule={schedule} />

        <footer className="text-center text-xs text-slate-600 pb-6">
          2026年04月01日改正ダイヤ
        </footer>
      </div>
    </div>
  );
}
