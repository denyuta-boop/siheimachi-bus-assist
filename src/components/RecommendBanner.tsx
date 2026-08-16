import type { RouteStatus } from '../lib/schedule';
import { formatTime, getRecommendedRoute } from '../lib/schedule';

type Props = {
  statuses: RouteStatus[];
};

export function RecommendBanner({ statuses }: Props) {
  const recommendedId = getRecommendedRoute(statuses);
  const recommended = statuses.find((s) => s.route.id === recommendedId);

  if (!recommended || !recommended.next) {
    return (
      <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5 text-center text-slate-500">
        本日の運行は終了しました
      </div>
    );
  }

  const { route, next } = recommended;

  return (
    <div className="rounded-2xl bg-blue-600 text-white p-5 shadow-lg">
      <div className="text-xs font-semibold tracking-widest uppercase opacity-80 mb-1">
        おすすめ
      </div>
      <div className="text-2xl font-bold mb-1">{route.label}</div>
      <div className="text-sm opacity-90 mb-3">
        {route.platform}（{route.direction}）
      </div>
      <div className="flex items-end gap-4">
        <div>
          <div className="text-xs opacity-75">発車</div>
          <div className="text-3xl font-bold tabular-nums">
            {formatTime(next.departureMin)}
          </div>
        </div>
        <div className="text-blue-200 text-sm mb-1">→</div>
        <div>
          <div className="text-xs opacity-75">仙台駅着（目安）</div>
          <div className="text-3xl font-bold tabular-nums">
            {formatTime(next.arrivalMin)}
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xs opacity-75">待ち時間</div>
          <div className="text-2xl font-bold">
            {next.waitMin}<span className="text-base ml-0.5">分</span>
          </div>
        </div>
      </div>
    </div>
  );
}
