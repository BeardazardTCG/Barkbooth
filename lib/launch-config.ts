export const launchConfig = {
  banner: {
    visible: process.env.NEXT_PUBLIC_LAUNCH_BANNER_VISIBLE !== "false",
    title: "Bark Booth is live and still growing",
    message: "Standard dog profiles are available now. Rescue, breeder, foster and professional areas are still being completed as part of our launch work. Some controls may be adjusted during launch.",
  },
  copy: {
    competition: "Free sign-up and free photo competition entry with real prizes. Register a Bark Booth dog identity and submit a themed photograph. Planned monthly competitions will follow as Bark Booth grows. Digital profile awards are coming later.",
  },
} as const;

function optionalUrl(input?: string) { const value = input?.trim(); if (!value) return null; try { const url = new URL(value); return url.protocol === "https:" ? url.toString() : null; } catch { return null; } }
function optionalEmail(input?: string) { const value = input?.trim(); return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : null; }
export function supportConfig() {
  return {
    instagramUrl: optionalUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL), facebookPageUrl: optionalUrl(process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL), facebookGroupUrl: optionalUrl(process.env.NEXT_PUBLIC_FACEBOOK_GROUP_URL),
    businessEmail: optionalEmail(process.env.NEXT_PUBLIC_BUSINESS_EMAIL), supportEmail: optionalEmail(process.env.NEXT_PUBLIC_SUPPORT_EMAIL) ?? "barkbooth-help@outlook.com", problemReportEmail: optionalEmail(process.env.NEXT_PUBLIC_PROBLEM_REPORT_EMAIL) ?? "barkbooth-help@outlook.com",
  };
}
export const problemReportBody = "Page or feature:\n\nWhat happened:\n\nWhat did you expect:\n\nDevice:\n\nBrowser:\n\nScreenshot available: Yes / No";
export function reportProblemHref(email: string) { return `mailto:${email}?subject=${encodeURIComponent("Bark Booth problem report")}&body=${encodeURIComponent(problemReportBody)}`; }
export const evidenceProviderSuggestions = ["The Kennel Club", "American Kennel Club", "Crufts", "Embark", "Wisdom Panel", "LABOKLIN", "Animal Genetics", "Breed club", "Other"] as const;
export const launchPhotoGuidelines = "Submit a genuine photograph of your own registered Bark Booth dog that matches the theme. Basic cropping, brightness and colour correction are allowed. AI-generated or AI-enhanced images, heavy manipulation, and adding or removing objects are not allowed. You must have the right to submit the image and permit its competition display.";
