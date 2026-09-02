export type Course = {
  id: string;
  title: string;
  category: "Elektryka" | "Operatorzy maszyn";
  summary: string;
  /** Krotkie fakty pokazywane jako "chipy" na karcie. */
  facts: string[];
  /** true = wyroznienie karty jako flagowego kursu. */
  featured?: boolean;
};

/*
 * Katalog odwzorowuje kursy obecne dzisiaj na europeantechacademy.com.
 * TODO (do uzupelnienia przez ETA): liczba godzin i ceny dla kursow
 * oznaczonych "do potwierdzenia" — nie sa podane publicznie na obecnej stronie.
 */
export const courses: Course[] = [
  {
    id: "sep-g1",
    title: "Elektryk SEP G1",
    category: "Elektryka",
    summary:
      "Przygotowanie do egzaminu przed komisją kwalifikacyjną SEP w zakresie eksploatacji (E) i dozoru (D) urządzeń do 1 kV. Zajęcia teoretyczne plus praktyka w laboratorium elektrycznym.",
    facts: ["Uprawnienia E i D", "Laboratorium elektryczne", "Egzamin SEP: 466,60 zł"],
    featured: true,
  },
  {
    id: "elektryk-din",
    title: "Elektryk według normy DIN",
    category: "Elektryka",
    summary:
      "Program dla osób z doświadczeniem technicznym, bez formalnego wykształcenia elektrycznego — przygotowanie do pracy w Niemczech jako Elektrofachkraft für festgelegte Tätigkeiten.",
    facts: ["180 godzin", "120 h zawodowe + 20 h SEP + 40 h niemiecki", "Standardy niemieckie"],
    featured: true,
  },
  {
    id: "elektryk-pro",
    title: "Elektryk Pro",
    category: "Elektryka",
    summary:
      "Rozszerzona ścieżka elektryczna dla osób, które chcą pracować samodzielnie na instalacjach i urządzeniach — z naciskiem na pomiary, dokumentację i bezpieczeństwo.",
    facts: ["Poziom rozszerzony", "Pomiary i protokoły", "Zakres do potwierdzenia"],
  },
  {
    id: "operator-koparek",
    title: "Operator koparek klasy 1",
    category: "Operatorzy maszyn",
    summary:
      "Uprawnienia operatora koparek jednonaczyniowych klasy I — bez ograniczeń masy eksploatacyjnej. Szkolenie kończy się egzaminem państwowym.",
    facts: ["Klasa I — bez ograniczeń", "Egzamin państwowy", "Uprawnienia bezterminowe"],
  },
  {
    id: "operator-ladowarki",
    title: "Operator ładowarki",
    category: "Operatorzy maszyn",
    summary:
      "Kurs operatora ładowarek jednonaczyniowych: teoria, budowa i eksploatacja maszyny oraz zajęcia praktyczne na placu manewrowym.",
    facts: ["Teoria + plac manewrowy", "Egzamin państwowy", "Uprawnienia w UE"],
  },
  {
    id: "operator-koparkoladowarki",
    title: "Operator koparkoładowarki",
    category: "Operatorzy maszyn",
    summary:
      "Jedne uprawnienia, dwie maszyny w jednej — najczęściej wybierana kwalifikacja na budowach i w firmach drogowych.",
    facts: ["Dwie maszyny, jeden kurs", "Egzamin państwowy", "Wysoki popyt na rynku"],
  },
];
