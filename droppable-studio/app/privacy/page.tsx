import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

/* Hidden page — exists for Google's OAuth verification of the Skool
   Assistant tool. noindex, linked from nowhere, kept out of any sitemap. */
export const metadata: Metadata = {
  title: "Privacy Policy – Skool Assistant (Droppable Studio)",
  description: "How the Skool Assistant internal tool handles data.",
  robots: { index: false, follow: false },
};

const CONTACT = "lorenzogiuffrida64@gmail.com";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy – Skool Assistant (Droppable Studio)"
      updated="October 16, 2026"
    >
      <h2>Who we are</h2>
      <p>
        Skool Assistant is an internal tool operated by Lorenzo Giuffrida /
        Droppable Studio to manage the &ldquo;Droppablestudio AI
        Masterclass&rdquo; community on Skool. It is not a public product and
        is used only by its owner.
      </p>
      <p>
        Contact: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>

      <h2>What data the app accesses</h2>
      <ul>
        <li>
          <b>Google Drive, with the drive.file scope only.</b>{" "}
          The app can only
          see and manage files and folders it creates itself: a &ldquo;Skool
          Highlights&rdquo; folder where it saves media that community members
          shared. It cannot read any other files in the user&apos;s Drive.
        </li>
        <li>
          <b>Content posted in the Skool community</b>: posts, comments and
          direct messages to the owner, in order to draft replies and daily
          summaries.
        </li>
      </ul>

      <h2>How data is used</h2>
      <p>Data is used only to:</p>
      <ul>
        <li>save media shared in the community to the owner&apos;s own Google Drive;</li>
        <li>draft replies for the owner to review;</li>
        <li>send reminders and summaries to the owner.</li>
      </ul>
      <p>
        Data is never used for advertising or profiling, and it is never sold.
      </p>

      <h2>Sharing and processors</h2>
      <p>
        The app relies on the following service providers, solely to run the
        tool:
      </p>
      <ul>
        <li>
          <b>Anthropic (Claude API)</b> processes the text of community
          messages to draft replies.
        </li>
        <li>
          <b>Railway</b> provides hosting and the database where data is
          stored.
        </li>
        <li>
          <b>Telegram</b> delivers notifications to the owner.
        </li>
      </ul>
      <p>Nothing else is shared with third parties.</p>

      <h2>Google API Services User Data Policy</h2>
      <p>
        Skool Assistant&apos;s use and transfer of information received from
        Google APIs will adhere to the{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </p>

      <h2>Retention and deletion</h2>
      <p>
        Data is kept only as long as needed to run the tool. You can ask for
        your data to be deleted at any time by emailing{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. You can revoke the
        app&apos;s access to your Google account at any time at{" "}
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener"
        >
          myaccount.google.com/permissions
        </a>
        .
      </p>

      <h2>Security</h2>
      <p>
        Credentials are stored in encrypted environment variables. Access to
        the tool and its data is limited to the owner.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If this policy changes, the updated version will be published on this
        page with a new &ldquo;Last updated&rdquo; date.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or your data:{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>
    </LegalPage>
  );
}
