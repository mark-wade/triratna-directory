import { Link } from "react-router";
import Feedback from "../Feedback/Feedback";

// TODO: Rethink this
// TODO: That Github link is not live

export default function InfoPage() {
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
          >
            Dhammakumāra
          </Link>{" "}
          in collaboration with the Order Office. The{" "}
          <a
            href="https://github.com/mark-wade/order-directory"
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
        <div className="mb-5">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            How to install on your device
          </h2>
          <p>
            This app can be installed on your device and works without a network
            connection.
          </p>
        </div>
        <div className="pb-5">
          <h3 className="text-xl">On iPhone, iPad, or Mac</h3>
          <ol className="list-decimal ml-8 mt-2">
            <li>Open the app in Safari</li>
            <li>
              Tap the Share icon, it looks like this:
              <svg
                className="inline h-8 w-8"
                fill="#000000"
                width="800px"
                height="800px"
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z" />
                <path d="M24 7h2v21h-2z" />
                <path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z" />
              </svg>
            </li>
            <li>Tap Add to Home Screen (or Add to Dock on Mac)</li>
          </ol>
        </div>
        <div className="pb-5">
          <h3 className="text-xl">On Android</h3>
          <p>
            On Android, the way to install differs by device and browser. Open
            the app in your browser and look for prompts with the words{" "}
            <strong>Install</strong> or <strong>Add to Home Screen</strong>.
          </p>
        </div>
        <div className="pb-5">
          <h3 className="text-xl">On Linux, Windows, and Chromebooks</h3>
          <ol className="list-decimal ml-8 mt-2">
            <li>Open the app in Google Chrome or Microsoft Edge</li>
            <li>Click on the install icon in the address bar</li>
          </ol>
        </div>
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
