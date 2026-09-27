import type { GlobalConfig } from 'payload'

import { isAdminOrKitchen } from '../access/roles'

export const KitchenSettings: GlobalConfig = {
  slug: 'kitchen-settings',
  label: 'Kitchen Ordering Configuration',
  access: {
    read: () => true,
    update: isAdminOrKitchen,
  },
  fields: [
    {
      name: 'isOrderingActive',
      type: 'checkbox',
      label: 'Enable Online Ordering',
      defaultValue: true,
    },
    {
      name: 'jotformId',
      type: 'text',
      label: 'JotForm ID',
      defaultValue: '201970498209159',
      required: true,
    },
    {
      name: 'backupPhone',
      type: 'text',
      label: 'Backup SMS Phone Number',
      defaultValue: '(516) 458-4941',
      required: true,
    },
    {
      name: 'announcement',
      type: 'textarea',
      label: 'Kitchen Notice / Order Hours',
      defaultValue: 'Pickup available Saturdays and Sundays after liturgy.',
    },
  ],
}
