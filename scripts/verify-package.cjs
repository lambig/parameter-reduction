const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const pkg = require(path.join(root, 'package.json'));
const npm = process.env.npm_execpath;
assert.ok(npm, 'Run through npm run test:package');
const runNpm = (args, cwd = root, capture = false) => execFileSync(process.execPath, [npm, ...args], {
    cwd, encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit'
});
runNpm(['run', 'prepack', '--if-present']);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), `${pkg.name}-package-`));
const [packed] = JSON.parse(runNpm(['pack', '--ignore-scripts', '--json', '--pack-destination', temp], root, true));
const files = new Set(packed.files.map(file => file.path));
for (const entry of [pkg.main, pkg.module, pkg.types].filter(Boolean)) {
    assert.ok(files.has(entry), `Missing declared package entry: ${entry}`);
}
for (const file of files) {
    assert.ok(!/(^|\/)(test|tests|\.github)(\/|$)/.test(file), `Unexpected package file: ${file}`);
}
const consumer = path.join(temp, 'consumer');
fs.mkdirSync(consumer);
fs.writeFileSync(path.join(consumer, 'package.json'), '{"private":true}\n');
runNpm(['install', path.join(temp, packed.filename), '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', '--registry=https://npm.flatt.tech/'], consumer);
fs.copyFileSync(path.join(__dirname, 'package-consumer.cjs'), path.join(consumer, 'check.cjs'));
execFileSync(process.execPath, ['check.cjs'], { cwd: consumer, stdio: 'inherit' });
if (pkg.types) {
    const fixture = pkg.name === 'toolbox-ts'
        ? 'import { notNull } from "toolbox-ts"; const result: boolean = notNull(null);\n'
        : 'import { Id, DomainObject } from "ez-clean-kit"; declare const id: Id<any>; const value: string = id.value(); const object: DomainObject<any> = id;\n';
    fs.writeFileSync(path.join(consumer, 'check.ts'), fixture);
    execFileSync(process.execPath, [path.join(root, 'node_modules/typescript/bin/tsc'), '--strict', '--noEmit', '--target', 'es2019', '--module', 'commonjs', '--moduleResolution', 'node', 'check.ts'], { cwd: consumer, stdio: 'inherit' });
}
console.log(JSON.stringify({ name: pkg.name, version: pkg.version, tarball: path.join(temp, packed.filename), integrity: packed.integrity, files: [...files], consumerCheck: 'passed' }, null, 2));
