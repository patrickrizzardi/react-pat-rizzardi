export const metrics = [
  { value: '$2M+', label: 'cashflow / month' },
  { value: '500M+', label: 'rows managed' },
  { value: '100K+', label: 'users served' },
  { value: '4', label: 'dev team led' },
] as const satisfies ReadonlyArray<{ value: string; label: string }>;
