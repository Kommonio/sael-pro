import type { Field } from 'payload'

export const landingPositionField: Field = {
  name: 'landingPosition',
  label: 'Home landing position',
  type: 'select',
  unique: true,
  index: true,
  options: [
    { label: 'Primary', value: 'primary' },
    { label: 'Secondary', value: 'secondary' },
  ],
  admin: {
    position: 'sidebar',
    description:
      'Optional. Only one project can occupy each position. Unassigned projects appear in the All Works field.',
  },
}
