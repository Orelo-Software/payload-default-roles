import type { Access, Config, Plugin } from 'payload/config';
import { checkForRoleField } from './util/checks';

const executiveRoles = ['admin', 'executive'];

interface Options {
  ignoredSlugs?: string[];
  defaultRoles?: string[];
}

export const defaultExecutiveAccess =
  ({ ignoredSlugs, defaultRoles }: Options = {}): Plugin =>
  (incomingConfig: Config): Config => {
    checkForRoleField(incomingConfig);

    const userCollectionSlug = incomingConfig.admin?.user ?? 'user';
    const roles = defaultRoles || executiveRoles;

    const isExecutive: Access<any, { role: string }> = ({ req }) =>
      roles.includes(req?.user?.role ?? '');

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
