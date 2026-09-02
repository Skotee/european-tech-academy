# European Tech Academy — frontend

Nowy frontend dla `europeantechacademy.com`. Statyczna strona: **Astro + Tailwind CSS 4**,
hostowana jako Worker ze statycznymi assetami na **Cloudflare**.

Zastępuje obecną stronę na Zoho Sites 2.0 (zamknięty kreator, brak dostępu do szablonów).

**Nowy komputer / nowe konto GitHub?** Zacznij od [SETUP.md](SETUP.md) — krok po kroku,
z pułapkami, na które już się natknęliśmy.

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

Strona dziala jako **Worker ze statycznymi assetami** — nie ma zadnego kodu Workera
("main" w konfiguracji), Cloudflare serwuje wylacznie pliki z `dist/`.

Konfiguracja jest w repo, w `wrangler.jsonc`: nazwa `eta-www`, `assets.directory`
wskazuje `./dist`, wlaczona obserwowalnosc.

| Cel | Adres |
| --- | --- |
| Produkcja | https://eta-www.europeantechacademy.workers.dev |

### Wdrozenie reczne

```bash
npm run build
npx wrangler deploy            # wdraza
npx wrangler deploy --dry-run  # tylko walidacja, bez wysylki
```

### Wdrozenie automatyczne po pushu

Dziala przez **Workers Builds** — push na `main` uruchamia build i wdrozenie.
Konfiguracja w panelu (Worker `eta-www` > *Settings* > *Build*):

| Pole | Wartosc |
| --- | --- |
| Branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

Wazne: aplikacja GitHub Cloudflare musi miec dostep do tego repozytorium
(*github.com/settings/installations*), inaczej webhooki nie beda dostarczane —
build recznie z API zadziala, a automatyczny nie powstanie wcale.

### Ograniczenie, ktore z tego wynika

Workers wymagaja **aktywnej strefy DNS w Cloudflare** do jakiejkolwiek domeny wlasnej
(zarowno Custom Domains, jak i Routes) — nie obsluguja zewnetrznego DNS. Poniewaz
`europeantechacademy.com` stoi dzis na nameserwerach Zoho, **nie da sie wystawic
strony pod wlasna domena (nawet pod subdomena) przed przeniesieniem strefy**
do Cloudflare. Szczegoly nizej.


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
- [x] Strona glowna (prototyp do oceny) — https://eta-www.europeantechacademy.workers.dev
- [ ] Podstrony: kursy, o-nas, kontakt, rejestracja, kariera, faq, galeria, regulaminy
- [ ] Blog `/aktualnosci` (Astro Content Collections)
- [ ] Wersje jezykowe: `/en`, `/ua`, `/de`
- [ ] Formularz rejestracji (integracja z Zoho Forms / CRM)
- [x] Build i deploy po stronie Cloudflare (Connect to Git)
- [ ] Usunac public/_headers (noindex) w dniu uruchomienia
- [x] Podlaczenie Workers Builds (automatyczny deploy po pushu)
- [ ] Usuniecie starego projektu Pages eta-www
- [ ] Przeniesienie strefy DNS z Zoho do Cloudflare (wymagane dla domeny wlasnej)
