import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";
import {
  DeviceInfo,
  displayUrl,
  promptInstall,
  useInstallState,
} from "../../utilities/install";
import Button from "../Button/Button";
import { installTargetName } from "./InstallInstructions.utils";

function ShareIcon() {
  return (
    <svg
      className="inline h-6 w-6 -mt-1"
      fill="currentColor"
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Share"
    >
      <path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z" />
      <path d="M24 7h2v21h-2z" />
      <path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z" />
    </svg>
  );
}

function MenuDots({ direction }: { direction: "vertical" | "horizontal" }) {
  const Icon =
    direction === "vertical" ? EllipsisVerticalIcon : EllipsisHorizontalIcon;
  return <Icon aria-label="Menu" className="inline size-5 -mt-0.5" />;
}

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal ml-8 mt-2 space-y-1">{children}</ol>;
}

// Instructions for one kind of device. Chromium's own install dialog is handled separately.
function PlatformSteps({ device }: { device: DeviceInfo }) {
  const { platform, browser, isIOS } = device;

  switch (platform) {
    case "ios-safari":
      return (
        <Steps>
          <li>
            Tap the Share button <ShareIcon />. On newer versions of iOS it
            is inside the <MenuDots direction="horizontal" /> menu next to
            the address bar.
          </li>
          <li>
            Scroll down and tap <strong>Add to Home Screen</strong>. You
            might need to tap <strong>More</strong> first.
          </li>
          <li>
            If you see <strong>Open as Web App</strong>, make sure it is on,
            then tap <strong>Add</strong>.
          </li>
        </Steps>
      );
    case "ios-other-browser":
      return (
        <>
          <Steps>
            <li>
              {browser === "chrome" ? (
                <>
                  Tap the Share button <ShareIcon /> in the address bar.
                </>
              ) : (
                <>
                  Open the browser's menu and tap <strong>Share</strong>{" "}
                  <ShareIcon />.
                </>
              )}
            </li>
            <li>
              Tap <strong>Add to Home Screen</strong>. You might need to
              scroll down or tap <strong>More</strong> first.
            </li>
          </Steps>
          <p className="mt-2 text-sm text-gray-500">
            If you can't find it, open {displayUrl()} in Safari and install it
            from there.
          </p>
        </>
      );
    case "in-app-browser":
      return (
        <>
          <p>
            You are viewing this page inside another app, which can't install
            apps. To install:
          </p>
          <Steps>
            <li>
              Look for a menu on this screen (often{" "}
              <MenuDots direction={isIOS ? "horizontal" : "vertical"} /> or a
              compass icon) and choose{" "}
              <strong>
                Open in {isIOS ? "Safari" : "Chrome"}
              </strong>{" "}
              or <strong>Open in browser</strong>.
            </li>
            <li>
              Come back to this page to see how to install it from there.
            </li>
          </Steps>
          <p className="mt-2 text-sm text-gray-500">
            You can also type {displayUrl()} into{" "}
            {isIOS ? "Safari" : "your browser"} yourself.
          </p>
        </>
      );
    case "android":
      return (
        <Steps>
          {browser === "samsung" ? (
            <>
              <li>
                Tap the menu button (three lines) at the bottom of the screen.
              </li>
              <li>
                Tap <strong>Add page to</strong>, then{" "}
                <strong>Home screen</strong>.
              </li>
            </>
          ) : browser === "edge" ? (
            <>
              <li>
                Tap the <MenuDots direction="horizontal" /> menu at the bottom
                of the screen.
              </li>
              <li>
                Tap <strong>Add to phone</strong>.
              </li>
            </>
          ) : browser === "chrome" || browser === "firefox" ? (
            <>
              <li>
                Tap the <MenuDots direction="vertical" /> menu.
              </li>
              <li>
                Tap <strong>Add to Home screen</strong> (or{" "}
                <strong>Install app</strong>), then{" "}
                <strong>Install</strong>.
              </li>
            </>
          ) : (
            <>
              <li>Open your browser's menu.</li>
              <li>
                Look for <strong>Install app</strong> or{" "}
                <strong>Add to Home screen</strong>.
              </li>
            </>
          )}
        </Steps>
      );
    case "mac-safari":
      return (
        <Steps>
          <li>
            In the menu bar, choose <strong>File</strong>, then{" "}
            <strong>Add to Dock</strong>. You can also click the Share button{" "}
            <ShareIcon /> in the toolbar.
          </li>
          <li>
            Click <strong>Add</strong>.
          </li>
        </Steps>
      );
    case "desktop-chromium":
      return (
        <>
          <Steps>
            {browser === "edge" ? (
              <li>
                Click the <strong>App available</strong> icon at the right of
                the address bar, or open the{" "}
                <MenuDots direction="horizontal" /> menu and choose{" "}
                <strong>Apps</strong>, then{" "}
                <strong>Install this site as an app</strong>.
              </li>
            ) : (
              <li>
                Click the install icon at the right of the address bar, or open
                the <MenuDots direction="vertical" /> menu and choose{" "}
                <strong>Cast, save and share</strong>, then{" "}
                <strong>Install page as app</strong>.
              </li>
            )}
            <li>
              Click <strong>Install</strong>.
            </li>
          </Steps>
          <p className="mt-2 text-sm text-gray-500">
            If the app is already installed, the same place will offer to open
            it instead.
          </p>
        </>
      );
    case "desktop-firefox":
      return (
        <p>
          Firefox has limited support for installing web apps. The easiest way
          is to open {displayUrl()} in Chrome or Edge (or Safari on a Mac) and
          install it from there.
        </p>
      );
    case "unknown":
      return (
        <p>
          Open {displayUrl()} in Safari on an iPhone, iPad or Mac, or in Chrome
          or Edge on other devices, and look for{" "}
          <strong>Install</strong> or <strong>Add to Home Screen</strong>.
        </p>
      );
  }
}

