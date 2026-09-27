import { QRCodeSVG } from "qrcode.react";
import { appUrl, copyLink, displayUrl, shareLink } from "../../utilities/install";
import Button from "../Button/Button";

export default function ShareApp() {
  const canShare = typeof navigator.share === "function";

  return (
    <div>
      <p>
        Other Order members can use the app at{" "}
        <a href={appUrl()} className="text-indigo-600 font-semibold">
          {displayUrl()}
        </a>{" "}
        and sign in with the same details they use for thebuddhistcentre.com.
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {canShare && (
          <Button
            buttonStyle="primary"
            className="px-3.5 py-2.5"
            onClick={() => shareLink(appUrl(), "Triratna Order")}
          >
            Share link
          </Button>
        )}
        <Button
          buttonStyle={canShare ? "secondary" : "primary"}
          className="px-3.5 py-2.5"
          onClick={() => copyLink(appUrl())}
        >
          Copy link
        </Button>
      </div>
      <p className="mt-5 text-sm text-gray-500">
        Or they can scan this code with their phone's camera:
      </p>
      <QRCodeSVG
        value={appUrl()}
        size={160}
        marginSize={2}
        title={"QR code for " + displayUrl()}
        className="mt-2 rounded-md border border-gray-200"
      />
    </div>
  );
}
