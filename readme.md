# Payload Default Roles

Add default roles for access control on all collections.

## Options

- ### `ignoredSlugs: string[]` _Optional_

  An array of the slugs from the collections this plugin should leave untouched.<br>
  _Default: `"user"` or the collection under your config's `admin.user`_

- ### `defaultRoles: string[]` _Optional_
  An array of the roles this plugin should default access to.<br>
  _Default: `["admin", "executive"]`_

## Example

```ts
// payload.config.ts
import { buildConfig } from 'payload/config';
import { defaultAccess } from '@orelo/payload-default-roles';

export default buildConfig({
  ...yourOtherConfigs,
  plugins: [...yourOtherPlugins, defaultAccess()],
});
```

## Example with Options

```ts
export default buildConfig({
  plugins: [
    defaultAccess({
      ignoredSlugs: ['cms-user', 'admin'],
      defaultRoles: ['administrator', 'moderator'],
    }),
  ],
});
```
