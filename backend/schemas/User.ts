/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/indent */
import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';

export const User = list({
    // eslint-disable-next-line @typescript-eslint/indent
    // eslint-disable-next-line @typescript-eslint/indent
    fields: {
        name: text({ isRequired: true }),
        email: text({ isRequired: true, isUnique: true }),
        password: password(),
        // TODO: add roles, cart, and orders
    },
});
