export interface AffectText {
  id: string;
  text: string;
  color: string;
}

export const affectTextArray: AffectText[] = [
  {
    id: 'Operational',
    text: 'All Systems Operational',
    color: 'var(--green-600)',
  },
  // {
  //   id: 'Maintenance',
  //   text: 'Scheduled Maintenance',
  //   color: 'var(--blue-600)',
  // },
  {
    id: 'Incident',
    text: 'Partially Degraded Service',
    color: 'var(--yellow-600)',
  },
  {
    id: 'Outage',
    text: 'Major Outage',
    color: 'var(--red-600)',
  },
];

export const getIncidentAffect = (
  id: string,
  textOnly: boolean = false
): string | AffectText | undefined => {
  const affect = affectTextArray.find((item) => item.id === id);
  if (!affect) return undefined;
  if (textOnly) {
    return affect.text;
  }
  return affect;
};

export const affectTextIds = affectTextArray.map(({ id }) => id);
