// Line geometry for paths: a gentle curve through the waypoints, the length along it, and the
// part of it drawn so far. Positions are [lng, lat]; lengths are in planar degrees (longitude
// scaled by cos latitude), which is accurate enough to pace a drawing.

export type Pos = [number, number];

const BEND = 0.14;
const SAMPLES = 24;

/** A curve through `points`: each leg bows sideways by a share of its length, alternating sides. */
export function curveThrough(points: readonly Pos[], samples: number = SAMPLES): Pos[] {
  const out: Pos[] = [];
  points.slice(1).forEach((end, leg) => {
    const start = points[leg];
    if (!start) return;
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const side = leg % 2 === 0 ? 1 : -1;
    const control: Pos = [(start[0] + end[0]) / 2 - dy * BEND * side, (start[1] + end[1]) / 2 + dx * BEND * side];
    for (let i = leg === 0 ? 0 : 1; i <= samples; i += 1) {
      const t = i / samples;
      const a = (1 - t) * (1 - t);
      const b = 2 * (1 - t) * t;
      const c = t * t;
      out.push([a * start[0] + b * control[0] + c * end[0], a * start[1] + b * control[1] + c * end[1]]);
    }
  });
  return out;
}

const step = (a: Pos, b: Pos): number => Math.hypot((b[0] - a[0]) * Math.cos(((a[1] + b[1]) / 2) * (Math.PI / 180)), b[1] - a[1]);

/** Length from the first point to each point (cumulative), starting with 0. */
export function cumulative(line: readonly Pos[]): number[] {
  const out = [0];
  for (let i = 1; i < line.length; i += 1) {
    const a = line[i - 1];
    const b = line[i];
    out.push((out[i - 1] ?? 0) + (a && b ? step(a, b) : 0));
  }
  return out;
}

/** The line drawn up to `progress` (0-1 of its length), and the point at its leading end. */
export function partial(line: readonly Pos[], cum: readonly number[], progress: number): { coords: Pos[]; head: Pos | null } {
  const first = line[0];
  if (!first) return { coords: [], head: null };
  const total = cum[cum.length - 1] ?? 0;
  const p = Math.min(1, Math.max(0, progress));
  if (p <= 0 || total === 0) return { coords: [], head: first };
  if (p >= 1) return { coords: [...line], head: line[line.length - 1] ?? first };
  const target = total * p;
  let i = 1;
  while (i < line.length - 1 && (cum[i] ?? 0) < target) i += 1;
  const a = line[i - 1] ?? first;
  const b = line[i] ?? a;
  const span = (cum[i] ?? 0) - (cum[i - 1] ?? 0);
  const t = span === 0 ? 0 : (target - (cum[i - 1] ?? 0)) / span;
  const head: Pos = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  return { coords: [...line.slice(0, i), head], head };
}

/** How far along the line (0-1) each waypoint sits, matching each to its nearest point in order. */
export function waypointFractions(waypoints: readonly Pos[], line: readonly Pos[], cum: readonly number[]): number[] {
  const total = cum[cum.length - 1] ?? 0;
  let from = 0;
  return waypoints.map((w, n) => {
    if (n === 0) return 0;
    if (n === waypoints.length - 1) return 1;
    let best = from;
    let bestDistance = Infinity;
    for (let i = from; i < line.length; i += 1) {
      const point = line[i];
      const d = point ? step(point, w) : Infinity;
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    }
    from = best;
    return total === 0 ? 0 : (cum[best] ?? 0) / total;
  });
}
