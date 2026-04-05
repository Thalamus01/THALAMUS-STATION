
import { v4 as uuidv4 } from 'uuid';

export interface License {
  id: string;
  userId: string;
  email: string;
  key: string;
  createdAt: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  accountNumber?: string; // MT5 Account Number
}

const STORAGE_KEY = 'thalamus_cameleon_licenses';

export const LicenseService = {
  getLicenses: (): License[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getUserLicense: (userId: string): License | undefined => {
    const licenses = LicenseService.getLicenses();
    return licenses.find(l => l.userId === userId);
  },

  generateLicense: (userId: string, accountNumber: string, email: string): License => {
    const licenses = LicenseService.getLicenses();
    
    // Check if user already has a license
    const existing = licenses.find(l => l.userId === userId);
    if (existing) return existing;

    // Generate a unique key (e.g., CML-XXXX-XXXX-XXXX)
    const rawKey = uuidv4().toUpperCase().split('-').slice(0, 3).join('-');
    const key = `CML-${rawKey}`;

    const newLicense: License = {
      id: uuidv4(),
      userId,
      email,
      key,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      accountNumber
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...licenses, newLicense]));
    return newLicense;
  },

  revokeLicense: (licenseId: string) => {
    const licenses = LicenseService.getLicenses();
    const updated = licenses.map(l => 
      l.id === licenseId ? { ...l, status: 'REVOKED' as const } : l
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getAllLicenses: (): License[] => {
    return LicenseService.getLicenses();
  }
};
