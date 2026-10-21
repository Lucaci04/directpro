// Toate informațiile de mai jos provin de pe https://directpro.example/ (verificat 2026-10-12)
// sau au fost confirmate de client. Nu adăuga afirmații noi fără sursă.
import type { ImageMetadata } from 'astro';

import atelier01 from '../assets/atelier/atelier-01.jpg';
import atelier05 from '../assets/atelier/atelier-05.jpg';
import atelier06 from '../assets/atelier/atelier-06.jpg';
import atelier07 from '../assets/atelier/atelier-07.jpg';
import atelier10 from '../assets/atelier/atelier-10.jpg';
import atelier12 from '../assets/atelier/atelier-12.jpg';
import atelier14 from '../assets/atelier/atelier-14.jpg';
import atelier19 from '../assets/atelier/atelier-19.jpg';
import atelier41 from '../assets/atelier/atelier-41.jpg';
import atelier45 from '../assets/atelier/atelier-45.jpg';
import atelier51 from '../assets/atelier/atelier-51.jpg';
import atelier52 from '../assets/atelier/atelier-52.jpg';
import atelier53 from '../assets/atelier/atelier-53.jpg';

export const contact = {
  phoneDisplay: '0300 000 301',
  phoneHref: 'tel:+40300000301',
  whatsappHref: 'https://wa.me/40300000301',
  email: 'contact@directpro.example',
  street: 'Drumul între Tarlale 15A',
  building: 'Astorium Logistic, Hala\u00a09\u2060–\u206010',
  city: 'București 032982',
  hours: 'Luni – Vineri, 09:00 – 18:00',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=Constan%C8%9Ba',
  wazeHref: 'https://www.waze.com/',
  social: [
    { label: 'Facebook', href: 'https://www.facebook.com/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/' },
    { label: 'YouTube', href: 'https://www.youtube.com/' },
  ],
};

export const hallPhoto = atelier01;

export interface Service {
  slug: string;
  bay: string;
  name: string;
  short: string;
  photo: ImageMetadata;
  photoAlt: string;
  intro: string[];
  groups: { title: string; text?: string; items?: string[] }[];
  steps?: { title: string; items: string[] };
  audience?: string;
}

