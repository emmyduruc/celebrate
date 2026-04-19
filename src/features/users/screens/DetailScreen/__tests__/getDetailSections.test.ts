import { getDetailSections } from '../getDetailSections';
import { mockUser } from '@/__mocks__/server';

describe('getDetailSections', () => {
  const sections = getDetailSections(mockUser);

  it('returns 5 sections', () => {
    expect(sections).toHaveLength(5);
  });

  it('Contact section has email, phone, and username with @ prefix', () => {
    const contact = sections.find((s) => s.title === 'Contact');
    expect(contact?.rows).toContainEqual({ label: 'Email', value: mockUser.email });
    expect(contact?.rows).toContainEqual({ label: 'Phone', value: mockUser.phone });
    expect(contact?.rows).toContainEqual({ label: 'Username', value: `@${mockUser.username}` });
  });

  it('Personal section formats hair as "color type"', () => {
    const personal = sections.find((s) => s.title === 'Personal');
    expect(personal?.rows).toContainEqual({
      label: 'Hair',
      value: `${mockUser.hair.color} ${mockUser.hair.type}`,
    });
  });

  it('Address section formats state with state code', () => {
    const address = sections.find((s) => s.title === 'Address');
    expect(address?.rows).toContainEqual({
      label: 'State',
      value: `${mockUser.address.state} (${mockUser.address.stateCode})`,
    });
  });

  it('Banking section masks all but last 4 card digits', () => {
    const banking = sections.find((s) => s.title === 'Banking');
    const cardRow = banking?.rows.find((r) => r.label === 'Card Number');
    expect(cardRow?.value).toBe(`**** **** **** ${mockUser.bank.cardNumber.slice(-4)}`);
  });

  it('Company section has name, department, and title', () => {
    const company = sections.find((s) => s.title === 'Company');
    expect(company?.rows).toContainEqual({ label: 'Name', value: mockUser.company.name });
    expect(company?.rows).toContainEqual({ label: 'Department', value: mockUser.company.department });
    expect(company?.rows).toContainEqual({ label: 'Title', value: mockUser.company.title });
  });
});
