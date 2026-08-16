import type { RouteStatus } from '../lib/schedule';
import { formatTime, getRecommendedRoute } from '../lib/schedule';

type Props = {
  status: RouteStatus;
  allStatuses: RouteStatus[];
};

export function BusCard({ status, allStatuses }: Props) {
  const { route, next, following } = status;
  const recommendedId = getRecommendedRoute(allStatuses);
  const isRecommended = route.id === recommendedId;

  return (
    <div
      className={`rounded-xl border p-4 ${
        isRecommended
          ? 'border-amber-400 bg-blue-950'
          : 'border-slate-700 bg-slate-800'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-bold text-base text-white">
            {route.label}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {route.platform}・{route.direction}・所要{route.duration}分
          </div>
        </div>
        {isRecommended && (
          <span className="text-xs bg-amber-400 text-slate-900 rounded-full px-2 py-0.5 font-bold">
            おすすめ
          </span>
        )}
      </div>

      {next ? (
        <div className="space-y-2">
          <BusRow label="次発" bus={next} recommended={isRecommended} />
          {following && <BusRow label="次の次" bus={following} recommended={false} />}
        </div>
      ) : (
        <p className="text-sm text-slate-500">本日の運行は終了しました</p>
      )}
    </div>
  );
}

type BusRowProps = {
  label: string;
  bus: { departureMin: number; arrivalMin: number; waitMin: number };
  recommended: boolean;
};

function BusRow({ label, bus, recommended }: BusRowProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
        recommended ? 'bg-teal-700 text-white' : 'bg-slate-700 text-slate-300'
      }`}
    >
      <span className="text-xs w-12 shrink-0 opacity-75">{label}</span>
      <span className="tabular-nums font-bold text-base">
        {formatTime(bus.departureMin)}
      </span>
      <span className="opacity-50 text-xs">発</span>
      <span className="opacity-40 text-xs mx-1">→</span>
      <span className="tabular-nums font-bold text-base">
        {formatTime(bus.arrivalMin)}
      </span>
      <span className="opacity-50 text-xs">着</span>
      <span className="ml-auto text-xs opacity-75">{bus.waitMin}分待ち</span>
    </div>
  );
}
