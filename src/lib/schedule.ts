import type { Route } from '../data/timetable';

export type NextBus = {
  departureMin: number;
  arrivalMin: number;
  waitMin: number;
};

export type RouteStatus = {
  route: Route;
  next: NextBus | null;
  following: NextBus | null;
};

function nowInMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function toNextBus(departureMin: number, currentMin: number, duration: number): NextBus {
  return {
    departureMin,
    arrivalMin: departureMin + duration,
    waitMin: departureMin - currentMin,
  };
}

export function getRouteStatus(route: Route, currentMin?: number): RouteStatus {
  const now = currentMin ?? nowInMinutes();
  const upcoming = route.times.filter((t) => t >= now);

  return {
    route,
    next: upcoming[0] != null ? toNextBus(upcoming[0], now, route.duration) : null,
    following: upcoming[1] != null ? toNextBus(upcoming[1], now, route.duration) : null,
  };
}

export function formatTime(totalMin: number): string {
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function getRecommendedRoute(statuses: RouteStatus[]): '01' | '02' | null {
  const [a, b] = statuses;
  if (!a.next && !b.next) return null;
  if (!a.next) return b.route.id;
  if (!b.next) return a.route.id;
  if (a.next.arrivalMin <= b.next.arrivalMin) return a.route.id;
  return b.route.id;
}
