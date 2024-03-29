/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/indent */
import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone/schema';
import 'dotenv/config';
import {
    withItemData,
    statelessSessions,
} from '@keystone-next/keystone/session';

import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';

const databaseURL =
    process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, // how long should they stay logged in?
    secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
        // todo: add data seeding here
    },
});

export default withAuth(
    config({
        server: {
            cors: {
                origin: [process.env.FRONTEND_URL],
                credentials: true,
            },
        },
        db: {
            adapter: 'mongoose',
            url: databaseURL,
            async onConnect(keystone) {
                if (process.argv.includes('--seed-data')) {
                    await insertSeedData(keystone);
                }
            }
        },
        lists: createSchema({
            // schema items go in here
            User,
            Product,
            ProductImage
        }),
        ui: {
            // tod o: change this for roles
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            isAccessAllowed: ({ session }) => !!session?.data,
        },
        session: withItemData(statelessSessions(sessionConfig), {
            User: 'id name email',
        }),
    })
);
