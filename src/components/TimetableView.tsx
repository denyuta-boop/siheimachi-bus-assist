import { useState } from 'react';
import { routes } from '../data/timetable';
import { formatTime } from '../lib/schedule';

type Props = {
  currentMin: number;
};

export function TimetableView({ currentMin }: Props) {
  const [open, setOpen] = useState(false);

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
        <div className="bg-slate-900 p-4">
          <div className="grid grid-cols-2 gap-4">
            {routes.map((route) => {
              const nextIdx = route.times.findIndex((t) => t >= currentMin);
              return (
                <div key={route.id}>
                  <div className="text-xs font-semibold text-slate-400 mb-2 leading-snug">
                    {route.platform}<br />
                    <span className="text-slate-500">{route.label}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {route.times.map((t, i) => {
                      const isPast = t < currentMin;
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
      )}
    </div>
  );
}
