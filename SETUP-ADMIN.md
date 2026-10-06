# Login & Posten über die Website einrichten

Deine Seite ist statisch (GitHub Pages). Damit du dich auf der Seite einloggen und
Posts schreiben kannst, braucht es einen winzigen Login-Dienst, der sicher mit GitHub
spricht. Den richtest du **einmal** ein — danach läuft alles über `…/admin/`.

Ergebnis danach:
- Du gehst auf **/admin/** deiner Seite
- Klickst **„Login with GitHub"**
- Schreibst einen Post im Formular → **Publish**
- Der Post wird automatisch ins Repo gespeichert und erscheint nach ~1 Minute auf der Seite

---

## Schritt 0 — GitHub Pages + Domain nyamdorj.ch

Du hast bereits eine **CNAME-Datei mit `nyamdorj.ch`** angelegt — die Domain ist also
gewünscht. Damit sie funktioniert:

1. Repo → **Settings → Pages** → *Source*: **Deploy from a branch**, Branch **main**,
   Ordner **/ (root)**. Unter *Custom domain* sollte `nyamdorj.ch` stehen.
2. **DNS bei deinem Domain-Anbieter** setzen, damit nyamdorj.ch auf GitHub Pages zeigt:
   - **A-Records** für `nyamdorj.ch` (Apex) auf:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **AAAA-Records** (optional, IPv6):
     `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - Optional `www` als **CNAME** auf `narandavaanyamdorj-hslu.github.io`
3. In den Pages-Einstellungen **„Enforce HTTPS"** aktivieren (sobald verfügbar).
4. Danach ist die Seite live unter: **https://nyamdorj.ch/**
   (bis DNS greift, ggf. die Fallback-URL
   `https://narandavaanyamdorj-hslu.github.io/nyamdorj.ch/`)

---

## Schritt 1 — GitHub OAuth App erstellen

1. Gehe zu **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
   (direkt: https://github.com/settings/developers)
2. Ausfüllen:
   - **Application name:** `Davka CMS`
   - **Homepage URL:** `https://nyamdorj.ch/`
   - **Authorization callback URL:** vorerst `https://example.com/callback`
     (ändern wir in Schritt 3, sobald wir die Worker-URL kennen)
3. **Register application**
4. Notiere dir die **Client ID**. Klicke **Generate a new client secret** und
   notiere auch das **Client Secret** (wird nur einmal angezeigt).

---

## Schritt 2 — Login-Dienst deployen (Cloudflare Worker, gratis)

Das ist der fertige Open-Source-Dienst `sveltia-cms-auth` von Sveltia.

**Einfachster Weg (1-Klick):**
1. Erstelle einen kostenlosen Cloudflare-Account: https://dash.cloudflare.com/sign-up
2. Öffne https://github.com/sveltia/sveltia-cms-auth und klicke im README auf
   **„Deploy to Cloudflare Workers"** und folge dem Assistenten.
3. Setze im Worker diese **Environment Variables / Secrets**:
   - `GITHUB_CLIENT_ID` = deine Client ID aus Schritt 1
   - `GITHUB_CLIENT_SECRET` = dein Client Secret aus Schritt 1
   - `ALLOWED_DOMAINS` = `narandavaanyamdorj-hslu.github.io,nyamdorj.ch`
4. Nach dem Deploy bekommst du eine **Worker-URL**, z. B.
   `https://sveltia-cms-auth.deinname.workers.dev` — **notieren!**

---

## Schritt 3 — Alles verdrahten

1. **GitHub OAuth App** (aus Schritt 1) → Callback-URL ändern auf:
   `https://sveltia-cms-auth.deinname.workers.dev/callback`
   (deine Worker-URL + `/callback`)
2. In diesem Repo die Datei **`admin/config.yml`** öffnen und bei `base_url`
   deine Worker-URL eintragen (ohne `/` am Ende):
   ```yaml
   base_url: https://sveltia-cms-auth.deinname.workers.dev
   ```
   Speichern & committen (direkt auf GitHub möglich: Datei öffnen → Stift → Commit).

---

## Schritt 4 — Fertig, einloggen

Öffne: **https://nyamdorj.ch/admin/**
→ **Login with GitHub** → neuen Post schreiben → **Publish**.

---

### Hinweis zu den Domains
`ALLOWED_DOMAINS` enthält sowohl `nyamdorj.ch` als auch die GitHub-Fallback-Domain,
damit der Login in beiden Fällen funktioniert — auch solange das DNS für nyamdorj.ch
noch nicht vollständig greift.
