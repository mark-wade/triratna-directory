import {
  InstallState,
  detectDevice,
  dismissBanner,
  shouldShowBanner,
} from "./install";

const USER_AGENTS = {
  iPhoneSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
  iPhoneChrome:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/138.0.7204.156 Mobile/15E148 Safari/604.1",
  iPhoneFacebook:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/520.0.0.38.101]",
  iPhoneWebView:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  iPadSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15",
  macSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15",
  oldMacSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
  macChrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
  windowsEdge:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0",
  windowsFirefox:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36",
  androidSamsung:
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36",
  androidWebView:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/138.0.0.0 Mobile Safari/537.36",
};

test.each([
  ["iPhoneSafari", 5, "ios-safari", "safari"],
  ["iPhoneChrome", 5, "ios-other-browser", "chrome"],
  ["iPhoneFacebook", 5, "in-app-browser", "other"],
  ["iPhoneWebView", 5, "in-app-browser", "other"],
  ["iPadSafari", 5, "ios-safari", "safari"],
  ["macSafari", 0, "mac-safari", "safari"],
  ["oldMacSafari", 0, "unknown", "safari"],
  ["macChrome", 0, "desktop-chromium", "chrome"],
  ["windowsEdge", 0, "desktop-chromium", "edge"],
  ["windowsFirefox", 0, "desktop-firefox", "firefox"],
  ["androidChrome", 5, "android", "chrome"],
  ["androidSamsung", 5, "android", "samsung"],
  ["androidWebView", 5, "in-app-browser", "chrome"],
] as const)(
  "detects %s",
  (userAgent, maxTouchPoints, platform, browser) => {
    const device = detectDevice(USER_AGENTS[userAgent], maxTouchPoints);
    expect(device.platform).toBe(platform);
    expect(device.browser).toBe(browser);
  }
);

describe("shouldShowBanner", () => {
  const iPhone: InstallState = {
    ...detectDevice(USER_AGENTS.iPhoneSafari, 5),
    isStandalone: false,
    canPrompt: false,
    justInstalled: false,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  test("shows from the first visit", () => {
    expect(shouldShowBanner(iPhone)).toBe(true);
  });

  test("stays hidden once dismissed", () => {
    dismissBanner();
    expect(shouldShowBanner(iPhone)).toBe(false);
  });

  test("is hidden in the installed app", () => {
    expect(shouldShowBanner({ ...iPhone, isStandalone: true })).toBe(false);
    expect(shouldShowBanner({ ...iPhone, justInstalled: true })).toBe(false);
  });

  test("only shows on desktop Chromium when the browser offers installation", () => {
    const chrome: InstallState = {
      ...detectDevice(USER_AGENTS.macChrome),
      isStandalone: false,
      canPrompt: false,
      justInstalled: false,
    };
    expect(shouldShowBanner(chrome)).toBe(false);
    expect(shouldShowBanner({ ...chrome, canPrompt: true })).toBe(true);
  });

  test("is never shown in desktop Firefox", () => {
    expect(
      shouldShowBanner({
        ...detectDevice(USER_AGENTS.windowsFirefox),
        isStandalone: false,
        canPrompt: false,
        justInstalled: false,
      })
    ).toBe(false);
  });
});
