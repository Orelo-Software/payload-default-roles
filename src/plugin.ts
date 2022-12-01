import type { Access, Config, Plugin } from 'payload/config';
import { checkForRoleField } from './util/checks';

const executiveRoles = ['admin', 'executive'];

interface Options {
  /** The slugs of the collections you want to ignore.
   * @Defaults none */
  ignoredSlugs?: string[];
  /** The roles to give default access to if no access is specified in the collection.
   * @defaults `['admin', 'executive']` */
  roles?: string[];
}

export const defaultExecutiveAccess =
  ({ ignoredSlugs, roles }: Options = {}): Plugin =>
  (incomingConfig: Config): Config => {
    checkForRoleField(incomingConfig);

    const defaultRoles = roles || executiveRoles;
    const slugsToIgnore = ignoredSlugs;

    const isExecutive: Access<any, { role: string }> = ({ req }) =>
      defaultRoles.includes(req?.user?.role ?? '');

    const config: Config = {
      ...incomingConfig,
      collections: incomingConfig.collections?.map(collection => {
        if (slugsToIgnore?.includes(collection.slug)) return collection;
        return {
          ...collection,
          access: {
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
