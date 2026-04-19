import type { User, UsersResponse } from '@features/users/types';

export const mockUser: User = {
  id: 1,
  firstName: 'Emily',
  lastName: 'Johnson',
  maidenName: '',
  age: 28,
  gender: 'female',
  email: 'emily.johnson@x.dummyjson.com',
  phone: '+81 965-431-3024',
  username: 'emilys',
  bloodGroup: 'A+',
  height: 193.24,
  weight: 63.16,
  eyeColor: 'Green',
  hair: { color: 'Brown', type: 'Curly' },
  ip: '42.48.100.32',
  address: {
    address: '626 Main Street',
    city: 'Phoenix',
    state: 'Mississippi',
    stateCode: 'MS',
    postalCode: '29112',
    coordinates: { lat: -77.16213, lng: -92.084824 },
    country: 'United States',
  },
  macAddress: '47:fa:41:18:ec:eb',
  university: 'University of Wisconsin--Madison',
  bank: {
    cardExpire: '03/26',
    cardNumber: '9289760655481815',
    cardType: 'Elo',
    currency: 'CNY',
    iban: 'LRCQ4K5D NVST4OP5 7OM6VHO8',
  },
  company: {
    department: 'Engineering',
    name: 'Dooley, Kozey and Cronin',
    title: 'Sales Manager',
    address: {
      address: '263 Tenth Street',
      city: 'San Francisco',
      state: 'Wisconsin',
      stateCode: 'WI',
      postalCode: '37657',
      coordinates: { lat: 71.814525, lng: -161.150263 },
      country: 'United States',
    },
  },
  ein: '977-175',
  ssn: '900-590-289',
  userAgent: 'Mozilla/5.0 ...',
  crypto: {
    coin: 'Bitcoin',
    wallet: '0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a',
    network: 'Ethereum (ERC20)',
  },
  role: 'admin',
  image: 'https://dummyjson.com/icon/emilys/128',
};

export const mockUsersResponse: UsersResponse = {
  users: [mockUser],
  total: 1,
  skip: 0,
  limit: 30,
};

export function mockFetchSuccess(data: unknown) {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
}

export function mockFetchError(status = 500, message = 'Internal Server Error') {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status,
    statusText: message,
    json: async () => ({ message }),
  });
}
