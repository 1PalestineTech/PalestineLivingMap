# Connecting the map to the Discord channel (for the programmer)

The map has three places that talk to people: **Report a mistake** (on every card), **Add a missing village** (About panel) and **Join the discussion** (About panel, optional).
None of them needs a server to work, but sending reports straight into the Discord channel does. Pick one of the three set-ups below. All settings are build-time
environment variables, set when running `npm run build` (or in the host's build settings).

## What the owner must give the programmer

1. The **Discord invite link** to the server or channel (for the "Join the discussion" button): `VITE_DISCORD_URL=https://discord.gg/...`
2. Which of the set-ups below to use, and for set-up C, a **Discord webhook** for the feedback channel (Channel settings > Integrations > Webhooks > New webhook > Copy URL).
   **The webhook URL is a secret.** Anyone who has it can post to the channel. It must stay on the server (set-up C) and never go into the map's build settings or code.
3. The **public address** of the map, ending in a slash, for the share preview: `VITE_SITE_URL=https://example.org/map/`.

## Set-up A: nothing to build (simplest)

`VITE_FEEDBACK_URL=https://discord.com/channels/<server-id>/<channel-id>` (the link of the feedback channel).
A reader presses Report a mistake: the report text is copied and the channel opens in a new tab; the reader pastes it and fills in the last lines. No server, but one more step for the reader.

## Set-up B: e-mail

`VITE_FEEDBACK_URL=mailto:feedback@example.org` opens the reader's mail app with the report filled in. A form service can also be used: any `https://` link works, and `{subject}` and `{text}` in the link are replaced with the report
(for example a pre-filled Google Form link).

## Set-up C: straight into the channel (recommended, needs a small function)

Reports are sent in the background to a small function that forwards them to the Discord webhook. The reader sees "Thank you: your report was sent", with no copy and paste.

1. Create a function on any host that runs small functions (Cloudflare Workers, Netlify, Vercel...). Store the webhook as a secret named `DISCORD_WEBHOOK_URL` and the map's address (for example `https://example.org`) as `ALLOWED_ORIGIN`.
2. Use this code (Cloudflare Worker style; other hosts need the same logic):

```js
export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST' || request.headers.get('Origin') !== env.ALLOWED_ORIGIN) {
      return new Response('Not allowed', { status: 403, headers: cors });
    }
    const { subject, text } = await request.json();
    const content = `**${String(subject).slice(0, 200)}**\n${String(text).slice(0, 1500)}`;
    await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, allowed_mentions: { parse: [] } }), // no @everyone or @role pings from reports
    });
    return new Response('ok', { headers: cors });
  },
};
```

3. Set `VITE_FEEDBACK_POST_URL=https://<the function's address>` when building the map.
4. Add basic abuse protection on the host (a rate limit per visitor, for example 5 reports a minute). Reports are text only and nothing is stored on the map's side.

If the function is down, the map falls back to copying the report (and opens `VITE_FEEDBACK_URL` if that is set too), so a reader is never left with nothing.

## The report format

Every report reads like this, so moderators can sort them quickly:

```
Map report: <the place or event, or "Missing village: <name>">
Link: <the address of the map exactly as the reader saw it>
What is wrong or missing:
Source link:
```

The link reopens the same year, card, story and layers, so a moderator sees what the reader saw. Suggested channel routine: a moderator checks the source, then the owner or an editor adds it to `public/data/*.json`
(see `docs/DATA_GUIDE.md`) and writes a line in `public/data/whatsnew.json` so the reporter can see what changed.

## Other things for the programmer

- **Embedding:** other sites can frame the map with `?embed=1` (copy the code from About > Copy embed code). The host must not send `X-Frame-Options: DENY` or a `frame-ancestors` rule that blocks them.
- **Share preview:** Discord and X read the picture at `<site>/preview.png` named in `index.html`; it only works when `VITE_SITE_URL` was set at build time.
- **"What's new":** edit `public/data/whatsnew.json` (newest first); the About button shows a dot until a reader has opened the newest entry.
