import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

/* Hidden page — companion to /privacy for Google's OAuth verification of
   the Skool Assistant tool. noindex, linked from nowhere, kept out of any sitemap. */
export const metadata: Metadata = {
  title: "Terms of Service – Skool Assistant (Droppable Studio)",
  description: "Terms of use for the Skool Assistant internal tool.",
  robots: { index: false, follow: false },
};

const CONTACT = "lorenzogiuffrida64@gmail.com";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Service – Skool Assistant (Droppable Studio)"
      updated="October 16, 2026"
    >
      <h2>About the service</h2>
      <p>
        Skool Assistant is an internal tool operated by Lorenzo Giuffrida /
        Droppable Studio to manage the &ldquo;Droppablestudio AI
        Masterclass&rdquo; community on Skool. It is not offered to the public
        and is used only by its owner.
      </p>

      <h2>Use of the tool</h2>
      <p>
        By connecting a Google account or other service to Skool Assistant,
        you authorize it to access only the data described in the Privacy
        Policy, for the purposes described there. The tool must not be used
        for any unlawful purpose or in breach of the terms of Skool, Google or
        any other connected service.
      </p>

      <h2>Your data</h2>
      <p>
        How data is accessed, used, stored and deleted is described in the
        Skool Assistant Privacy Policy at droppablestudio.com/privacy. You can
        revoke Google access at any time at{" "}
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener"
        >
          myaccount.google.com/permissions
        </a>
        .
      </p>

      <h2>No warranty</h2>
      <p>
        The tool is provided &ldquo;as is&rdquo;, without warranties of any
        kind. Drafted replies and summaries are generated automatically and
        may contain errors.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, Droppable Studio is not liable for any
        indirect or consequential loss arising from the use of the tool.
      </p>

      <h2>Changes and termination</h2>
      <p>
        These terms may be updated at any time; the updated version will be
        published on this page with a new &ldquo;Last updated&rdquo; date.
        The tool may be changed or discontinued at any time.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>
    </LegalPage>
  );
}
