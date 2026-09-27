import { Link, useLocation } from "react-router";
import Feedback from "../Feedback/Feedback";
import InstallInstructions from "../InstallInstructions/InstallInstructions";
import ShareApp from "../ShareApp/ShareApp";

export default function InfoPage() {
  const location = useLocation();
  const previousNavs = location.state ?? [];

  return (
    <div className="bg-white h-full">
      <div className="p-5">
        <h2 className="text-3xl font-semibold text-gray-900 mb-5">
          About this app
        </h2>
        <p className="pb-2">
          This app was made as a hobby project by{" "}
          <Link
            to="/order-members/Dhammakumara"
            className="text-indigo-600"
            viewTransition
            state={[...previousNavs, "About"]}
          >
            Dhammakumāra
          </Link>{" "}
          using APIs provided by Dharmachakra on behalf of the Order Office. The{" "}
          <a
            href="https://github.com/mark-wade/triratna-directory"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600"
          >
            source code
          </a>{" "}
          (but not the source data) is open and contributions are welcome.
        </p>
        <p>
          Information in this app is for the sole use of members and should not
          be used for commercial purposes, including for businesses or charity
          appeals.
        </p>
      </div>
      <div className="p-5">
        <h2 className="text-3xl font-semibold text-gray-900 mb-5">
          Install on your device
        </h2>
        <InstallInstructions />
      </div>
      <div className="p-5">
        <h2 className="text-3xl font-semibold text-gray-900 mb-5">
          Share this app
        </h2>
        <ShareApp />
      </div>
      <div className="p-5">
        <h2 className="text-3xl font-semibold text-gray-900 mb-5">
          Give feedback or report an issue
        </h2>
        <Feedback
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          defaultType="feedback"
        />
      </div>
    </div>
  );
}
