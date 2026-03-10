
export interface ThalamusUser {
  id: string;
  email?: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  registrationDate: number;
  expiryDate: number;
  lastLogin?: number;
  isOnline: boolean;
  lastBalance: number;
  mhiScore: number;
  platform: string;
}

const STORAGE_KEY = 'THALAMUS_USERS_DB';
const COUNTER_KEY = 'THALAMUS_REMAINING_SPOTS';

const BOOTSTRAP_USERS: ThalamusUser[] = [
  {
    id: 'THA-5234-OBA',
    email: 'pioneer1@thalamus.ai',
    status: 'ACTIVE',
    registrationDate: Date.now() - (1000 * 60 * 60 * 24 * 10),
    expiryDate: Date.now() + (1000 * 60 * 60 * 24 * 30),
    isOnline: true,
    lastBalance: 15446148.87,
    mhiScore: 88,
    platform: 'MT5'
  },
  {
    id: 'THA-EXPIRED-TEST',
    email: 'tester@gmail.com',
    status: 'ACTIVE',
    registrationDate: Date.now() - (1000 * 60 * 60 * 24 * 20),
    expiryDate: Date.now() - 1000,
    isOnline: false,
    lastBalance: 4500.50,
    mhiScore: 12,
    platform: 'MT5'
  },
  {
    id: 'THA-INACTIVE-TEST',
    email: 'pending_trader@outlook.com',
    status: 'PENDING',
    registrationDate: Date.now() - (1000 * 60 * 60 * 2),
    expiryDate: Date.now() + (1000 * 60 * 60 * 24 * 7),
    isOnline: false,
    lastBalance: 0,
    mhiScore: 0,
    platform: 'WEB'
  }
];

export const getRemainingSpots = (): number => {
  const stored = localStorage.getItem(COUNTER_KEY);
  return stored ? parseInt(stored) : 457; // Default value
};

export const setRemainingSpots = (count: number) => {
  localStorage.setItem(COUNTER_KEY, count.toString());
};

export const getStoredUsers = (): ThalamusUser[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(BOOTSTRAP_USERS));
    return BOOTSTRAP_USERS;
  }
  return JSON.parse(stored);
};

export const saveUsers = (users: ThalamusUser[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const validateLicense = (syncId: string): { isValid: boolean; reason?: 'NOT_FOUND' | 'INACTIVE' | 'EXPIRED' } => {
  const users = getStoredUsers();
  const user = users.find(u => u.id === syncId);

  if (!user) return { isValid: false, reason: 'NOT_FOUND' };
  if (user.status !== 'ACTIVE') return { isValid: false, reason: 'INACTIVE' };
  if (Date.now() > user.expiryDate) return { isValid: false, reason: 'EXPIRED' };

  return { isValid: true };
};

export const updateUserSettings = (userId: string, settings: Partial<ThalamusUser>) => {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...settings };
    saveUsers(users);
  }
};

export const addUser = (newUser: ThalamusUser) => {
  const users = getStoredUsers();
  users.push(newUser);
  saveUsers(users);
};
