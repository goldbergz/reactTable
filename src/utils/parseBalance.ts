export const parseBalance = (balance: string): number =>
  Number(balance.replace(/[^0-9.-]+/g, ''));
