import { fieldAffectsData } from 'payload/dist/fields/config/types';
import type { Config } from 'payload/config';
import type { FieldAffectingData } from 'payload/dist/fields/config/types';

export const checkForRoleField = (incomingConfig: Config) => {
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
};
