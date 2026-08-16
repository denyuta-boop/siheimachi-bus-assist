import { useState } from 'react';
import { routes } from '../data/timetable';
import type { Schedule } from '../data/timetable';
import { formatTime } from '../lib/schedule';

type Props = {
  currentMin: number;
  schedule: Schedule;
};

const TABS: { key: Schedule; label: string }[] = [
  { key: 'weekday', label: '平日' },
  { key: 'saturday', label: '土曜' },
  { key: 'holiday', label: '休日' },
];

export function TimetableView({ currentMin, schedule }: Props) {
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<Schedule>(schedule);

  return (
    <div className="rounded-xl border border-slate-700 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
      >
        <span>時刻表を見る</span>
        <span className="text-slate-500 text-xs">{open ? '▲ 閉じる' : '▼ 開く'}</span>
      </button>

      {open && (
        <div className="bg-slate-900">
          <div className="flex border-b border-slate-700">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setViewing(key)}
                className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                  viewing === key
                    ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {label}
                {key === schedule && (
                  <span className="ml-1 text-xs text-teal-400">●</span>
                )}
              </button>
            ))}
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {routes.map((route) => {
                const times = route.times[viewing];
                const nextIdx = viewing === schedule
                  ? times.findIndex((t) => t >= currentMin)
                  : -1;
                return (
                  <div key={route.id}>
                    <div className="text-xs font-semibold text-slate-400 mb-2 leading-snug">
                      {route.platform}<br />
                      <span className="text-slate-500">{route.label}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {times.map((t, i) => {
                        const isPast = viewing === schedule && t < currentMin;
                        const isNext = i === nextIdx;
                        return (
                          <span
                            key={t}
                            className={`tabular-nums text-sm px-2 py-0.5 rounded font-mono ${
                              isNext
                                ? 'bg-amber-400 text-slate-900 font-bold'
                                : isPast
                                ? 'text-slate-700'
                                : 'text-slate-400'
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
          </div>
        </div>
      )}
    </div>
  );
}
