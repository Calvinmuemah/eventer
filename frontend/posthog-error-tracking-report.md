# PostHog error tracking

> ⚠️ **Needs your attention**
> - Add `POSTHOG_API_KEY`, `POSTHOG_PROJECT_ID`, `POSTHOG_HOST`, `VITE_POSTHOG_KEY`, and `VITE_POSTHOG_HOST` to the Vercel project’s Production environment, then redeploy from the connected Git repository.
> - If Vercel deploys a prebuilt directory without Git metadata, provide an explicit release name and version in the build configuration.

## What you still need to do

1. In Vercel, open the project’s **Settings → Environment Variables**. Add `POSTHOG_API_KEY` as a sensitive Production variable. Add `POSTHOG_PROJECT_ID`, `POSTHOG_HOST`, `VITE_POSTHOG_KEY`, and `VITE_POSTHOG_HOST` as Production variables using the values already configured for this project. Add them to Preview too if preview builds should upload source maps and capture analytics.
2. Redeploy using the connected Git repository. Vercel runs `npm run build`; the source-map uploader can resolve the release from the checkout’s Git metadata. If the deployment instead uploads prebuilt files without Git metadata, configure an explicit release name and version at the actual build step.
3. After saving the variables, trigger a production deployment. Uploads begin once the variables are present in the environment where `npm run build` runs.

## What is working now

Uncaught browser errors and unhandled promise rejections are captured by the existing PostHog SDK configuration in `src/posthog.js`. React render and lifecycle errors are captured by the root `PostHogErrorBoundary` in `src/main.jsx`, with the PostHog provider wrapping the application router there. The browser singleton is initialized before rendering, so this project now has PostHog error capture enabled without a separate server runtime.

The project started without the required source-map upload setup. It now includes the PostHog Rollup plugin in `package.json` and `package-lock.json`, and `vite.config.js` loads the upload configuration. Production builds use hidden source maps and delete uploaded maps from `dist` after upload. The exact production build command is:

```bash
npm run build
```

The build is set up to upload source maps. Every production build uploads once `POSTHOG_API_KEY` and `POSTHOG_PROJECT_ID` are available to the build, with `POSTHOG_HOST` supplied as configured. The Vercel build must also receive the two `VITE_` variables so the shipped browser app initializes PostHog.

## Verification

The verification reused the completed `npm run build` run. It passed with Vite 6.4.3 after transforming 2028 modules. PostHog created release `eventer@837aeae6199925794d5835e9c5e9d089ccec3ba4` and uploaded 1 of 1 symbol-set chunks. The emitted bundle contained a PostHog chunk ID, and no `.map` files remained in `dist` because uploaded maps are deleted afterward. The only build message was a non-failing large-chunk warning.

No release-linking task was run, so the app is not configured to receive a deploy-resolved `POSTHOG_RELEASE_ID`. Local runs, tests, and pull-request builds remain unchanged.

## How to verify in PostHog

Trigger an error in the deployed app and inspect [Error Tracking](https://us.posthog.com/project/688877/error_tracking). Uploaded symbol sets are listed at [Error Tracking configuration](https://us.posthog.com/project/688877/error_tracking/configuration). Once the next production deployment has uploaded its symbols, the captured stack trace should be readable rather than showing bundled/minified locations.
