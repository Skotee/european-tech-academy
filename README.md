# European Tech Academy — frontend

Nowy frontend dla `europeantechacademy.com`. Statyczna strona: **Astro + Tailwind CSS 4**,
docelowo hostowana na **Cloudflare Pages**.

Zastępuje obecną stronę na Zoho Sites 2.0 (zamknięty kreator, brak dostępu do szablonów).

## Uruchomienie lokalnie

```bash
npm install
npm run dev      # http://127.0.0.1:4321
npm run build    # -> dist/
npm run preview  # podglad builda produkcyjnego
```

## Struktura

```
src/
  styles/global.css     design system: tokeny kolorow, typografia, tryb ciemny
  layouts/Base.astro    <head>, SEO, font, motyw, reveal-on-scroll
  components/           Header, Hero, Pillars, Courses, CourseCard,
                        Process, CtaBand, Footer, SectionHeading
  data/courses.ts       katalog kursow (jedno zrodlo prawdy)
  pages/index.astro     strona glowna
public/logo-eta.png     logo przeniesione z obecnej strony
```

### Design system

Kolory marki wyciagnieto z obecnej strony: `#163f9f` (granat), `#1c4fc8`, `#009efb` (cyan).
Wszystko siedzi w `@theme` w `src/styles/global.css` — zmiana palety to zmiana w jednym miejscu.

Tokeny semantyczne (`--surface`, `--text-strong`, `--border-subtle`...) maja warianty dla
motywu jasnego i ciemnego. Motyw ustawia sie na `<html data-theme>` skryptem inline
w `Base.astro` (przed pierwszym paintem, zeby nie migalo), z zapisem w `localStorage`.

## Deploy na Cloudflare (Workers Static Assets)

Build i deploy robi **Cloudflare** po kazdym pushu do repozytorium
https://github.com/Skotee/european-tech-academy (Worker: `eta-www`).

Strona jest w calosci statyczna, wiec nie ma zadnego kodu Workera — Cloudflare serwuje
wylacznie pliki z `dist/` (Workers Static Assets). Konfiguracja jest w `wrangler.jsonc`,
czyli w repo, a nie tylko w panelu.

W repo nie ma workflow, hooka ani tokenu. W kreatorze Cloudflare (*Workers & Pages* >
*Create* > *Connect to Git*) ustawiamy tylko:

| Pole w kreatorze | Wartosc |
| --- | --- |
| Project name | `eta-www` (musi zgadzac sie z `name` w `wrangler.jsonc`) |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` (domyslne) |
| Wersja Node | z pliku `.node-version` (22) |

Katalogu wyjsciowego **nie** podaje sie w kreatorze — bierze go `wrangler.jsonc`
z pola `assets.directory`.

Prototyp jest chroniony przed indeksowaniem plikiem `public/_headers` (Workers Static
Assets go obsluguje), ktory nadaje
**kazdemu** adresowi naglowek `X-Robots-Tag: noindex, nofollow`. Dziala to niezaleznie
od tego, ktora galaz jest produkcyjna, wiec Google nie zaindeksuje prototypu i nie
zacznie on konkurowac z prawdziwa strona.

**W dniu uruchomienia strony produkcyjnej trzeba usunac `public/_headers`.**

Adres produkcyjny to `https://eta-www.<subdomena-konta>.workers.dev` — dokladny
zobaczysz w panelu po pierwszym wdrozeniu. Gałęzie inne niz `main` dostaja wlasne
adresy podgladowe (opcja *Builds for non-production branches* w kreatorze).

Kazda galaz i kazdy pull request dostaje wlasny adres podgladowy, a poprzednie
wersje mozna przywrocic z panelu Cloudflare (*Deployments* > *Rollback*).

### Czego tu celowo nie ma

Build i deploy naleza do Cloudflare, wiec z repo usunieto konkurencyjne mechanizmy
(kazda zmiana wdrazala sie wczesniej dwukrotnie):

- `.github/workflows/deploy.yml` (GitHub Actions budowal i wypychal recznie),
- `.githooks/post-commit` (wdrazal po kazdym lokalnym commicie),
- skrypty `npm run deploy` i `npm run deploy:prod`.

Sekret `CLOUDFLARE_API_TOKEN` w ustawieniach repo jest juz zbedny — mozna go odwolac.

### Uwaga o TLS na Windows

`curl` z Windows (schannel) nie potrafi zestawic sesji TLS z `*.pages.dev`
(`SEC_E_ILLEGAL_MESSAGE`). To ograniczenie klienta, nie strony — przegladarka
i `fetch` w Node dzialaja normalnie. Do weryfikacji z terminala uzywaj Node, nie curla.


## Przelaczenie domeny — jeszcze NIE zrobione

Domena `europeantechacademy.com` stoi na nameserwerach Zoho
(`ns11.zns-53.com`, `ns21.zns-53.net`, `ns31.zns-53.com`, `ns41.zns-53.net`),
a konto Cloudflare ma **0 stref**. Zeby przelaczyc, trzeba bedzie:

1. Dodac strefe `europeantechacademy.com` w Cloudflare,
2. **przepisac wszystkie obecne rekordy z Zoho — w tym MX poczty**, inaczej padnie
   firmowa skrzynka,
3. zmienic nameserwery u rejestratora,
4. podpiac domene do projektu Pages.

Kolejnosc jest istotna: rekordy przed zmiana NS.

## Status

- [x] Design system + tryb ciemny
- [x] Strona glowna (prototyp do oceny) — https://eta-www.pages.dev
- [ ] Podstrony: kursy, o-nas, kontakt, rejestracja, kariera, faq, galeria, regulaminy
- [ ] Blog `/aktualnosci` (Astro Content Collections)
- [ ] Wersje jezykowe: `/en`, `/ua`, `/de`
- [ ] Formularz rejestracji (integracja z Zoho Forms / CRM)
- [x] Build i deploy po stronie Cloudflare (Connect to Git)
- [ ] Usunac public/_headers (noindex) w dniu uruchomienia
- [ ] Przelaczenie DNS z Zoho na Cloudflare
