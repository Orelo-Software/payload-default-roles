import type { Access, Config, Plugin } from 'payload/config';
import { checkForRoleField } from './util/checks';

const executiveRoles = ['admin', 'executive'];
const isExecutive: Access<any, { role: string }> = ({ req }) =>
  executiveRoles.includes(req?.user?.role ?? '');

interface Options {
  ignoredSlugs?: string[];
}

export const defaultExecutiveAccess =
  ({ ignoredSlugs }: Options = {}): Plugin =>
  (incomingConfig: Config): Config => {
    checkForRoleField(incomingConfig);
    const userCollectionSlug = incomingConfig.admin?.user ?? 'user';

    const config: Config = {
      ...incomingConfig,
      collections: incomingConfig.collections?.map(collection => {
        if (collection.slug === userCollectionSlug) return collection;
        if (ignoredSlugs?.includes(collection.slug)) return collection;
        return {
          ...collection,
          access: {
            create: isExecutive,
            update: isExecutive,
            delete: isExecutive,
            read: isExecutive,
            readVersions: isExecutive,
            ...collection.access,
          },
        };
      }),
    };

    return config;
  };
