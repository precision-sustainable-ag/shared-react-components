# Local Development Setup

This document introduce a way for local development and testing the shared components in any project that imports it.

---

## 1. Consuming App Configuration

Create `vite.local.config.js` in the root directory of the consuming app:


```javascript
import { defineConfig, mergeConfig, searchForWorkspaceRoot } from 'vite';
import baseConfig from './vite.config.js';

export default defineConfig(async (env) => {
  const resolvedBase = typeof baseConfig === 'function' ? await baseConfig(env) : baseConfig;

  return mergeConfig(resolvedBase, {
    resolve: {
      alias: {
        // paste your local shared component repo here
        'shared-react-components/src': '....../shared-react-components/src',
      },
      dedupe: [
        // paste any dependencies in the shared component repo's package.json
        // e.g., 
        // '@auth0/auth0-react',
        // '@emotion/react',
        // ...
      ],
    },
    server: {
      fs: {
        allow: [
          searchForWorkspaceRoot(process.cwd()),
          // paste the path of the shared component repo's root
          '...../shared-react-components',
        ],
      },
    },
  });
});
```

This config creates a link from the project to the local shared component repo, so when you made any changes in the shared component repo, it'll instantly reflected in the imported project.

---

## 2. Ignore the Local Configuration

Add `vite.local.config.js` to the consuming app's `.gitignore` to prevent committing it to git:

```gitignore
# Local test config
vite.local.config.js
```

Alternatively, add the config to `.git/info/exclude` file to let it be exluded by git.

---

## 3. Running and Switching Environments

### Active Local Development

Add the following scripts to the consuming app's `package.json`:

```json
"scripts": {
  "start": "vite",
  "start:local": "vite --config vite.local.config.js --force"
}
```

Then start the server with:

```bash
npm run start:local
```

### Switching Back to the Installed Package
To test with the actual package version installed in `node_modules`:

```bash
npm start -- --force
```

> **Cache Tip**: When switching between local clone mode and the standard package mode, run the command with `--force` and perform a hard refresh in your browser to ensure cached modules are fully cleared.
