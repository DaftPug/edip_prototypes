/***** Brainstorm

  En prøver at finde en person via en skærm, som ændrer farve efter hvor tæt på personen er, en anden prøver at flygte, ved at mærke telefonens vibrationer, som indikerer, at personen kommer tættere på.

  Opsætning:
    - 2+ klienter, som kommunikerer igennem en broker
      - klienterne skal begge oprette forbindelse til brokeren på rette kanal
    - kommunikationen skal være to-vejs, da klienter løbende skal både sende sin position og modtage information om de resterende klienters position
    - GPS skal benyttes og virke på samtlige klienter, da viden om deres position er afhængig af dette
    - vibration:
      - klienterne, som forsøger at undgå fangeren, registrerer, at fangeren er tættere på ved hjælp af telefonens vibrationer
    - skærm:
      - fangeren får information om den er tættere eller længere væk fra en klient via farven på skærmen

  Tanker:
    - Hvordan fastholdes klienternes fokus på mobilen og ikke bare ved at kigge rundt?
      - De skal løse små opgaver for at få "meter at gå" og hvis de ikke løser en opgave, så står deres klient fast og kan blive fanget af fangeren
        - Hvis en klient, både fanger og jagtede, går videre uden at have løst en opgave, skal klienten tilbage og 'hente' sig selv

*/




