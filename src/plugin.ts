import type { Access, Config, Plugin } from 'payload/config';
import type { FieldAffectingData } from 'payload/dist/fields/config/types';
import { fieldAffectsData } from 'payload/dist/fields/config/types';

const executiveRoles = ['admin', 'executive'];
const isExecutive: Access<{ role: string }> = ({ data }) =>
  executiveRoles.includes(data?.role ?? '');

export const defaultExecutiveAccess =
  (ignoredSlugs: string[]): Plugin =>
  (incomingConfig: Config): Config => {
    const userCollectionSlug = incomingConfig.admin?.user ?? 'user';
    const userCollection = incomingConfig.collections?.find(
      collection => collection.slug === userCollectionSlug
    );

    const dataFields = userCollection?.fields.filter(fieldAffectsData) as
      | FieldAffectingData[]
      | undefined;

    const hasRoleField = dataFields?.map(field => field.name).includes('role');
    if (!hasRoleField)
      throw new Error('Users collection must have a field named `role`');

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
