# npm release procedure

This repository validates the actual npm tarball in Node CI. The verification
installs it in a separate consumer project without development dependencies,
then checks its public entry points. TypeScript packages also verify declarations
and the declared ESM entry. `npm run test:package` prints the candidate tarball
path, integrity and file list.

## Prepare the candidate

1. Start from the reviewed commit and a clean checkout.
2. For the November Node security response, confirm the official fixed Node
   release and update `.nvmrc` before the final release validation. A package
   does not embed the Node executable; republishing alone does not patch a
   consumer's Node runtime.
3. Check the exact candidate against the official registry immediately before
   publication (replace 1.3.4 with the final candidate):
   `npm view parameter-reduction@1.3.4 version --registry=https://registry.npmjs.org/`.
   Also retrieve the full history with
   `npm view parameter-reduction versions --json --registry=https://registry.npmjs.org/`.
   Stop if the candidate exists under any tag or in that history. Proceed only
   when the package history lookup succeeds and excludes the candidate, and
   the exact lookup reports no matching version. Authentication, network and
   other lookup failures are not evidence that a version is unused. A version
   previously published and then unpublished must not be reused either.
   Update package.json and package-lock.json together. The current version is
   a release candidate; latest/dist-tags alone cannot establish availability.
4. Run `npm ci --registry=https://npm.flatt.tech/ --no-audit --no-fund`, the
   repository tests, and `npm run test:package`. Inspect the reported tarball
   file list and integrity. Confirm the same commit's Node CI succeeds.
5. Run `npm publish <verified-tarball> --dry-run --ignore-scripts --registry=https://registry.npmjs.org/ --access=public --tag=latest`.
   A dry run checks packaging; it does not prove authentication or publish
   authorization.

## Publish the reviewed artifact

The intended route is the maintainer's authenticated npm CLI, with 2FA.
Check `npm whoami --registry=https://registry.npmjs.org/` and package write
access immediately before release. If a fresh login is needed, obtain the
user's confirmation for that authentication attempt before opening the default
external browser; the user completes sign-in and 2FA.

After the user approves the concrete version and artifact, publish that exact
verified tarball with the dry-run command above minus `--dry-run`. Complete any
required 2FA interaction. Do not rebuild or silently change the artifact between
validation and publication. Record the commit, Node/npm versions, package
version, tarball integrity and published dist-tag.

After publication, compare registry version/integrity, install the exact released
version in a fresh consumer, and rerun the consumer checks. Review downstream
dependency updates separately. An npm version cannot be overwritten.

CI has no automatic publish job. This preparation neither publishes the
candidate nor changes npm account settings.
