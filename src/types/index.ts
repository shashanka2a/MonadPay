export interface User {
  handle: string;
  address: string;
  avatar: string;
}

export interface Transaction {
  id: string;
  from: User;
  to: User;
  amount: number;
  note: string;
  timestamp: Date;
  type: 'sent' | 'received';
  duration: number; // in seconds
  gasUsed: number; // in dollars
}

export interface RegistryCheck {
  handle: string;
  available: boolean;
  address?: string;
  user?: User;
}
