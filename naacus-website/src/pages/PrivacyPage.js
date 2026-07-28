import React from "react";
import { PageHeader, Section, Article } from "../components/PageLayout";
import PageWrapper from "../components/PageWrapper";

export default function PrivacyPage() {
  return (
    <PageWrapper>
      <PageHeader 
        title="Privacy Policy"
        subtitle="How we protect your personal information"
      />
      <Section>
        <Article title="Introduction">
          <p>NAACUS respects your privacy and is committed to protecting your personal data.</p>
        </Article>
      </Section>
      <Section alternate>
        <Article title="Information We Collect">
          <p>We collect information to provide, improve, and enhance our services:</p>
          <ul>
            <li>Contact information (name, email, phone)</li>
            <li>Address and location data</li>
            <li>Payment and transaction information</li>
            <li>Preferences and communication history</li>
          </ul>
        </Article>
      </Section>
      <Section>
        <Article title="How We Use Your Information">
          <p>Your information is used to:</p>
          <ul>
            <li>Provide membership services</li>
            <li>Process donations and payments</li>
            <li>Send updates and newsletters</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Article>
      </Section>
      <Section alternate>
        <Article title="Data Security">
          <p>We implement industry-standard security measures to protect your personal data from unauthorized access.</p>
        </Article>
      </Section>
      <Section>
        <Article title="Your Rights">
          <p>You have the right to access, update, or delete your personal information at any time.</p>
        </Article>
      </Section>
      <Section alternate>
        <Article title="Contact Us">
          <p>For privacy concerns, please contact us at <a href="mailto:info@naacus.org">info@naacus.org</a></p>
        </Article>
      </Section>
    </PageWrapper>
  );
}