export const services: Service[] = [
  {
    slug: 'casete-de-directie',
    bay: '01',
    name: 'Reparații casete de direcție',
    short: 'Mecanice, hidraulice și electrice (EPS), pentru orice marcă.',
    photo: atelier05,
    photoAlt: 'Tehnician DIRECTPRO lucrând la o casetă de direcție pe bancul de lucru',
    intro: [
      'Reparăm casete de direcție mecanice, hidraulice și electrice pentru autoturisme și camioane, cu personal autorizat și echipamente de testare dedicate.',
      'Totul începe cu identificarea corectă și completă a cauzei defectului. Abia apoi stabilim etapele tehnice necesare pentru remedierea completă.',
    ],
    groups: [
      {
        title: 'Casete mecanice',
        text: 'Curățare temeinică, la interior și exterior, a casetei și a tuturor componentelor. Kitul de reparație e înlocuit cu componente originale, iar probele finale se fac pe bancuri de probă.',
      },
      {
        title: 'Casete hidraulice',
        text: 'Verificăm caseta vizual și pe tester, o curățăm, apoi schimbăm piesele uzate cu kituri de reparație sau piese originale. La final, o testăm pe banc în mai multe regimuri.',
      },
      {
        title: 'Casete electrice (EPS)',
        text: 'Pentru direcții electrice cu motor pe casetă sau pe coloană. Reparăm casete ZF, CORTECO, CFW, STEFA, TRW și altele.',
      },
      {
        title: 'Montare și demontare',
        text: 'Demontăm și montăm casete de direcție la autoturisme, dube și camioane, cu tehnicieni autorizați R.A.R.: analiză inițială, pregătire, execuție și testare înainte de predare.',
      },
    ],
    steps: {
      title: 'Etapele unei reparații',
      items: [
        'Diagnoză completă și identificarea defectului',
        'Caseta e curățată pe dinăuntru și pe dinafară',
        'Curățarea elementelor componente',
        'Înlocuirea kitului de reparație',
        'Înlocuire ax, pinion, carcasă – după soluția aprobată',
        'Asamblare și testare finală',
      ],
    },
  },
  {
    slug: 'reconditionari-casete',
    bay: '02',
    name: 'Recondiționări casete de direcție',
    short: 'Casete recondiționate complet, livrate din stoc în toată țara.',
    photo: atelier45,
    photoAlt: 'Tehnician cu mască de protecție curățând o casetă de direcție',
    intro: [
      'Recondiționarea casetei de direcție contează atât pentru siguranța dumneavoastră, cât și pentru restul subansamblelor mașinii.',
      'Avem în stoc casete de direcție recondiționate multimarcă. Le livrăm rapid, cu piesa veche la schimb, ca să nu rămâneți cu mașina blocată în service.',
    ],
    groups: [
      { title: 'Personal calificat', text: 'Cu experiență de peste 15 ani.' },
      { title: 'Piese de calitate', text: 'Fiecare lucrare are garanție în scris.' },
      { title: 'Gamă largă', text: 'De modele și tipuri de casete de direcție.' },
      { title: 'Livrare rapidă din stoc', text: 'Casete de direcție multimarcă, la nivel național.' },
    ],
    steps: {
      title: 'Etapele recondiționării',
      items: [
        'Diagnoză completă pentru fiecare casetă',
        'Verificarea eventualelor deteriorări mecanice',
        'Sablare completă, care scoate rugina și depunerile',
        'Kituri complete de recondiționare: segmenți, garnituri, semeringuri',
        'Control și verificare finală',
      ],
    },
  },
  {
    slug: 'pompe-servodirectie',
    bay: '03',
    name: 'Pompe de servodirecție',
    short: 'Pompe hidraulice și electrohidraulice: diagnoză, reparație, recondiționare.',
    photo: atelier19,
    photoAlt: 'Tehnician DIRECTPRO verificând o pompă de servodirecție',
    intro: [
      'Reparăm pompe de servodirecție pentru autoturisme, autoutilitare și camioane, pentru persoane fizice și juridice, pe bază de comandă fermă sau contract de prestări servicii.',
      'Când aduci mașina, verificăm pompa și facem diagnoza completă. Pe baza unui raport detaliat pornim procesul de reparație.',
    ],
    groups: [
      {
        title: 'Pompe hidraulice',
        text: 'Pompa e montată în fața motorului și e acționată de cureaua de accesorii. Ea crește presiunea și trimite lichidul de servodirecție către caseta de direcție.',
      },
      {
        title: 'Pompe electrohidraulice',
        text: 'Reparații complete cu kit de recondiționare, cu diagnoză și verificare înainte și după intervenție.',
      },
    ],
    audience: 'Oferte dedicate pentru persoane fizice și pentru companii cu parcuri și flote auto.',
  },
  {
    slug: 'coloane-de-directie',
    bay: '04',
    name: 'Coloane de direcție',
    short: 'Reparații complete pentru autoturisme și autoutilitare.',
    photo: atelier51,
    photoAlt: 'Tehnician lucrând la volanul și coloana de direcție ale unei mașini',
    intro: [
      'Coloana de direcție transmite comanda de virare de la volan la mecanismul de acționare și permite reglarea poziției volanului.',
      'Executăm intervenții complete la coloanele de direcție pentru autoturisme și autoutilitare, pentru persoane fizice și juridice.',
    ],
    groups: [
      {
        title: 'Rol în siguranța pasivă',
        items: [
          'Airbagul șoferului e amplasat în butucul volanului.',
          'Unele elemente se deformează controlat și evită impactul cu corpul șoferului.',
          'Blochează manevrarea volanului cât timp mașina staționează.',
        ],
      },
      {
        title: 'Coloana deformabilă',
        text: 'Se deformează controlat, axial, sub acțiunea unui șoc și protejează șoferul la un impact frontal.',
      },
      {
        title: 'Coloana telescopică',
        text: 'Previne deplasarea volanului la un accident, astfel încât airbagul să se poată declanșa complet și în siguranță.',
      },
    ],
  },
  {
    slug: 'geometrie-roti',
    bay: '05',
    name: 'Geometrie roți 3D',
    short: 'Geometrie computerizată, în atelierul din Sector 3.',
    photo: atelier53,
    photoAlt: 'Tehnician montând senzorul de geometrie 3D pe roata unei mașini',
    intro: [
      'Geometria computerizată identifică parametrii greșiți ai roților. O geometrie corectă reduce uzura anvelopelor, le prelungește viața și are un impact important asupra consumului de combustibil.',
      'Recomandăm verificări periodice, indiferent de anotimp.',
    ],
    groups: [
      {
        title: 'Ce verificăm',
        items: [
          'Alinierea roților în raport cu direcția de mers',
          'Poziția fiecărei roți în raport cu cealaltă',
          'Alți parametri tehnici cu impact direct asupra manevrabilității',
        ],
      },
      {
        title: 'Cele patru unghiuri',
        text: 'Unghiul de cădere, convergența, unghiul de fugă și înclinarea transversală a axei pivotului.',
      },
    ],
    audience: 'Pentru persoane fizice și juridice, parcuri și flote auto multimarcă.',
  },
  {
    slug: 'calibrari-adas',
    bay: '06',
    name: 'Calibrări ADAS',
    short: 'Camere, radar și sisteme de asistență, verificate și calibrate.',
    photo: atelier52,
    photoAlt: 'Echipament de calibrare ADAS montat în fața unei mașini',
    intro: [
      'Sistemele ADAS (Advanced Driver Assistance Systems) ajută șoferul în trafic și previn accidentele. Le găsiți pe majoritatea mașinilor noi, indiferent de marcă sau model.',
    ],
    groups: [
      {
        title: 'Ce verificăm și calibrăm',
        items: [
          'Camerele auto față și spate',
          'ACC – Adaptive Cruise Control',
          'Asistentul de schimbare a benzii',
          'Night Vision Assist',
          'Emergency Braking Function',
          'Multicollision Brake Assist',
          'Traffic Sign Detection – recunoașterea indicatoarelor',
        ],
      },
    ],
  },
];

