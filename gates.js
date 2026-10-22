// Координаты в процентах от нового перспективного плана (дорога снизу).
// Источник: reference/gates-perspective-annotated.jpg, 1200 × 660.
// Нумерация подтверждена пользователем после обхода всех калиток.
// id постоянный; number, x, y, phone, photo и description можно менять.
// photo: null или './assets/gate-2.webp'. Телефон: международный формат или null.
export const gates = [
  { id: 'gate-1', number: 1, x: 83.583, y: 29.848, phone: '+79604989329', photo: './assets/gate-1.webp', description: 'Справа на схеме · между корпусами 1 и 2' },
  { id: 'gate-2', number: 2, x: 64.000, y: 38.182, phone: '+79604957663', photo: './assets/gate-2.webp', description: 'Между корпусами 1 и 3' },
  { id: 'gate-3', number: 3, x: 41.750, y: 78.939, phone: '+79604989331', photo: './assets/gate-3.webp', description: 'Между корпусами 4 и 6 · со стороны дороги' },
  { id: 'gate-4', number: 4, x: 72.167, y: 56.667, phone: '+79604989344', photo: './assets/gate-4.webp', description: 'Между корпусами 2 и 4 · со стороны дороги' },
  { id: 'gate-5', number: 5, x: 35.917, y: 54.697, phone: '+79604989345', photo: './assets/gate-5.webp', description: 'Между корпусами 3 и 5' },
  { id: 'gate-6', number: 6, x: 16.917, y: 69.848, phone: '+79604989466', photo: './assets/gate-6.webp', description: 'Слева на схеме · между корпусами 5 и 6' },
];
