export const STALE_DEPLOYMENT_MESSAGE = "Bark Booth has been updated. Refreshing the page so you can continue.";
export const NETWORK_FAILURE_MESSAGE = "We could not reach Bark Booth. Your changes were not submitted. Please try again.";

export function isStaleServerActionError(error: unknown) {
  const message = error instanceof Error ? `${error.name} ${error.message}` : String(error);
  return /failed to find server action|older or newer deployment|server action.*not found/i.test(message);
}

/** Runs a mutation once. Recovery may reload the GET page, but never repeats the mutation. */
export async function runActionOnce<T>(action: () => Promise<T>) {
  try {
    return { result: await action(), error: null, reload: false } as const;
  } catch (error) {
    const reload = isStaleServerActionError(error);
    return { result: null, error: reload ? STALE_DEPLOYMENT_MESSAGE : NETWORK_FAILURE_MESSAGE, reload } as const;
  }
}
