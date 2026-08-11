export type InvitationContactInput = {
  contactName: string;
  phone: string;
};

export function parseInvitationContacts(value: unknown): InvitationContactInput[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 5) return null;

  const contacts = value.map((item) => {
    if (!item || typeof item !== 'object') return null;
    const contactName = typeof (item as any).contactName === 'string' ? (item as any).contactName.trim() : '';
    const phone = typeof (item as any).phone === 'string' ? (item as any).phone.trim() : '';
    if (contactName.length < 2 || contactName.length > 80 || !/^\+?\d[\d\s()-]{8,18}$/.test(phone)) return null;
    return { contactName, phone };
  });

  if (contacts.some((contact) => !contact)) return null;
  const normalized = contacts.map((contact) => contact!.phone.replace(/\D/g, '').replace(/^52(?=\d{10}$)/, ''));
  if (normalized.some((phone) => phone.length !== 10) || new Set(normalized).size !== normalized.length) return null;

  return contacts as InvitationContactInput[];
}

export function contactsForRpc(contacts: InvitationContactInput[]) {
  return contacts.map((contact) => ({ contact_name: contact.contactName, phone: contact.phone }));
}

export function serializeGuest(guest: any) {
  const contacts = [...(guest.contacts ?? [])]
    .sort((left, right) => left.display_order - right.display_order)
    .map((contact) => ({
      id: contact.id,
      contactName: contact.contact_name,
      phone: contact.phone_e164,
      isPrimary: contact.is_primary
    }));

  return {
    id: guest.id,
    token: guest.public_token,
    invitationCode: guest.invitation_code,
    fullName: guest.full_name,
    contacts,
    invitationType: guest.invitation_type,
    allowedPasses: guest.allowed_passes,
    confirmedPasses: guest.confirmed_passes,
    allowedAdults: guest.allowed_adults,
    allowedChildren: guest.allowed_children,
    confirmedAdults: guest.confirmed_adults,
    confirmedChildren: guest.confirmed_children,
    status: guest.confirmation_status,
    note: guest.guest_note,
    isActive: guest.is_active,
    confirmedAt: guest.confirmed_at,
    createdAt: guest.created_at
  };
}

export const adminGuestSelect = [
  'id',
  'public_token',
  'invitation_code',
  'full_name',
  'invitation_type',
  'allowed_passes',
  'confirmed_passes',
  'allowed_adults',
  'allowed_children',
  'confirmed_adults',
  'confirmed_children',
  'confirmation_status',
  'guest_note',
  'is_active',
  'confirmed_at',
  'created_at',
  'contacts:wedding_invitation_contacts(id, contact_name, phone_e164, is_primary, display_order)'
].join(', ');