export const symptoms = [
  {
    label: 'Volanul e greu',
    detail: 'Manevrare grea sau defectuoasă, adesea cu pierderi de ulei și temperatură crescută în casetă.',
    services: ['casete-de-directie', 'pompe-servodirectie'],
  },
  {
    label: 'Curge ulei de servodirecție',
    detail: 'De obicei garnituri, coliere, furtunuri sau burdufuri de etanșare deteriorate.',
    services: ['casete-de-directie', 'pompe-servodirectie'],
  },
  {
    label: 'Zgomot în volan',
    detail: 'Bătăi, cloncănit sau alte zgomote resimțite la manevrare.',
    services: ['casete-de-directie', 'reconditionari-casete'],
  },
  {
    label: 'Trage sau se comportă ciudat în viraje',
    detail: 'Comportament greșit la diferite viteze. E important pentru siguranța tuturor.',
    services: ['casete-de-directie', 'geometrie-roti'],
  },
];

export const workflow = [
  { title: 'Diagnoză', text: 'Identificăm corect și complet cauza defectului.', photo: atelier10, alt: 'Tabletă de diagnoză lângă o mașină în service' },
  { title: 'Curățare', text: 'Curățare internă și externă, inclusiv prin sablare.', photo: atelier07, alt: 'Tehnician curățând o casetă de direcție' },
  { title: 'Kit de reparație', text: 'Componente originale, după soluția aprobată.', photo: atelier14, alt: 'Tehnician lucrând la banc cu componentele casetei' },
  { title: 'Test pe banc', text: 'Probe finale pe bancuri de probă, înainte de predare.', photo: atelier12, alt: 'Tehnician la bancul de probă cu panoul turcoaz de echipamente' },
];

export const testimonials = [
  {
    quote:
      'Volanul bătea în gropi și se auzea un zgomot sec la viraj. Au găsit problema la casetă din prima verificare, au recondiționat-o și mi-au făcut și geometria. Am plătit cât mi s-a spus în ofertă. (Recenzie de exemplu.)',
    name: 'Andrei P.',
  },
  {
    quote:
      'După schimbarea parbrizului, asistentul de bandă nu mai mergea corect. L-au calibrat în aceeași zi și mi-au arătat raportul. (Recenzie de exemplu.)',
    name: 'Maria C.',
  },
  {
    quote: 'Comunicare clară, termen respectat și garanție scrisă. (Recenzie de exemplu.)',
    name: 'Radu S.',
  },
];

export const extraPhotos = { adas: atelier06, geometrie: atelier41 };
