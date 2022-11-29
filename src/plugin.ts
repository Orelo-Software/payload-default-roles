import type { Access, Config, Plugin } from 'payload/config';

const executiveRoles = ['admin', 'executive'];
const isExecutive: Access<{ role: string }> = ({ data }) =>
  executiveRoles.includes(data?.role ?? '');

export const defaultExecutiveAccess =
  (ignoredSlugs: string[]): Plugin =>
  (incomingConfig: Config): Config => {
    const config: Config = {
      ...incomingConfig,
      collections: incomingConfig.collections?.map(collection => {
        if (collection.slug === 'user') return collection;
        if (ignoredSlugs.includes(collection.slug)) return collection;
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
