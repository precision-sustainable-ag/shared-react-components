const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const force = args.includes('--force');
const destArg = args.find((arg) => !arg.startsWith('--'));
const dest = path.resolve(process.cwd(), destArg || 'admin-portal-backend');
const src = path.join(__dirname, '..', 'src', 'AdminPortal', 'backend');

const EXCLUDED = new Set(['node_modules', 'package-lock.json', '.env']);

if (!fs.existsSync(src)) {
  console.error(`Could not find AdminPortal backend source at ${src}`);
  process.exit(1);
}

if (fs.existsSync(dest) && fs.readdirSync(dest).length > 0 && !force) {
  console.error(`${dest} already exists and is not empty. Use --force to copy into it anyway.`);
  process.exit(1);
}

fs.cpSync(src, dest, {
  recursive: true,
  filter: (source) => !EXCLUDED.has(path.relative(src, source).split(path.sep)[0]),
});

const envPath = path.join(dest, '.env');
const envExamplePath = path.join(dest, '.env.example');
if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
}

console.log(`AdminPortal backend copied to ${dest}\n`);
console.log('Next steps:');
console.log(`  cd ${path.relative(process.cwd(), dest)}`);
console.log('  npm install');
console.log(
  '  fill in AUTH0_DOMAIN, AUTH0_AUDIENCE, AUTH0_MGMT_CLIENT_ID, AUTH0_MGMT_CLIENT_SECRET in .env',
);
console.log('  npm run dev');
console.log(
  '\nSee the "Auth0 Dashboard" setup steps in shared-react-components/src/AdminPortal/README.md',
);
