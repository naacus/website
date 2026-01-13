import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  makeStyles,
  shorthands,
  tokens,
  Text,
  Card,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import { dataService } from '../services/dataService';

const useStyles = makeStyles({
  leadership: {
    backgroundColor: '#faf9f8',
    ...shorthands.padding('50px', '20px'),
    '@media (max-width: 768px)': {
      padding: '40px 0',
    },
  },
  leadershipTitle: {
    fontSize: '2.75rem',
    textAlign: 'center',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    display: 'block',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: '1.75rem',
    },
  },
  leadershipContent: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  leadershipIntro: {
    fontSize: '1.125rem',
    lineHeight: '1.7',
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
    marginBottom: '40px',
    maxWidth: '800px',
    ...shorthands.margin('0', 'auto', '40px'),
    display: 'block',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    marginTop: '40px',
    marginBottom: '24px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    textAlign: 'center',
    display: 'block',
  },
  boardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    ...shorthands.gap('24px'),
    marginBottom: '40px',
  },
  boardMember: {
    ...shorthands.transition('all', '0.3s', 'ease'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    ...shorthands.borderRadius('8px'),
    ...shorthands.overflow('hidden'),
    textAlign: 'center',
    '--fui-Card--size': '0px',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
  },
  photo: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    display: 'block',
  },
  photoPlaceholder: {
    width: '100%',
    height: '220px',
    background: 'linear-gradient(180deg, #e6f0ff 0%, #cbd5e1 100%)',
    display: 'block',
  },
  memberBody: {
    ...shorthands.padding('16px', '16px', '8px'),
  },
  memberName: {
    fontSize: '1.125rem',
    marginBottom: '8px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    display: 'block',
  },
  memberTitle: {
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: tokens.colorNeutralForeground2,
    display: 'block',
  },
  memberContact: {
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: tokens.colorNeutralForeground2,
    display: 'block',
    marginTop: '6px',
  },
  readMoreBtn: {
    marginTop: '12px',
    width: '100%',
  },
  dialogTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  dialogSurface: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: '600px',
    '@media (max-width: 768px)': {
      maxWidth: '95vw',
    },
  },
  dialogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...shorthands.padding('20px', '24px'),
    borderBottom: '1px solid #e5e5e5',
    flex: 'none',
    gap: '16px',
  },
  dialogHeaderLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    flex: 1,
  },
  dialogHeaderRight: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    flexShrink: 0,
  },
  dialogCloseButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForeground2,
    '&:hover': {
      color: tokens.colorNeutralForeground1,
    },
    flexShrink: 0,
  },
  dialogContentBody: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    overflowY: 'auto',
    ...shorthands.gap('16px'),
    ...shorthands.padding('24px'),
  },
  dialogActions: {
    display: 'flex',
    ...shorthands.gap('12px'),
    justifyContent: 'flex-end',
    ...shorthands.padding('24px'),
    borderTop: '1px solid #e5e5e5',
    flex: 'none',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  dialogMemberTitle: {
    fontSize: '1rem',
    fontWeight: '500',
    color: tokens.colorNeutralForeground1,
  },
  dialogSectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '12px',
    color: tokens.colorNeutralForeground1,
    display: 'block',
  },
  dialogText: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
    marginBottom: '0px',
    display: 'block',
  },
  dialogContactLabel: {
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: tokens.colorNeutralForeground1,
    display: 'block',
  },
  dialogContactItem: {
    fontSize: '0.9rem',
    color: tokens.colorNeutralForeground2,
    marginBottom: '4px',
    display: 'block',
  },
  contactLink: {
    color: '#0067b8',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

function Leadership() {
  const { t } = useTranslation();
  const styles = useStyles();
  const [selectedMember, setSelectedMember] = useState(null);

  const executiveBoard = dataService.getLeadershipBoard();
  const spiritualAdvisers = dataService.getLeadershipAdvisers();
  const ministryCoordinations = dataService.getLeadershipCoordinations();

  return (
    <section id="leadership" className={styles.leadership}>
      <Text as="h2" className={styles.leadershipTitle}>{t('leadership.title')}</Text>
      <div className={styles.leadershipContent}>
        <Text as="p" className={styles.leadershipIntro}>
          {t('leadership.intro')}
        </Text>

        <Text as="h3" className={styles.sectionTitle}>{t('leadership.nationalExecutiveOfficers')}</Text>
        <div className={styles.boardGrid}>
          {executiveBoard.map((member) => (
            <Card key={member.name} className={styles.boardMember}>
              {member.photo ? (
                <img src={member.photo} alt={member.name} className={styles.photo} />
              ) : (
                <div className={styles.photoPlaceholder} />
              )}
              <div className={styles.memberBody}>
                <Text className={styles.memberName}>{member.name}</Text>
                <Text className={styles.memberTitle}>{member.title}</Text>
                {member.phone && <Text className={styles.memberContact}>{member.phone}</Text>}
                {member.email && <Text className={styles.memberContact}><a href={`mailto:${member.email}`} className={styles.contactLink}>{member.email}</a></Text>}
                <Button
                  className={styles.readMoreBtn}
                  appearance="primary"
                  onClick={() => setSelectedMember(member)}
                >
                  Read More
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Text as="h3" className={styles.sectionTitle}>{t('leadership.ministryCoordinations')}</Text>
        <div className={styles.boardGrid}>
          {ministryCoordinations.map((member) => (
            <Card key={`${member.title}-${member.name}`} className={styles.boardMember}>
              {member.photo ? (
                <img src={member.photo} alt={member.name} className={styles.photo} />
              ) : (
                <div className={styles.photoPlaceholder} />
              )}
              <div className={styles.memberBody}>
                <Text className={styles.memberName}>{member.name}</Text>
                <Text className={styles.memberTitle}>{member.title}</Text>
                <Text className={styles.memberContact} style={{ color: member.location ? 'inherit' : '#999', fontStyle: member.location ? 'normal' : 'italic' }}>
                  {member.location || 'Location not available'}
                </Text>
                <Text className={styles.memberContact} style={{ color: member.phone ? 'inherit' : '#999', fontStyle: member.phone ? 'normal' : 'italic' }}>
                  {member.phone || 'Phone not available'}
                </Text>
                <Text className={styles.memberContact} style={{ color: member.email ? 'inherit' : '#999', fontStyle: member.email ? 'normal' : 'italic' }}>
                  {member.email ? <a href={`mailto:${member.email}`} className={styles.contactLink}>{member.email}</a> : 'Email not available'}
                </Text>
                <Button
                  className={styles.readMoreBtn}
                  appearance="primary"
                  onClick={() => setSelectedMember(member)}
                >
                  Read More
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Text as="h3" className={styles.sectionTitle}>{t('leadership.nationalAdvisoryBoard')}</Text>
        <div id="national-advisory-board" className={styles.boardGrid}>
          {spiritualAdvisers.map((member) => (
            <Card key={member.name} className={styles.boardMember}>
              {member.photo ? (
                <img src={member.photo} alt={member.name} className={styles.photo} />
              ) : (
                <div className={styles.photoPlaceholder} />
              )}
              <div className={styles.memberBody}>
                <Text className={styles.memberName}>{member.name}</Text>
                <Text className={styles.memberTitle}>{member.title}</Text>
                {member.phone && <Text className={styles.memberContact}>{member.phone}</Text>}
                {member.email && <Text className={styles.memberContact}><a href={`mailto:${member.email}`} className={styles.contactLink}>{member.email}</a></Text>}
                <Button
                  className={styles.readMoreBtn}
                  appearance="primary"
                  onClick={() => setSelectedMember(member)}
                >
                  Read More
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedMember && (
        <Dialog open={true} onOpenChange={(event, data) => !data.open && setSelectedMember(null)}>
          <DialogSurface className={styles.dialogSurface}>
            <div className={styles.dialogHeader}>
              <div className={styles.dialogHeaderLeft}>
                <DialogTitle className={styles.dialogTitle}>
                  {selectedMember.name}
                </DialogTitle>
              </div>
              <Button
                icon={<Dismiss24Regular />}
                appearance="subtle"
                onClick={() => setSelectedMember(null)}
                className={styles.dialogCloseButton}
              />
            </div>
            <DialogBody className={styles.dialogContentBody}>
              <div className={styles.dialogContent}>
                <div>
                  <Text as="p" className={styles.dialogMemberTitle}>
                    {selectedMember.title}
                  </Text>
                </div>

                {selectedMember.bio && (
                  <>
                    <Text as="h4" className={styles.dialogSectionTitle}>
                      {t('leadership.aboutLabel')}
                    </Text>
                    {selectedMember.bio.split('\n').map((paragraph, index) => (
                      <Text key={index} as="p" className={styles.dialogText}>
                        {paragraph}
                      </Text>
                    ))}
                  </>
                )}

                <div style={{ clear: 'both' }}>
                  <Text as="h4" className={styles.dialogContactLabel}>
                    {t('leadership.contactLabel')}
                  </Text>
                  {selectedMember.phone && (
                    <Text as="p" className={styles.dialogContactItem}>
                      <strong>{t('leadership.phone')}:</strong> {selectedMember.phone}
                    </Text>
                  )}
                  {selectedMember.email && (
                    <Text as="p" className={styles.dialogContactItem}>
                      <strong>{t('leadership.email')}:</strong> <a href={`mailto:${selectedMember.email}`} className={styles.contactLink}>{selectedMember.email}</a>
                    </Text>
                  )}
                </div>
              </div>
            </DialogBody>
            <div className={styles.dialogActions}>
              <Button appearance="secondary" onClick={() => setSelectedMember(null)}>
                {t('leadership.close')}
              </Button>
            </div>
          </DialogSurface>
        </Dialog>
      )}
    </section>
  );
}

export default Leadership;
