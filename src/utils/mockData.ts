import { User, Transaction } from '../types';

export const currentUser: User = {
  handle: '@shashank',
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shashank'
};

export const mockUsers: Record<string, User> = {
  '@alice': {
    handle: '@alice',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
  },
  '@bob': {
    handle: '@bob',
    address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
  },
  '@charlie': {
    handle: '@charlie',
    address: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie'
  },
  '@dana': {
    handle: '@dana',
    address: '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dana'
  },
  '@niharika': {
    handle: '@niharika',
    address: '0x8ba1f109551bD432803012645Hac136c22C1779',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=niharika'
  }
};

export const mockTransactions: Transaction[] = [
  {
    id: '0x1a2b3c',
    from: mockUsers['@alice'],
    to: currentUser,
    amount: 15.00,
    note: 'Pizza & Drinks 🍕',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    type: 'received',
    duration: 0.9,
    gasUsed: 0.0008
  },
  {
    id: '0x2b3c4d',
    from: currentUser,
    to: mockUsers['@bob'],
    amount: 50.00,
    note: 'Concert tickets 🎸',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    type: 'sent',
    duration: 0.7,
    gasUsed: 0.0009
  },
  {
    id: '0x3c4d5e',
    from: mockUsers['@charlie'],
    to: currentUser,
    amount: 25.00,
    note: 'Gas money',
    timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
    type: 'received',
    duration: 1.1,
    gasUsed: 0.0007
  },
  {
    id: '0x4d5e6f',
    from: currentUser,
    to: mockUsers['@dana'],
    amount: 100.00,
    note: 'Birthday gift 🎂',
    timestamp: new Date(Date.now() - 1000 * 60 * 1440), // 1 day ago
    type: 'sent',
    duration: 0.8,
    gasUsed: 0.0010
  },
  {
    id: '0x5e6f7g',
    from: mockUsers['@alice'],
    to: currentUser,
    amount: 80.00,
    note: 'Rent share',
    timestamp: new Date(Date.now() - 1000 * 60 * 2880), // 2 days ago
    type: 'received',
    duration: 0.9,
    gasUsed: 0.0008
  }
];

export const checkHandleAvailability = (handle: string): { available: boolean; user?: User } => {
  const normalizedHandle = handle.startsWith('@') ? handle : `@${handle}`;
  const user = mockUsers[normalizedHandle];
  
  return {
    available: !user,
    user
  };
};
