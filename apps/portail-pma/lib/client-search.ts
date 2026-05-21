export function normalizeClientSearch(value?: string | null) {
  return (value || "").trim();
}

export function buildClientSearchWhere(query: string) {
  if (!query) return null;

  const contains = { contains: query, mode: "insensitive" as const };

  return {
    OR: [
      { code: contains },
      { name: contains },
      { billing_name: contains },
      { representative_name: contains },
      { email: contains },
      { phone: contains },
      { address_line_1: contains },
      { address_line_2: contains },
      { postal_code: contains },
      { city: contains },
      { users: { is: { OR: [{ first_name: contains }, { last_name: contains }, { code: contains }, { email: contains }] } } },
      { stores: { is: { OR: [{ code: contains }, { name: contains }, { city: contains }] } } },
      { bons: { some: { OR: [{ bon_number: contains }, { bon_type: contains }, { status: contains }, { comment: contains }] } } },
      {
        bons: {
          some: {
            bon_lines: {
              some: {
                OR: [
                  { reference: contains },
                  { designation: contains },
                  { billing_code: contains },
                  { comment: contains },
                ],
              },
            },
          },
        },
      },
      {
        client_equipment: {
          some: {
            OR: [
              { type_materiel: contains },
              { marque: contains },
              { modele: contains },
              { num_serie: contains },
              { notes: contains },
            ],
          },
        },
      },
    ],
  };
}

export function buildClientSearchIncludes(query: string) {
  if (!query) {
    return {
      bons: {
        select: { id: true, bon_number: true, bon_type: true, bon_lines: false },
        orderBy: { updated_at: "desc" as const },
        take: 0,
      },
      client_equipment: { take: 0 },
    };
  }

  const contains = { contains: query, mode: "insensitive" as const };

  return {
    bons: {
      where: {
        OR: [
          { bon_number: contains },
          { bon_type: contains },
          { status: contains },
          { comment: contains },
          {
            bon_lines: {
              some: {
                OR: [
                  { reference: contains },
                  { designation: contains },
                  { billing_code: contains },
                  { comment: contains },
                ],
              },
            },
          },
        ],
      },
      select: {
        id: true,
        bon_number: true,
        bon_type: true,
        bon_lines: {
          where: {
            OR: [
              { reference: contains },
              { designation: contains },
              { billing_code: contains },
              { comment: contains },
            ],
          },
          select: { reference: true, designation: true, billing_code: true },
          take: 2,
        },
      },
      orderBy: { updated_at: "desc" as const },
      take: 3,
    },
    client_equipment: {
      where: {
        OR: [
          { type_materiel: contains },
          { marque: contains },
          { modele: contains },
          { num_serie: contains },
          { notes: contains },
        ],
      },
      select: { type_materiel: true, marque: true, modele: true, num_serie: true },
      orderBy: { updated_at: "desc" as const },
      take: 3,
    },
  };
}
