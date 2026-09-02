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

## Deploy na Cloudflare Pages

Build i deploy robi **Cloudflare** po kazdym pushu do repozytorium
https://github.com/Skotee/european-tech-academy (projekt Pages: `eta-www`).

W repo nie ma zadnej konfiguracji deployu — zadnego workflow, hooka ani tokenu.
Cala konfiguracja siedzi w panelu Cloudflare:

| Ustawienie | Wartosc |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Production branch | `main` |
| Wersja Node | z pliku `.node-version` (22) |

Prototyp jest chroniony przed indeksowaniem plikiem `public/_headers`, ktory nadaje
**kazdemu** adresowi naglowek `X-Robots-Tag: noindex, nofollow`. Dziala to niezaleznie
od tego, ktora galaz jest produkcyjna, wiec Google nie zaindeksuje prototypu i nie
zacznie on konkurowac z prawdziwa strona.

**W dniu uruchomienia strony produkcyjnej trzeba usunac `public/_headers`.**

| Cel | Jak | Adres |
| --- | --- | --- |
| Aktualny stan pracy | `git push` na `main` | https://eta-www.pages.dev |
| Podglad galezi / PR | push na dowolna inna galaz | https://<galaz>.eta-www.pages.dev |

Kazda galaz i kazdy pull request dostaje wlasny adres podgladowy, a poprzednie
wersje mozna przywrocic z panelu Cloudflare (*Deployments* > *Rollback*).

### Czego tu celowo nie ma

`wrangler pages deploy` **nie zadziala** na projekcie polaczonym z Gitem — Cloudflare
blokuje bezposredni upload do takiego projektu. Dlatego usunieto:

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
