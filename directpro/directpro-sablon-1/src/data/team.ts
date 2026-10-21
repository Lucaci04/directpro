// Echipa, așa cum e listată pe https://directpro.example/ (nume și roluri).
// Numele sunt scrise exact ca pe site (fără diacritice adăugate de noi), cu excepția celor afișate deja cu diacritice.
import type { ImageMetadata } from 'astro';

const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/echipa/*.jpg', { eager: true });
const photo = (file: string) => photos[`../assets/echipa/${file}.jpg`].default;

export const team = [
  { name: 'Victor Oprea', role: 'Fondator', photo: photo('victor-oprea') },
  { name: 'Andrei Popa', role: 'Director dezvoltare', photo: photo('andrei-popa') },
  { name: 'Diana Stan', role: 'Asistent manager', photo: photo('diana-stan') },
  { name: 'Tudor Mihai', role: 'Mecanic auto', photo: photo('tudor-mihai') },
  { name: 'Sorin Tudose', role: 'Electromecanic', photo: photo('sorin-tudose') },
  { name: 'Marius Pavel', role: 'Mecanic auto', photo: photo('marius-pavel') },
  { name: 'Dan Moraru', role: 'Mecanic auto', photo: photo('dan-moraru') },
  { name: 'Emil Rusu', role: 'Electronist', photo: photo('emil-rusu') },
  { name: 'Gabriel Toma', role: 'Strungar', photo: photo('gabriel-toma') },
  { name: 'Bogdan Ilie', role: 'Tehnician', photo: photo('bogdan-ilie') },
  { name: 'Paul Dobre', role: 'Tehnician', photo: photo('paul-dobre') },
  { name: 'Ovidiu Nistor', role: 'Tehnician', photo: photo('ovidiu-nistor') },
  { name: 'Iulian Barbu', role: 'Tehnician', photo: photo('iulian-barbu') },
  { name: 'Horia Lungu', role: 'Tehnician', photo: photo('horia-lungu') },
  { name: 'Liviu Sava', role: 'Tehnician', photo: photo('liviu-sava') },
  { name: 'Cosmin Neagu', role: 'Consilier vânzări', photo: photo('cosmin-neagu') },
  { name: 'Corina Matei', role: 'Consilier vânzări', photo: photo('corina-matei') },
  { name: 'Ana Vlad', role: 'Consilier vânzări', photo: photo('ana-vlad') },
  { name: 'Raluca Enache', role: 'Contabilitate', photo: photo('raluca-enache') },
];
