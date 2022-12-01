# Payload Default Roles

Add default roles for access control on all collections.

## Options

- ### `ignoredSlugs: string[]` _Optional_

  An array of the slugs from the collections this plugin should leave untouched.

- ### `roles: string[]` _Optional_
  An array of the roles this plugin should default access to.<br>
  _Default: `["admin", "executive"]`_

## Example

```ts
// payload.config.ts
import { buildConfig } from 'payload/config';
import { defaultAccess } from '@orelo/payload-default-roles';

export default buildConfig({
  plugins: [
    defaultAccess(), // Pass nothing to use the default options
  ],
});
```

## Example with Options

```ts
export default buildConfig({
  plugins: [
    defaultAccess({
      ignoredSlugs: ['cms-user', 'admin'],
      roles: ['administrator', 'moderator'],
    }),
  ],
});
```
