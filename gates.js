// Координаты в процентах от ПОВЁРНУТОГО генплана (дорога снизу).
// Источник: reference/gates-annotated.jpg, 1200 × 673.
// id постоянный; number, x, y, phone, photo и description можно менять.
// photo: null или './assets/gate-2.jpg'. Телефон: международный формат или null.
export const gates = [
  { id: 'gate-1', number: 1, x: 82.08, y: 59.58, phone: null, photo: null, description: 'Справа на схеме · между корпусами 1 и 2' },
  { id: 'gate-2', number: 2, x: 62.83, y: 49.93, phone: '+79604957663', photo: null, description: 'Между корпусами 1 и 3' },
  { id: 'gate-3', number: 3, x: 37.08, y: 69.99, phone: '+79604989331', photo: null, description: 'Между корпусами 4 и 6 · со стороны дороги' },
  { id: 'gate-4', number: 4, x: 62.58, y: 69.99, phone: null, photo: null, description: 'Между корпусами 2 и 4 · со стороны дороги' },
  { id: 'gate-5', number: 5, x: 37.08, y: 49.93, phone: null, photo: null, description: 'Между корпусами 3 и 5' },
  { id: 'gate-6', number: 6, x: 22.83, y: 57.65, phone: null, photo: null, description: 'Слева на схеме · между корпусами 5 и 6' },
];
