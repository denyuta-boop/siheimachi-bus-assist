import { useState } from 'react';
import { routes } from '../data/timetable';
import { formatTime } from '../lib/schedule';

type Props = {
  currentMin: number;
};

export function TimetableView({ currentMin }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <span>時刻表を見る</span>
        <span className="text-slate-400 text-xs">{open ? '▲ 閉じる' : '▼ 開く'}</span>
      </button>

      {open && (
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {routes.map((route) => {
            const nextIdx = route.times.findIndex((t) => t >= currentMin);
            return (
              <div key={route.id} className="p-4">
                <div className="font-semibold text-sm text-slate-700 dark:text-slate-200 mb-2">
                  {route.platform}（{route.direction}）{route.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {route.times.map((t, i) => {
                    const isPast = t < currentMin;
                    const isNext = i === nextIdx;
                    return (
                      <span
                        key={t}
                        className={`tabular-nums text-sm px-2 py-0.5 rounded font-mono ${
                          isNext
                            ? 'bg-blue-600 text-white font-bold'
                            : isPast
                            ? 'text-slate-300 dark:text-slate-600'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {formatTime(t)}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
