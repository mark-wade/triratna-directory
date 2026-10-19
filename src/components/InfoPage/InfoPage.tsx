import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import {
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  ShareIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useInstallState } from "../../utilities/install";
import Feedback from "../Feedback/Feedback";
import InstallInstructions from "../InstallInstructions/InstallInstructions";
import ShareApp from "../ShareApp/ShareApp";

export default function InfoPage() {
  const installState = useInstallState();

  return (
    <div className="mx-auto max-w-2xl p-5 space-y-5">
      <section className="rounded-lg bg-white shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/icons/192.png"
            alt=""
            className="size-14 rounded-xl shadow-sm"
          />
          <h2 className="text-2xl font-semibold text-gray-900">
            About this app
          </h2>
        </div>
        <p>
          This app was made as a hobby project by Dhammakumāra, in
          collaboration with the Order Office, using APIs provided by
          Dharmachakra.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          Information in this app is for the sole use of members and should not
          be used for commercial purposes, including for businesses or charity
          appeals.
        </p>
      </section>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm">
        <Section
          icon={DevicePhoneMobileIcon}
          title="Install on your device"
          detail={
            installState.isStandalone || installState.justInstalled
              ? "Installed on this device"
              : "Works offline"
          }
        >
          <InstallInstructions />
        </Section>
        <Section
          icon={ShareIcon}
          title="Share this app"
          detail="Link and QR code"
        >
          <ShareApp />
        </Section>
        <Feedback className={ROW_CLASSES} defaultType="feedback">
          <RowLabel
            icon={ChatBubbleLeftRightIcon}
            title="Give feedback"
            detail="Ideas or problems"
          />
          <ChevronRightIcon
            aria-hidden="true"
            className="size-5 shrink-0 text-gray-400"
          />
        </Feedback>
        <Section
          icon={CodeBracketIcon}
          title="Contribute"
          detail="Open source on GitHub"
        >
          <p>
            The source code (but not the source data) is open and contributions
            are welcome.
          </p>
          <a
            href="https://github.com/mark-wade/triratna-directory"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            View source code
            <ArrowTopRightOnSquareIcon aria-hidden="true" className="size-4" />
          </a>
        </Section>
        <Section
          icon={ShieldCheckIcon}
          title="Privacy notice"
          detail="How your data is used"
        >
          <dl className="space-y-3 text-sm">
            {PRIVACY_NOTICE.map(({ term, description }) => (
              <div key={term}>
                <dt className="font-semibold text-gray-900">{term}</dt>
                <dd className="text-gray-600">{description}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </div>
  );
}

const ROW_CLASSES =
  "group flex w-full items-center gap-4 px-4 py-4 sm:px-6 text-left hover:bg-gray-50";

type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

function RowLabel({
  icon: Icon,
  title,
  detail,
}: {
  icon: Icon;
  title: string;
  detail: string;
}) {
  return (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-gray-900">{title}</span>
        <span className="block text-sm text-gray-500">{detail}</span>
      </span>
    </>
  );
}

function Section({
  icon,
  title,
  detail,
  children,
}: {
  icon: Icon;
  title: string;
  detail: string;
  children: React.ReactNode;
}) {
  return (
    <Disclosure as="div">
      <DisclosureButton className={ROW_CLASSES + " cursor-pointer data-open:hover:bg-white"}>
        <RowLabel icon={icon} title={title} detail={detail} />
        <ChevronDownIcon
          aria-hidden="true"
          className="size-5 shrink-0 text-gray-400 group-data-open:rotate-180"
        />
      </DisclosureButton>
      <DisclosurePanel className="px-4 pb-5 sm:pr-6 sm:pl-20">
        {children}
      </DisclosurePanel>
    </Disclosure>
  );
}

const PRIVACY_NOTICE = [
  {
    term: "Who we are",
    description:
      "The Order Directory is operated in collaboration between the Triratna Trust and Dhammakumāra who developed the app. We are responsible for protecting your data.",
  },
  {
    term: "What data we display",
    description:
      "Name, photo, ordination details, sadhana, area (location), Dharmacharini / Dharmachari, and contact details (if you have opted in).",
  },
  {
    term: "Where the data comes from",
    description:
      "Your Order Register profile on The Buddhist Centre Online.",
  },
  {
    term: "Who can see it",
    description: "Only logged-in Order Members.",
  },
  {
    term: "Where it is stored",
    description:
      "Secure AWS servers in London (UK). Some administrative access is performed in Australia. Photos may be delivered via secure global servers (CloudFront) if required for performance. No other personal data is cached globally.",
  },
  {
    term: "Your rights",
    description: (
      <>
        You can request corrections, withdraw consent, or ask for removal from
        the Directory at any time. Contact{" "}
        <a
          href="mailto:orderoffice@triratnaorder.org"
          className="text-indigo-600"
        >
          orderoffice@triratnaorder.org
        </a>
        .
      </>
    ),
  },
];
