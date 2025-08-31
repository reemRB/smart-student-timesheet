export type CellKey = `${string}|${string}`;

export type ClassBlock = {
  className: string;
  roomNumber: string;
  durationMin: number;
  topPercentage: number;
  heightPercentage: number;
};

export function dayName(date: Date): string {
  const namesMondayFirst = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const idx = (date.getDay() + 6) % 7; // Monday=0 … Sunday=6
  return namesMondayFirst[idx];
}

export function hourLabel(d: Date): string {
  const h24 = d.getHours();
  const ampm = h24 < 12 ? 'AM' : 'PM';
  let h = h24 % 12;
  if (h === 0) h = 12;
  return `${h}:00 ${ampm}`;
}

export function cellKey(day: string, hourLabel: string): CellKey {
  return `${day}|${hourLabel}` as CellKey;
}
