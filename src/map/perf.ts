// Light mode: a cheaper drawing for phones and weak computers. It draws at a pixel ratio of 1, skips the sea ships, the
// finest grid of hill marks and the farmland and grove patterns, and does not fade labels. Chosen automatically on a narrow
// screen or a device reporting four processor threads or fewer; ?lite=1 forces it on and ?lite=0 forces it off.

export function isLight(): boolean {
  const asked = new URLSearchParams(window.location.search).get('lite');
  if (asked === '1') return true;
  if (asked === '0') return false;
  return window.matchMedia('(max-width: 599px)').matches || (navigator.hardwareConcurrency || 8) <= 4;
}
