import posthog from './posthog';

const info = (message, attributes) => {
  posthog?.logger?.info(message, attributes);
};

export const posthogLogger = { info };
