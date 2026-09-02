# Wdrożenie na nowym komputerze

Instrukcja uruchomienia projektu na drugiej maszynie, z innego konta GitHub.

Najważniejsza rzecz na start: **do normalnej pracy nie potrzebujesz logowania
do Cloudflare.** Wdrożenia robi Cloudflare sam po pushu na `main` (Workers Builds).
Logowanie do Cloudflare jest opcjonalne i przydaje się tylko do diagnostyki oraz
ręcznego wdrożenia awaryjnego — opisane w kroku 5.

---

## 1. Czego potrzebujesz

| | Wersja / uwagi |
| --- | --- |
| Node.js | **22 LTS** — tyle samo, co używa Cloudflare (plik `.node-version`). Nowsze też zadziała |
| npm | dołączony do Node |
| Git | dowolna aktualna wersja |
| Konto GitHub | musi mieć **prawo zapisu** do repozytorium — patrz krok 2 |
| Konto Cloudflare | tylko jeśli chcesz wdrażać ręcznie (krok 5) |

Sprawdzenie po instalacji:

```bash
node -v    # powinno pokazać v22.x lub nowsze
npm -v
git --version
```

---

## 2. Dostęp do repozytorium z nowego konta

Repozytorium **https://github.com/Skotee/european-tech-academy** jest publiczne,
więc sklonujesz je bez żadnego logowania. Ale żeby **wypychać zmiany**, nowe konto
musi mieć prawo zapisu.

Właściciel repo (`Skotee`) musi je nadać:
*Settings → Collaborators and teams → Add people* → nazwa nowego konta →
uprawnienie **Write**. Zaproszenie trzeba potem przyjąć z nowego konta.

Bez tego `git push` zwróci błąd 403 — klonowanie i praca lokalna będą działać,
publikacja nie.

### Jeśli komputer był już używany z innym kontem GitHub

To najczęstsza pułapka. Windows zapamiętuje poświadczenia i Git będzie się
uparcie logował **starym** kontem. Wyczyść je przed pierwszym pushem:

```bash
git credential-manager erase
```

Albo ręcznie: *Panel sterowania → Menedżer poświadczeń → Poświadczenia systemu
Windows* → usuń wpisy `git:https://github.com`.

Przy pierwszym pushu otworzy się przeglądarka — zaloguj się **nowym** kontem.

### Ustaw tożsamość commitów

Inaczej Twoje commity będą podpisane cudzym nazwiskiem:

```bash
git config user.name "Imię Nazwisko"
git config user.email "adres@z-konta-github"
```

Bez `--global`, więc ustawienie dotyczy tylko tego repozytorium — reszta pracy
na tym komputerze zostaje nietknięta.

---

## 3. Klon i instalacja

```bash
git clone https://github.com/Skotee/european-tech-academy.git
cd european-tech-academy
npm ci
```

Używaj `npm ci`, nie `npm install` — instaluje dokładnie wersje z
`package-lock.json`, czyli to samo, co buduje Cloudflare.

---

## 4. Uruchomienie lokalne

```bash
npm run dev      # http://127.0.0.1:4321 — z podglądem zmian na żywo
npm run build    # build produkcyjny do dist/
npm run preview  # podgląd zbudowanej wersji
```

Jeśli `npm run dev` działa i widzisz stronę — środowisko jest gotowe.

---

## 5. Logowanie do Cloudflare (opcjonalne)

Potrzebne tylko do ręcznego wdrożenia i diagnostyki. Wymaga dostępu do konta
**europeantechacademy@gmail.com**.

```bash
npx wrangler login
```

Otworzy przeglądarkę i poprosi o zgodę. Jeśli przeglądarka nie może dosięgnąć
`localhost:8976` (zdalny pulpit, kontener), użyj wariantu z kodem:

```bash
npx wrangler login --device --browser false
```

Wypisze adres i kod do wpisania — kod jest ważny 5 minut.

Weryfikacja:

```bash
npx wrangler whoami
```

Powinno pokazać konto `europeantechacademy@gmail.com` i account ID
`b8da311aed43186d11de1c0e1c6d2a77`.

Token trafia do profilu użytkownika (`%APPDATA%\xdg.config\.wrangler`), **nie**
do repozytorium — nie ma ryzyka, że wycieknie w commicie.

---

## 6. Codzienna praca

