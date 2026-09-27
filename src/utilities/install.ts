import { useSyncExternalStore } from "react";
import { toast } from "react-toastify";

// Where the user is running the app, which decides how (and whether) they can install it
export type InstallPlatform =
  | "ios-safari"
  | "ios-other-browser" // Chrome, Edge, Firefox etc. on iPhone/iPad
  | "in-app-browser" // The built-in browser inside WhatsApp, Facebook, Gmail etc., which can't install
  | "android"
  | "mac-safari"
  | "desktop-chromium" // Chrome, Edge, Opera, Brave etc. on Windows, Mac, Linux, ChromeOS
  | "desktop-firefox"
  | "unknown";

export type InstallBrowser =
  | "safari"
  | "chrome"
  | "edge"
  | "firefox"
  | "samsung"
  | "other";

export type DeviceInfo = {
  platform: InstallPlatform;
  browser: InstallBrowser;
  isIOS: boolean;
  isAndroid: boolean;
};

// Chromium fires this when the app can be installed, and lets us trigger the install dialog ourselves
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function detectDevice(
  userAgent: string,
  maxTouchPoints: number = 0
): DeviceInfo {
  // iPadOS reports itself as a Mac, but Macs don't have touch screens
  const isIOS =
    /iPhone|iPad|iPod/.test(userAgent) ||
    (/Macintosh/.test(userAgent) && maxTouchPoints > 1);
  const isAndroid = /Android/.test(userAgent);

  let browser: InstallBrowser = "other";
  if (/SamsungBrowser/.test(userAgent)) {
    browser = "samsung";
  } else if (/Edg(e|A|iOS)?\//.test(userAgent)) {
    browser = "edge";
  } else if (/Firefox|FxiOS/.test(userAgent)) {
    browser = "firefox";
  } else if (/Chrome|CriOS|Chromium/.test(userAgent)) {
    browser = "chrome";
  } else if (/Safari\//.test(userAgent)) {
    browser = "safari";
  }

  const isInAppBrowser =
    /FBAN|FBAV|Instagram|LinkedInApp|Line\/|MicroMessenger|GSA\/|Snapchat|Twitter/.test(
      userAgent
    ) ||
    (isAndroid && /; wv\)/.test(userAgent)) ||
    // Real browsers on iOS all include a Safari token; web views inside other apps usually don't
    (isIOS && !/Safari\//.test(userAgent));

  let platform: InstallPlatform;
  if (isInAppBrowser) {
    platform = "in-app-browser";
  } else if (isIOS) {
    platform = browser === "safari" ? "ios-safari" : "ios-other-browser";
  } else if (isAndroid) {
    platform = "android";
  } else if (browser === "safari" && /Macintosh/.test(userAgent)) {
    // Add to Dock arrived in Safari 17
    const version = parseInt(userAgent.match(/Version\/(\d+)/)?.[1] ?? "0");
    platform = version >= 17 ? "mac-safari" : "unknown";
  } else if (browser === "chrome" || browser === "edge") {
    platform = "desktop-chromium";
  } else if (browser === "firefox") {
    platform = "desktop-firefox";
  } else {
    platform = "unknown";
  }

  return { platform, browser, isIOS, isAndroid };
}

function detectStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.matchMedia?.("(display-mode: window-controls-overlay)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export type InstallState = DeviceInfo & {
  // Running as the installed app rather than in a browser tab
  isStandalone: boolean;
  // The browser will show its own install dialog if we call promptInstall()
  canPrompt: boolean;
  // The user installed the app during this session
  justInstalled: boolean;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let state: InstallState = {
  ...detectDevice(navigator.userAgent, navigator.maxTouchPoints),
  isStandalone: detectStandalone(),
  canPrompt: false,
  justInstalled: false,
};
const listeners = new Set<() => void>();

function setState(changes: Partial<InstallState>) {
  state = { ...state, ...changes };
  listeners.forEach((listener) => listener());
}

// These are registered as soon as the module loads because beforeinstallprompt can fire very early
window.addEventListener("beforeinstallprompt", (e) => {
  // Stop Chrome showing its own install bar, we offer installation ourselves
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
  setState({ canPrompt: true });
});
window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  setState({ canPrompt: false, justInstalled: true });
  toast("The app has been installed.", { type: "success" });
});

export function useInstallState(): InstallState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state
  );
}

export async function promptInstall() {
  if (!deferredPrompt) {
    return;
  }
  const prompt = deferredPrompt;
  deferredPrompt = null;
  await prompt.prompt();
  const { outcome } = await prompt.userChoice;
  // The event can only be used once, the browser fires another if the user can still install
  setState({ canPrompt: false });
  return outcome;
}

export function appUrl() {
  return window.location.origin + "/";
}

// The app's address without the https:// and trailing slash, for reading out or typing
export function displayUrl() {
  return appUrl().replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// Uses the device's share sheet where there is one, otherwise copies the link
export async function shareLink(url: string, title?: string) {
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title, url });
    } catch (error) {
      // AbortError just means the user closed the share sheet
      if ((error as Error).name !== "AbortError") {
        await copyLink(url);
      }
    }
  } else {
    await copyLink(url);
  }
}

export async function copyLink(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    toast("Link copied.", { type: "success" });
  } catch {
    toast("Couldn't copy the link: " + url, { type: "error" });
  }
}

const BANNER_DISMISSED_KEY = "installBannerDismissed";

export function shouldShowBanner(installState: InstallState) {
  if (installState.isStandalone || installState.justInstalled) {
    return false;
  }
  // Desktop users can install from the menu or the About page, the banner is for phones and tablets
  if (!installState.isIOS && !installState.isAndroid) {
    return false;
  }
  try {
    return localStorage.getItem(BANNER_DISMISSED_KEY) === null;
  } catch {
    // Without storage we couldn't remember a dismissal, so don't nag on every page load
    return false;
  }
}

export function dismissBanner() {
  try {
    localStorage.setItem(BANNER_DISMISSED_KEY, new Date().toISOString());
  } catch {
    // Storage can be unavailable, e.g. in private browsing
  }
}
