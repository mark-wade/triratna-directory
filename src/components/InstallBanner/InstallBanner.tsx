import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  dismissBanner,
  promptInstall,
  shouldShowBanner,
  useInstallState,
} from "../../utilities/install";
import { installTargetName } from "../InstallInstructions/InstallInstructions.utils";
import Button from "../Button/Button";
import InstallDialog from "../InstallDialog/InstallDialog";

// A gentle nudge to install, shown in the browser (never in the installed app)
export default function InstallBanner() {
  const installState = useInstallState();
  const [dismissed, setDismissed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (dismissed || !shouldShowBanner(installState)) {
    return <InstallDialog open={dialogOpen} setOpen={setDialogOpen} />;
  }

  function close() {
    dismissBanner();
    setDismissed(true);
  }

  async function install() {
    if (installState.canPrompt) {
      const outcome = await promptInstall();
      if (outcome === "accepted") {
        close();
      }
    } else {
      setDialogOpen(true);
    }
  }

  const inAppBrowser = installState.platform === "in-app-browser";

  return (
    <>
      <div className="fixed z-30 inset-x-2 bottom-[calc(62px+env(safe-area-inset-bottom))] split:bottom-4 split:left-auto split:right-4 split:max-w-sm rounded-lg bg-white p-4 shadow-lg outline outline-black/5">
        <div className="flex items-start">
          <img
            src="/icons/192.png"
            alt=""
            className="size-10 shrink-0 rounded-lg"
          />
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              Install the app
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {inAppBrowser
                ? "Open this page in your browser to add the app to your Home Screen."
                : `Add the app to your ${installTargetName(installState)} for quick access, even without a network connection.`}
            </p>
            <div className="mt-3 flex gap-3">
              <Button
                buttonStyle="primary"
                className="px-3 py-2"
                onClick={install}
              >
                {installState.canPrompt ? "Install" : "Show me how"}
              </Button>
              <Button buttonStyle="secondary" className="px-3 py-2" onClick={close}>
                Not now
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="-mr-1 -mt-1 cursor-pointer rounded-md p-1 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <XMarkIcon aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
      <InstallDialog open={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
}
