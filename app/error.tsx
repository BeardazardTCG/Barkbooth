"use client";

import { useEffect } from "react";

const updateMessage = "Bark Booth has been updated. Refreshing the page so you can continue.";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application or Server Action boundary failure", {
      digest: error.digest ?? "none",
      buildId: process.env.NEXT_PUBLIC_RENDER_GIT_COMMIT ?? "unknown",
      route: window.location.pathname,
    });
  }, [error]);

  return <section className="mx-auto max-w-xl px-5 py-16 text-center">
    <p className="registry-label">Reconnect safely</p>
    <h1 className="mt-3 text-3xl font-extrabold text-navy">This page needs a refresh</h1>
    <p className="mt-4 text-charcoal/70">{updateMessage}</p>
    <p className="mt-2 text-sm text-charcoal/60">Your last action will not be submitted again automatically. Files must be selected again after refreshing.</p>
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <button type="button" onClick={() => window.location.reload()} className="button-primary">Refresh page</button>
      <button type="button" onClick={reset} className="button-secondary">Try this page again</button>
    </div>
  </section>;
}
