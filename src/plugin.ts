import type { Config, Plugin } from 'payload/config';

const isExecutive = () => true;

const defaultAccess =
  (ignoredSlugs: string[]): Plugin =>
  (incomingConfig: Config): Config => {
    const config: Config = {
      ...incomingConfig,
      collections: incomingConfig.collections?.map(collection => {
        if (
          collection.slug === 'user' ||
          ignoredSlugs.includes(collection.slug)
        )
          return collection;
        return {
          ...collection,
          access: {
            admin: isExecutive,
            create: isExecutive,
            update: isExecutive,
            delete: isExecutive,
            read: isExecutive,
            readVersions: isExecutive,
            unlock: isExecutive,
            ...collection.access,
          },
        };
      }),
    };

    return config;
  };

export default defaultAccess;