```bash
# 1. zawsze zacznij od pobrania zmian
git pull

# 2. pracuj, sprawdzaj na bieżąco
npm run dev

# 3. opublikuj
git add -A
git commit -m "opis zmiany"
git push
```

**Push na `main` publikuje stronę.** Cloudflare wykrywa push, buduje projekt
i wdraża go na 100% ruchu — całość zajmuje około 35 sekund. Nie ma żadnego
dodatkowego kroku.

Adres: **https://eta-www.europeantechacademy.workers.dev**

### Praca na gałęzi

Buildy dla gałęzi nieprodukcyjnych są włączone, więc push na własną gałąź
zbuduje wersję podglądową bez ruszania strony głównej:

```bash
git switch -c moja-zmiana
git push -u origin moja-zmiana
```

To bezpieczniejszy sposób pracy, jeśli nie jesteś pewien zmiany.

---

## 7. Jak sprawdzić, czy wdrożenie doszło

W panelu Cloudflare: Worker `eta-www` → *Deployments*.

Z terminala (wymaga logowania z kroku 5):

```bash
npx wrangler deployments list --name eta-www
```

Patrz na wiersz `Version(s): (100%) ...` — to wersja, która faktycznie obsługuje
ruch. Sama obecność nowej wersji w `wrangler versions list` **nie** znaczy, że
jest wdrożona.

### Sprawdzenie samej strony

Na Windowsie `curl` **nie zadziała** z adresami `*.workers.dev` — biblioteka
schannel zwróci `SEC_E_ILLEGAL_MESSAGE`. To ograniczenie klienta, nie strony.
Użyj przeglądarki albo Node:

```bash
node -e "fetch('https://eta-www.europeantechacademy.workers.dev/').then(r=>console.log(r.status, r.headers.get('x-robots-tag')))"
```

---

## 8. Pułapki

**Każdy push na `main` publikuje.** Nie ma etapu zatwierdzania. Jeśli nie jesteś
gotów pokazać zmiany światu, pracuj na osobnej gałęzi.

**Nie usuwaj `public/_headers`** dopóki strona nie startuje oficjalnie. Ten plik
nadaje wszystkim adresom nagłówek `X-Robots-Tag: noindex, nofollow`, dzięki czemu
prototyp nie trafia do Google i nie konkuruje z prawdziwą stroną
`europeantechacademy.com`.

**Nie dodawaj `pages_build_output_dir` do `wrangler.jsonc`.** To pole z Cloudflare
Pages, a projekt jest Workerem — psuje konfigurację.

**Nie zmieniaj `name` w `wrangler.jsonc`.** Musi zostać `eta-www`, bo tak nazywa się
Worker w Cloudflare. Zmiana utworzy drugi, osobny Worker.

**Nie commituj `dist/`, `node_modules/` ani `.env`** — są w `.gitignore`, ale warto
wiedzieć dlaczego: `dist/` buduje Cloudflare u siebie z kodu źródłowego.

---

## 9. Jeśli coś nie działa

| Objaw | Przyczyna |
| --- | --- |
| `git push` → 403 | nowe konto nie ma prawa zapisu (krok 2) |
| `git push` idzie starym kontem | zapamiętane poświadczenia — `git credential-manager erase` |
| push przechodzi, ale strona się nie zmienia | sprawdź *Deployments* w panelu; jeśli buildu nie ma wcale, aplikacja GitHub Cloudflare straciła dostęp do repo (*github.com/settings/installations* → Cloudflare → *Repository access* musi zawierać `european-tech-academy`) |
| build pada na Cloudflare, lokalnie działa | najczęściej różnica wersji Node — użyj 22, jak `.node-version` |
| `curl` nie łączy się z `*.workers.dev` | ograniczenie schannel na Windows, użyj Node lub przeglądarki |
| `wrangler` mówi „not authenticated" | wykonaj krok 5 |

---

## 10. Czego tu celowo nie ma

Żadnych tokenów, sekretów, workflow GitHub Actions ani hooków gita. Cała
konfiguracja wdrożenia to `wrangler.jsonc` w repo plus ustawienia Workers Builds
w panelu Cloudflare. Nowa maszyna nie wymaga więc żadnej konfiguracji sekretów —
wystarczy dostęp do repo.

Więcej o architekturze i o planowanym przełączeniu domeny: [README.md](README.md).
