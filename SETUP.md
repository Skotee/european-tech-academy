# Jak zmienić coś na stronie przez agenta (Claude Code)

Ta strona wdraża się sama: **push na `main` = zmiana widoczna na żywo w ~35 sekund.**
Nie trzeba nic budować ani wdrażać ręcznie — agent robi to za Ciebie. Wystarczy dać mu
dostęp do repozytorium.

---

## Jednorazowe przygotowanie na nowym komputerze

**1. Dostęp do repo.** Poproś właściciela repo (`Skotee`) o zaproszenie Twojego konta
GitHub jako współpracownika z prawem zapisu:
*github.com/Skotee/european-tech-academy → Settings → Collaborators → Add people*.
Przyjmij zaproszenie na mailu powiązanym z tym kontem.

**2. Jeśli ten komputer był już używany z innym kontem GitHub**, wyczyść zapamiętane
logowanie, inaczej Git będzie się upierał przy starym koncie:

```bash
git credential-manager erase
```

**3. Sklonuj repozytorium** (albo poproś agenta, żeby to zrobił):

```bash
git clone https://github.com/Skotee/european-tech-academy.git
```

To wszystko. Nie instalujesz Node, nie logujesz się do Cloudflare, nie odpalasz builda —
to robi agent w kolejnym kroku.

---

## Codzienna praca: proś agenta, nie edytuj sam

Otwórz Claude Code w folderze repozytorium i **opisz, co ma się zmienić** — tak samo jak
w rozmowie, w której powstała ta strona. Przykłady:

> Zmień kolor przycisku "Zapisz się" na zielony.

> Dodaj do listy kursów nowy kurs "Spawacz MAG" z krótkim opisem.

> Popraw literówkę w sekcji "O nas" — jest "kwalifikacj", ma być "kwalifikacje".

Agent sam:
1. znajdzie właściwy plik,
2. wprowadzi zmianę,
3. zrobi `git commit` i `git push`.

Po pushu Cloudflare buduje i wdraża stronę automatycznie — **żadnego dodatkowego kroku
po Twojej stronie.**

## Jak zobaczyć efekt

**https://eta-www.europeantechacademy.workers.dev** — odśwież po ~35 sekundach od pushu.

Poproś agenta „sprawdź, czy zmiana już jest widoczna na żywo" — potrafi to zweryfikować
sam, bez Twojego udziału.

---

## Uwaga

**Każda taka prośba publikuje zmianę na żywej stronie od razu** — nie ma etapu
zatwierdzania. Jeśli chcesz coś przetestować bez ryzyka, powiedz agentowi
„zrób to na osobnej gałęzi, nie na main" — dostanie własny adres podglądowy, a strona
główna zostanie nietknięta.

Więcej o samym projekcie: [README.md](README.md).
