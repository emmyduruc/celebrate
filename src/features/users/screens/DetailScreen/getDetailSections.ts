import type { User } from '../../types';

export interface DetailSectionRow {
  label: string;
  value: string;
}

export interface DetailSectionData {
  title: string;
  icon: string;
  rows: DetailSectionRow[];
}

export function getDetailSections(user: User): DetailSectionData[] {
  return [
    {
      title: 'Contact',
      icon: 'mail-outline',
      rows: [
        { label: 'Email', value: user.email },
        { label: 'Phone', value: user.phone },
        { label: 'Username', value: `@${user.username}` },
      ],
    },
    {
      title: 'Personal',
      icon: 'person-outline',
      rows: [
        { label: 'Age', value: String(user.age) },
        { label: 'Gender', value: user.gender },
        { label: 'Blood Group', value: user.bloodGroup },
        { label: 'Eye Color', value: user.eyeColor },
        { label: 'Hair', value: `${user.hair.color} ${user.hair.type}` },
        { label: 'University', value: user.university },
      ],
    },
    {
      title: 'Address',
      icon: 'location-outline',
      rows: [
        { label: 'Street', value: user.address.address },
        { label: 'City', value: user.address.city },
        { label: 'State', value: `${user.address.state} (${user.address.stateCode})` },
        { label: 'Postal Code', value: user.address.postalCode },
        { label: 'Country', value: user.address.country },
      ],
    },
    {
      title: 'Company',
      icon: 'briefcase-outline',
      rows: [
        { label: 'Name', value: user.company.name },
        { label: 'Department', value: user.company.department },
        { label: 'Title', value: user.company.title },
      ],
    },
    {
      title: 'Banking',
      icon: 'card-outline',
      rows: [
        { label: 'Card Type', value: user.bank.cardType },
        { label: 'Currency', value: user.bank.currency },
        {
          label: 'Card Number',
          value: `**** **** **** ${user.bank.cardNumber.slice(-4)}`,
        },
      ],
    },
  ];
}
