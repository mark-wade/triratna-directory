import { DeviceInfo } from "../../utilities/install";

// Where the installed app will appear, e.g. "Add the app to your Home Screen"
export function installTargetName(device: DeviceInfo) {
  return device.platform === "mac-safari"
    ? "Dock"
    : device.platform === "desktop-chromium" ||
      device.platform === "desktop-firefox"
    ? "computer"
    : "Home Screen";
}
