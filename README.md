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

Skonfigurowane i dzialajace. Konto Cloudflare: `europeantechacademy@gmail.com`,
projekt Pages: **eta-www**.

| Cel | Komenda | Adres |
| --- | --- | --- |
| Prototyp do oceny | `npm run deploy` | https://prototyp.eta-www.pages.dev |
| Produkcja (jeszcze puste) | `npm run deploy:prod` | https://eta-www.pages.dev |

Prototyp leci na galaz `prototyp`, wiec Cloudflare automatycznie dodaje naglowek
`x-robots-tag: noindex` — Google go nie zaindeksuje i nie bedzie konkurowal
z prawdziwa strona w wynikach. Produkcyjnej galezi `main` **nie** ruszamy do momentu
akceptacji calego serwisu.

### Uwaga o TLS na Windows

`curl` z Windows (schannel) nie potrafi zestawic sesji TLS z `*.pages.dev`
(`SEC_E_ILLEGAL_MESSAGE`). To ograniczenie klienta, nie strony — przegladarka
i `fetch` w Node dzialaja normalnie. Do weryfikacji z terminala uzywaj Node, nie curla.

### Automatyczny deploy z GitHuba (docelowy)

Repo zdalne: https://github.com/Skotee/european-tech-academy (galaz `main`).

Workflow `.github/workflows/deploy.yml` po kazdym **pushu na `main`** buduje projekt
w czystym srodowisku i wypycha go na galaz `prototyp`. Reczne wdrozenie na produkcje:
zakladka *Actions* > *Deploy na Cloudflare Pages* > *Run workflow* > zaznacz **produkcja**.

Wymaga **jednego sekretu** w repozytorium
(*Settings > Secrets and variables > Actions*):

| Sekret | Wartosc |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | token z uprawnieniem *Account > Cloudflare Pages > Edit* |

Account ID jest wpisany wprost w workflow — nie jest sekretem.

Uwaga: projekt Pages `eta-www` powstal jako **Direct Upload**, a Cloudflare nie pozwala
przekonwertowac go na projekt polaczony z Gitem. Dlatego build robi GitHub Actions,
a nie Cloudflare. Gdybysmy chcieli buildy po stronie Cloudflare, trzeba zalozyc **nowy**
projekt Pages przez *Connect to Git* — kosztem zmiany adresu `*.pages.dev`.

### Automatyczny deploy po commicie (lokalny)

Repozytorium ma hook `.githooks/post-commit` (wlaczony przez
`git config core.hooksPath .githooks`), ktory po **kazdym commicie** buduje projekt
i wypycha go na galaz `prototyp`.

```bash
git commit -m "zmiana w hero"          # -> build + deploy, ~10 s
git commit -m "wip [skip deploy]"      # -> commit bez deployu
```

Pelne wyjscie builda i deployu ladnie w `deploy.log` (poza gitem). Jesli build albo
deploy padnie, **commit i tak zostaje zapisany** — hook nie blokuje pracy, tylko
wypisuje ostrzezenie.

Wylaczenie na stale: `git config --unset core.hooksPath`.

Ograniczenia tego podejscia:

- dziala **tylko na tej maszynie** (uzywa lokalnie zapisanego tokenu wranglera),
- deployuje stan **katalogu roboczego**, nie dokladnie tresc commita,
- brak logow builda w chmurze i brak podgladow per gałąź.

Hook i workflow GitHub Actions **robia to samo**. Gdy CI zacznie dzialac, wylacz hook,
zeby nie wdrazac dwa razy: `git config --unset core.hooksPath`.

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
- [x] Strona glowna (prototyp do oceny) — https://prototyp.eta-www.pages.dev
- [ ] Podstrony: kursy, o-nas, kontakt, rejestracja, kariera, faq, galeria, regulaminy
- [ ] Blog `/aktualnosci` (Astro Content Collections)
- [ ] Wersje jezykowe: `/en`, `/ua`, `/de`
- [ ] Formularz rejestracji (integracja z Zoho Forms / CRM)
- [x] Deploy na Cloudflare Pages (galaz prototyp)
- [x] Automatyczny deploy po commicie (hook post-commit)
- [ ] Przelaczenie DNS z Zoho na Cloudflare
