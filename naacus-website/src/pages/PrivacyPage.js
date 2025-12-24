import React from "react";
import { useTranslation } from "react-i18next";
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
} from "@fluentui/react-components";
import PageWrapper from "../components/PageWrapper";

const useStyles = makeStyles({
  wrapper: {
    width: "100%",
  },
  container: {
    maxWidth: "900px",
    ...shorthands.margin("0", "auto"),
    ...shorthands.padding("80px", "20px"),
  },
  title: {
    fontSize: "32px",
    fontWeight: "600",
    color: tokens.colorBrandForeground1,
    marginBottom: "24px",
    display: "block",
  },
  subtitle: {
    fontSize: "14px",
    color: tokens.colorNeutralForeground2,
    marginBottom: "20px",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: tokens.colorBrandForeground1,
    marginBottom: "16px",
    marginTop: "24px",
  },
  sectionNumber: {
    fontWeight: "600",
    color: tokens.colorBrandForeground1,
  },
  paragraph: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: tokens.colorNeutralForeground1,
    marginBottom: "12px",
  },
  list: {
    marginLeft: "20px",
    marginBottom: "12px",
  },
  listItem: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: tokens.colorNeutralForeground1,
    marginBottom: "8px",
  },
  bold: {
    fontWeight: "600",
  },
  contactInfo: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding("16px"),
    ...shorthands.borderRadius("8px"),
    marginBottom: "16px",
  },
  link: {
    color: tokens.colorBrandForeground1,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  blockDisplay: {
    display: "block",
  },
  subsectionTitle: {
    fontSize: "16px",
    marginTop: "0px",
    marginBottom: "16px",
    display: "block",
  },
  subsectionParagraph: {
    marginTop: "12px",
    display: "block",
  },
  subsectionTitleWithMargin: {
    fontSize: "16px",
    marginTop: "16px",
    marginBottom: "16px",
    display: "block",
  },
  subtitleSpacing: {
    marginBottom: "30px",
    display: "block",
  },
  marginTopWrapper: {
    marginTop: "12px",
  },
});

