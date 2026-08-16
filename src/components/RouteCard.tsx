import type { RouteStatus } from '../lib/schedule';
import { formatTime, getRecommendedRoute } from '../lib/schedule';

type Props = {
  status: RouteStatus;
  allStatuses: RouteStatus[];
};

export function RouteCard({ status, allStatuses }: Props) {
  const { route, next, following } = status;
  const recommendedId = getRecommendedRoute(allStatuses);
  const isRecommended = route.id === recommendedId;

  return (
    <div
      className={`rounded-xl border p-4 ${
        isRecommended
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950 dark:border-blue-600'
          : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-bold text-base text-slate-800 dark:text-slate-100">
            {route.label}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {route.platform}・{route.direction}・所要{route.duration}分
          </div>
        </div>
        {isRecommended && (
          <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5 font-semibold">
            おすすめ
          </span>
        )}
      </div>

      {next ? (
        <div className="space-y-2">
          <BusRow label="次発" bus={next} highlight />
          {following && <BusRow label="次の次" bus={following} highlight={false} />}
        </div>
      ) : (
        <p className="text-sm text-slate-400">本日の運行は終了しました</p>
      )}
    </div>
  );
}

type BusRowProps = {
  label: string;
  bus: { departureMin: number; arrivalMin: number; waitMin: number };
  highlight: boolean;
};

function BusRow({ label, bus, highlight }: BusRowProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
        highlight
          ? 'bg-blue-600 text-white'
          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
      }`}
    >
      <span className={`text-xs w-12 shrink-0 ${highlight ? 'opacity-80' : 'opacity-60'}`}>
        {label}
      </span>
      <span className="tabular-nums font-bold text-base">
        {formatTime(bus.departureMin)}
      </span>
      <span className={`${highlight ? 'opacity-60' : 'opacity-40'} text-xs`}>発</span>
      <span className={`${highlight ? 'opacity-60' : 'opacity-40'} text-xs mx-1`}>→</span>
      <span className="tabular-nums font-bold text-base">
        {formatTime(bus.arrivalMin)}
      </span>
      <span className={`${highlight ? 'opacity-60' : 'opacity-40'} text-xs`}>着</span>
      <span className={`ml-auto text-xs ${highlight ? 'opacity-80' : 'opacity-60'}`}>
        {bus.waitMin}分待ち
      </span>
    </div>
  );
}
