# Versioning and Release Rules

**Date Created:** 11/26/2026

**Date Last Modified:** 11/26/2026

## 1. Semantic Versioning Rules

Version numbers should follow the [Semantic Versioning](https://semver.org/) format `vMAJOR.MINOR.PATCH`:

```
v1.2.3
 │ │ └─ PATCH: Backwards-compatible bugfixes
 │ └─── MINOR: Backwards-compatible features or components
 └───── MAJOR: Incompatible changes or API updates
```

- **MAJOR** bumps when changes breaks consuming apps (e.g., upgrading from MUI 5/6 to MUI 9, removing or renaming component props). 
- **MINOR** bumps when adding new features that does not break existing code (e.g., adding a new component, adding optional props to an existing component).
- **PATCH** bumps when making bug fixes or style changes that do not change public behavior.


### 1.1 Prerelease Rules

**Prerelease suffix** is only appended for major, long-running milestones that will affect multiple projects (e.g. MUI v9). 

| Channel | Format Example | Meaning |
| :--- | :--- | :--- |
| **Alpha** | `v1.0.0-alpha.1` | Early Work In Progress on a branch. |
| **Beta** | `v1.0.0-beta.1` | Feature complete. Used for broader testing across apps. |
| **Release Candidate** | `v1.0.0-rc.1` | Candidate for final release. If no bugs are found during verification, this code is merged to `develop`. |

Always append a numeric counter (`.1`, `.2`) so follow-up fixes can be tagged without rewriting history.

## 2. Branch and Tag Rules

1. **Stable releases (`vMAJOR.MINOR.PATCH`) only lives on `develop`:**
   - Never tag a stable release directly on a feature branch.

2. **Prereleases (`vMAJOR.MINOR.PATCH-<channel>.<iteration>`) only lives on feature branches:**
   - Feature branches for long-running overhauls only receive prerelease tags such as `v1.0.0-alpha.1` or `v1.0.0-rc.1`.
   - Never place a prerelease tag on `develop`.

3. **Tags are strictly immutable:**
   - Once a tag is pushed to GitHub, never delete, move, or overwrite it.
   - If a bug is discovered in stable `v1.0.0`, push the fix to `develop` and tag `v1.0.1`.
   - If a bug is discovered in `v1.0.0-alpha.1`, push the fix to the branch and tag `v1.0.0-alpha.2`.

4. **Release only when consumers are affected:**
   - Only create a new release on `develop` when changes are actively consumed by applications.
   - There's no need to create a release for internal changes such as stories or documentation.

## 3. Release and Tag Workflow Example

Release and Tag in this repo: 
   1. Develop and test locally.
   2. Push updates and open a PR.
   3. After PR is reviewed and merged, create the next stable release tag on `develop` (if needed).

Update dependency in consuming project: 
   1. Update `package.json` to the new tag and run `npm install shared-react-components` to update `package-lock.json`.
   2. Create a PR in the consuming app.
   3. After the consuming app pr is merged, the update is complete.

Pre-release tags are only reserved for large, long-running changes (such as the **MUI v9 migration**) that affects several projects.

## 4. Manual Release Procedures

Currently, all releases are performed **manually**. To manually create a release, follow the steps below:

1. In GitHub, navigate to **Releases** from the repo's landing page and click **Create a new release**.
2. Click the **Select tag** dropdown:
   - Click **+ Create new tag**.
   - Verify the latest release number, then add new tag name.
3. Ensure **Target** is set to `develop`.
4. Enter the **Release title** (e.g., `v1.1.0`).
5. Click **Generate release notes** to automatically list all merged pull requests.
6. Click **Publish release**. GitHub will create the tag on `develop` and publish the release in one step.
7. In the consuming app, run `npm install shared-react-components` to update the lockfile and download the released code.