// A representative device for each group listed under "Installing on a different device?"
const OTHER_DEVICES: { title: string; openIn: string; device: DeviceInfo }[] = [
  {
    title: "iPhone or iPad",
    openIn: "Safari",
    device: { platform: "ios-safari", browser: "safari", isIOS: true, isAndroid: false },
  },
  {
    title: "Android",
    openIn: "Chrome",
    device: { platform: "android", browser: "chrome", isIOS: false, isAndroid: true },
  },
  {
    title: "Mac",
    openIn: "Safari",
    device: { platform: "mac-safari", browser: "safari", isIOS: false, isAndroid: false },
  },
  {
    title: "Windows, Linux, or Chromebook",
    openIn: "Chrome",
    device: { platform: "desktop-chromium", browser: "chrome", isIOS: false, isAndroid: false },
  },
];

export default function InstallInstructions() {
  const installState = useInstallState();

  return (
    <div>
      {installState.isStandalone ? (
        <p>You are using the installed app on this device.</p>
      ) : installState.justInstalled ? (
        <p>
          The app is installed. You can now open it from your{" "}
          {installTargetName(installState)}.
        </p>
      ) : installState.canPrompt ? (
        <>
          <p>
            Install the app on this device to open it straight from your{" "}
            {installTargetName(installState)}. It works without a network
            connection.
          </p>
          <Button
            buttonStyle="primary"
            className="mt-3 px-3.5 py-2.5"
            onClick={() => promptInstall()}
          >
            Install app
          </Button>
        </>
      ) : (
        <>
          <p className="mb-2">
            The app can be installed on this device and works without a network
            connection.
          </p>
          <PlatformSteps device={installState} />
        </>
      )}
      <Disclosure
        as="div"
        className="mt-4"
        defaultOpen={installState.platform === "unknown"}
      >
        <DisclosureButton className="group cursor-pointer inline-flex items-center text-sm text-indigo-600">
          Installing on a different device?
          <ChevronDownIcon
            aria-hidden="true"
            className="size-5 group-data-open:rotate-180"
          />
        </DisclosureButton>
        <DisclosurePanel className="mt-2">
          {OTHER_DEVICES.map(({ title, openIn, device }) => (
            <div key={title} className="pb-4">
              <h4 className="font-semibold">{title}</h4>
              <p>
                Open {displayUrl()} in {openIn}, then:
              </p>
              <PlatformSteps device={device} />
            </div>
          ))}
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}
