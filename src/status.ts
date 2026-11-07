// Visible status and error messages, shown over the map (#status in index.html).

function statusEl(): HTMLElement | null {
  return document.getElementById('status');
}

export function clearStatus(): void {
  statusEl()?.replaceChildren();
}

/** Shows a message box. `onRetry` adds a Retry button. Uses role="alert" for failures. */
export function showStatus(opts: {
  title: string;
  detail?: string;
  isError?: boolean;
  onRetry?: () => void;
}): void {
  const host = statusEl();
  if (!host) return;

  const box = document.createElement('div');
  box.className = 'status__message';
  if (opts.isError) box.setAttribute('role', 'alert');

  const title = document.createElement('strong');
  title.textContent = opts.title;
  box.append(title);

  if (opts.detail) {
    const detail = document.createElement('p');
    detail.className = 'status__detail';
    detail.textContent = opts.detail;
    box.append(detail);
  }

  if (opts.onRetry) {
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'btn';
    retry.textContent = 'Try again';
    retry.addEventListener('click', opts.onRetry);
    box.append(retry);
  }

  host.replaceChildren(box);
}