function PrivacyPage() {
  const styles = useStyles();

  return (
    <PageWrapper className={styles.wrapper}>
      <div className={styles.container}>
        <Text className={styles.title}>Privacy Policy</Text>
        <Text className={`${styles.subtitle} ${styles.subtitleSpacing}`}>
          Last Updated: December 24, 2025
        </Text>

        {/* Section 1 */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>1.&nbsp;</span>
            <span>Introduction</span>
          </Text>
          <div style={{ marginTop: "12px" }}>
            <Text className={styles.paragraph}>
              Welcome to the National Association of African Catholics in the
              United States (NAACUS) website. We are committed to protecting
              your privacy and ensuring you have a positive experience on our
              site. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit our website and
              interact with our services.
            </Text>
            <Text className={styles.paragraph}>
              Please read this Privacy Policy carefully. If you do not agree
              with our policies and practices, please do not use our website.
            </Text>
          </div>
        </div>

        {/* Section 2 */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>2.&nbsp;</span>
            <span>Information We Collect</span>
          </Text>
          <div style={{ marginTop: "12px" }}>
            <Text
              className={`${styles.sectionTitle} ${styles.subsectionTitle}`}
            >
              2.1. Information You Provide Directly
            </Text>
            <Text
              className={`${styles.paragraph} ${styles.subsectionParagraph}`}
              style={{ marginTop: "16px", display: "block" }}
            >
              We collect information you voluntarily provide to us, including:
            </Text>
            <div className={styles.list}>
              <div className={styles.listItem}>
                <span className={styles.bold}>Membership Applications:</span>{" "}
                Name, email address, phone number, address, parish information,
                date of birth, occupation, languages spoken, emergency contact
                information, and membership preferences
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>Volunteer Applications:</span>{" "}
                Name, email address, phone number, address, professional skills,
                previous experience, areas of interest, availability, emergency
                contact information, and consent to background checks
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>Contact Forms:</span> Name, email
                address, phone number, message content, and subject matter
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>Newsletter Subscriptions:</span>{" "}
                Email address and language preferences
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>Donation Information:</span> Name,
                email, phone, address, and payment information (processed
                securely through third-party payment providers)
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>Event Registration:</span> Name,
                email, phone, dietary restrictions, and event preferences
              </div>
            </div>

            <Text
              className={`${styles.sectionTitle} ${styles.subsectionTitleWithMargin}`}
            >
              2.2. Information Collected Automatically
            </Text>
            <Text
              className={`${styles.paragraph} ${styles.subsectionParagraph}`}
              style={{ marginTop: "16px", display: "block" }}
            >
              When you visit our website, we automatically collect certain
              information about your device and usage:
            </Text>
            <div className={styles.list}>
              <div className={styles.listItem}>
                <span className={styles.bold}>Device Information:</span> Browser
                type, operating system, IP address, device type, and device
                identifiers
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>Usage Analytics:</span> Pages
                visited, time spent on pages, links clicked, referring website,
                and navigation patterns
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>
                  Cookies and Similar Technologies:
                </span>{" "}
                We use cookies, web beacons, and similar tracking technologies
                to enhance your experience and collect analytics data
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>Location Information:</span>{" "}
                General geographic location based on IP address (not precise
                location)
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>3.&nbsp;</span>
            <span>How We Use Your Information</span>
          </Text>
          <div style={{ marginTop: "12px" }}>
            <Text
              className={styles.paragraph}
              style={{ marginTop: "16px", display: "block" }}
            >
              We use the information we collect for the following purposes:
            </Text>
            <Text
              className={`${styles.sectionTitle} ${styles.subsectionTitleWithMargin}`}
            >
              3.1. Service Delivery
            </Text>
            <div className={styles.list}>
              <div className={styles.listItem}>
                Processing membership and volunteer applications
              </div>
              <div className={styles.listItem}>
                Managing event registrations and communications
              </div>
              <div className={styles.listItem}>
                Handling donations and payments
              </div>
              <div className={styles.listItem}>
                Providing customer support through our chatbot and contact forms
              </div>
              <div className={styles.listItem}>
                Delivering newsletters and communications you've subscribed to
              </div>
            </div>

            <Text
              className={`${styles.sectionTitle} ${styles.subsectionTitleWithMargin}`}
            >
              3.2. Analytics and Improvement
            </Text>
            <div className={styles.list}>
              <div className={styles.listItem}>
                Analyzing website usage patterns and user behavior
              </div>
              <div className={styles.listItem}>
                Identifying technical issues and improving website performance
              </div>
              <div className={styles.listItem}>
                Understanding user preferences and optimizing user experience
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>4.&nbsp;</span>
            <span>Sharing Your Information</span>
          </Text>
          <div style={{ marginTop: "12px" }}>
            <Text className={styles.paragraph}>
              We do not sell, trade, or rent your personal information to third
              parties. However, we may share your information with trusted
              service providers who assist us in operating our website,
              including payment processors, email service providers, cloud
              hosting providers, and analytics services. These service providers
              are contractually obligated to maintain the confidentiality of
              your information.
            </Text>
          </div>
        </div>

        {/* Section 5 */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>5.&nbsp;</span>
            <span>Cookies and Tracking Technologies</span>
          </Text>
          <div style={{ marginTop: "12px" }}>
            <Text className={styles.paragraph}>
              We use cookies to enhance your experience and collect analytics
              data. When you first visit our website, you will be presented with
              a cookie consent banner. By continuing to use the site or clicking
              "Accept," you consent to our use of cookies. You can manage your
              cookie preferences in your browser settings.
            </Text>
          </div>
        </div>

        {/* Section 6 */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>6.&nbsp;</span>
            <span>Data Security</span>
          </Text>
          <div style={{ marginTop: "12px" }}>
            <Text className={styles.paragraph}>
              We take the security of your personal information seriously and
              implement reasonable measures to protect it, including:
            </Text>
            <div className={styles.list}>
              <div className={styles.listItem}>
                <span className={styles.bold}>Encryption:</span> Sensitive
                information is encrypted during transmission using SSL/TLS
                technology
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>Secure Storage:</span> Data is
                stored on secure, access-controlled servers
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>Access Controls:</span> Only
                authorized personnel have access to personal information
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>Industry Standards:</span> We
                follow industry best practices for data protection
              </div>
            </div>
            <Text className={styles.paragraph}>
              However, no method of transmission over the internet is 100%
              secure. While we strive to protect your information, we cannot
              guarantee absolute security.
            </Text>
          </div>
        </div>

        {/* Section 7 */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>7.&nbsp;</span>
            <span>Data Retention</span>
          </Text>
          <div style={{ marginTop: "12px" }}>
            <Text className={styles.paragraph}>
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this Privacy Policy:
            </Text>
            <div className={styles.list}>
              <div className={styles.listItem}>
                <span className={styles.bold}>Membership Information:</span>{" "}
                Retained for the duration of membership and for 3 years
                thereafter
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>Volunteer Information:</span>{" "}
                Retained for 2 years after the volunteer relationship ends
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>Donation Records:</span> Retained
                for 7 years for tax and audit purposes
              </div>
              <div className={styles.listItem}>
                <span className={styles.bold}>Website Analytics:</span> Retained
                for 26 months
              </div>
            </div>
          </div>
        </div>

        {/* Section 8 */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>8.&nbsp;</span>
            <span>Your Privacy Rights</span>
          </Text>
          <div style={{ marginTop: "12px" }}>
            <Text className={styles.paragraph}>You have the right to:</Text>
            <div className={styles.list}>
              <div className={styles.listItem}>
                Access the personal information we hold about you
              </div>
              <div className={styles.listItem}>
                Request correction of inaccurate information
              </div>
              <div className={styles.listItem}>
                Request deletion of your information (subject to legal
                obligations)
              </div>
              <div className={styles.listItem}>
                Request a copy of your information in a portable format
              </div>
              <div className={styles.listItem}>
                Unsubscribe from newsletters and marketing communications
              </div>
              <div className={styles.listItem}>
                Disable cookies in your browser settings
              </div>
            </div>
          </div>
        </div>

        {/* Section 9 */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>9.&nbsp;</span>
            <span>Children's Privacy</span>
          </Text>
          <div style={{ marginTop: "12px" }}>
            <Text className={styles.paragraph}>
              Our website is not directed to individuals under the age of 13. We
              do not knowingly collect personal information from children under
              13. If we become aware that we have collected information from a
              child under 13 without parental consent, we will delete such
              information promptly.
            </Text>
          </div>
        </div>

        {/* Section 10 */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>10.&nbsp;</span>
            <span>Contact Information</span>
          </Text>
          <div style={{ marginTop: "12px" }}>
            <Text className={styles.paragraph}>
              If you have questions about this Privacy Policy or wish to
              exercise your privacy rights, please contact us:
            </Text>
            <div className={styles.contactInfo}>
              <div style={{ display: "block", marginBottom: "12px" }}>
                <Text className={`${styles.paragraph} ${styles.blockDisplay}`}>
                  <span className={styles.bold}>
                    NAACUS (National Association of African Catholics in the
                    United States)
                  </span>
                </Text>
              </div>
              <div style={{ display: "block", marginBottom: "12px" }}>
                <Text className={`${styles.paragraph} ${styles.blockDisplay}`}>
                  📧 Email:{" "}
                  <a href="mailto:info@naacus.org" className={styles.link}>
                    info@naacus.org
                  </a>
                </Text>
              </div>
              <div style={{ display: "block" }}>
                <Text className={`${styles.paragraph} ${styles.blockDisplay}`}>
                  🕐 Response Time: We will respond to your requests within 30
                  days of receipt.
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Section 11 */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>11.&nbsp;</span>
            <span>California Privacy Rights (CCPA)</span>
          </Text>
          <div style={{ marginTop: "12px" }}>
            <Text className={styles.paragraph}>
              If you are a California resident, you have additional rights under
              the California Consumer Privacy Act (CCPA), including the right to
              know what personal information is collected, the right to delete
              personal information, and the right to opt-out of the sale or
              sharing of your personal information. To exercise these rights,
              please contact us using the information above.
            </Text>
          </div>
        </div>

        {/* Section 12 */}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>12.&nbsp;</span>
            <span>Policy Changes</span>
          </Text>
          <div style={{ marginTop: "12px" }}>
            <Text className={styles.paragraph}>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, technology, or legal requirements. We
              will notify you of any material changes by posting the updated
              policy on our website and updating the "Last Updated" date. Your
              continued use of our website after any changes constitutes your
              acceptance of the updated Privacy Policy.
            </Text>
          </div>
        </div>

        {/* Footer */}
        <div
          className={styles.section}
          style={{
            marginTop: "48px",
            textAlign: "center",
            borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
            paddingTop: "32px",
          }}
        >
          <Text className={styles.paragraph}>
            <span className={styles.bold}>
              Thank you for your trust in NAACUS. We are committed to respecting
              your privacy and serving the African Catholic community with
              integrity.
            </span>
          </Text>
        </div>
      </div>
    </PageWrapper>
  );
}

export default PrivacyPage;
