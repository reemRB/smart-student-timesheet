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
  // Monday=0 … Sunday=6
  const index = (date.getDay() + 6) % 7;
  return namesMondayFirst[index];
}

export function hourLabel(date: Date): string {
  const h24 = date.getHours();
  const ampm = h24 < 12 ? 'AM' : 'PM';
  let hour = h24 % 12;
  if (hour === 0) hour = 12;
  return `${hour}:00 ${ampm}`;
}

export function cellKey(day: string, hourLabel: string): CellKey {
  return `${day}|${hourLabel}` as CellKey;
}
