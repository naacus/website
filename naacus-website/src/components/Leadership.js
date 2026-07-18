import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import { handleNavigation } from '../services/navigationService';

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
  trainingIntro: {
    fontSize: '1rem',
    lineHeight: '1.65',
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
    maxWidth: '840px',
    ...shorthands.margin('0', 'auto', '24px'),
    display: 'block',
  },
  trainingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    ...shorthands.gap('18px'),
    marginBottom: '40px',
  },
  trainingCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    ...shorthands.borderRadius('8px'),
    ...shorthands.padding('18px'),
    borderLeft: '4px solid #0b57d0',
  },
  trainingHeader: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('10px'),
    marginBottom: '10px',
  },
  trainingIcon: {
    fontSize: '1.25rem',
    lineHeight: '1',
  },
  trainingName: {
    fontSize: '1.08rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    display: 'block',
  },
  trainingDescription: {
    fontSize: '0.95rem',
    lineHeight: '1.55',
    color: tokens.colorNeutralForeground2,
    display: 'block',
    marginBottom: '0',
  },
  trainingPendingCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    ...shorthands.borderRadius('8px'),
    ...shorthands.padding('20px'),
    borderLeft: '4px solid #9aa7b8',
    textAlign: 'left',
  },
  trainingPendingTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
    display: 'block',
  },
  trainingPendingText: {
    fontSize: '0.95rem',
    lineHeight: '1.55',
    color: tokens.colorNeutralForeground2,
    display: 'block',
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
  ctaSection: {
    marginTop: '12px',
    ...shorthands.padding('28px', '22px'),
    backgroundColor: '#f7f9fc',
    ...shorthands.borderRadius('12px'),
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '1.55rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '10px',
    display: 'block',
  },
  ctaText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
    marginBottom: '16px',
    display: 'block',
  },
  ctaActions: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
  },
});

function Leadership() {
  const { t } = useTranslation();
  const styles = useStyles();
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState(null);
  const [executiveBoard, setExecutiveBoard] = useState([]);
  const [spiritualAdvisers, setSpiritualAdvisers] = useState([]);
  const [ministryCoordinations, setMinistryCoordinations] = useState([]);
  const [trainingPrograms, setTrainingPrograms] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadLeadership = async () => {
      const [board, advisers, coordinations, programs] = await Promise.all([
        dataService.getLeadershipBoard(),
        dataService.getLeadershipAdvisers(),
        dataService.getLeadershipCoordinations(),
        dataService.getLeadershipTrainingPrograms()
      ]);

      if (!isMounted) {
        return;
      }

      setExecutiveBoard(Array.isArray(board) ? board : []);
      setSpiritualAdvisers(Array.isArray(advisers) ? advisers : []);
      setMinistryCoordinations(Array.isArray(coordinations) ? coordinations : []);
      setTrainingPrograms(Array.isArray(programs) ? programs : []);
    };

    loadLeadership();

    return () => {
      isMounted = false;
    };
  }, []);

  const isProfileReady = (member) =>
    Boolean(member?.name && member.name !== 'Open' && member.photo && member.bio);

  const readyExecutiveBoard = executiveBoard.filter(isProfileReady);
  const readyMinistryCoordinations = ministryCoordinations.filter(isProfileReady);
  const readySpiritualAdvisers = spiritualAdvisers.filter(isProfileReady);

  const handleCtaNavigate = (path) => {
    handleNavigation({ path, sectionId: null, currentPathname: window.location.pathname, navigate });
  };

  return (
    <section id="leadership" className={styles.leadership}>
      <Text as="h2" className={styles.leadershipTitle}>{t('leadership.title')}</Text>
      <div className={styles.leadershipContent}>
        <Text as="p" className={styles.leadershipIntro}>
          {t('leadership.intro')}
        </Text>

        <Text as="h3" className={styles.sectionTitle}>{t('leadership.nationalExecutiveOfficers')}</Text>
        <div className={styles.boardGrid}>
          {readyExecutiveBoard.map((member) => (
            <Card key={member.name} className={styles.boardMember}>
              {member.photo ? (
                <img src={member.photo} alt={member.name} className={styles.photo} />
              ) : (
                <div className={styles.photoPlaceholder} />
              )}
              <div className={styles.memberBody}>
                <Text className={styles.memberName}>{member.name}</Text>
                <Text className={styles.memberTitle}>{member.title}</Text>
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
          {readyMinistryCoordinations.map((member) => (
            <Card key={`${member.title}-${member.name}`} className={styles.boardMember}>
              {member.photo ? (
                <img src={member.photo} alt={member.name} className={styles.photo} />
              ) : (
                <div className={styles.photoPlaceholder} />
              )}
              <div className={styles.memberBody}>
                <Text className={styles.memberName}>{member.name}</Text>
                <Text className={styles.memberTitle}>{member.title}</Text>
                {member.location && (
                  <Text className={styles.memberContact}>{member.location}</Text>
                )}
                {member.email && (
                  <Text className={styles.memberContact}>
                    <a href={`mailto:${member.email}`} className={styles.contactLink}>{member.email}</a>
                  </Text>
                )}
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

        {trainingPrograms.length > 0 && (
          <>
            <Text as="h3" className={styles.sectionTitle}>{t('leadership.trainingProgramsTitle')}</Text>
            <Text as="p" className={styles.trainingIntro}>{t('leadership.trainingProgramsIntro')}</Text>
            <div className={styles.trainingGrid}>
              {trainingPrograms.map((program) => (
                <Card key={program.id} className={styles.trainingCard}>
                  <div className={styles.trainingHeader}>
                    <span className={styles.trainingIcon}>{program.icon}</span>
                    <Text className={styles.trainingName}>{t(`leadership.trainingPrograms.items.${program.id}.title`)}</Text>
                  </div>
                  <Text className={styles.trainingDescription}>{t(`leadership.trainingPrograms.items.${program.id}.description`)}</Text>
                </Card>
              ))}
            </div>
          </>
        )}

        <Text as="h3" className={styles.sectionTitle}>{t('leadership.nationalAdvisoryBoard')}</Text>
        <div id="national-advisory-board" className={styles.boardGrid}>
          {readySpiritualAdvisers.map((member) => (
            <Card key={member.name} className={styles.boardMember}>
              {member.photo ? (
                <img src={member.photo} alt={member.name} className={styles.photo} />
              ) : (
                <div className={styles.photoPlaceholder} />
              )}
              <div className={styles.memberBody}>
                <Text className={styles.memberName}>{member.name}</Text>
                <Text className={styles.memberTitle}>{member.title}</Text>
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

        <div className={styles.ctaSection}>
          <Text as="h3" className={styles.ctaTitle}>{t('leadership.ctaTitle')}</Text>
          <Text as="p" className={styles.ctaText}>{t('leadership.ctaText')}</Text>
          <div className={styles.ctaActions}>
            <Button appearance="primary" onClick={() => handleCtaNavigate('/membership')}>
              {t('leadership.ctaPrimary')}
            </Button>
            <Button appearance="secondary" onClick={() => handleCtaNavigate('/volunteer')}>
              {t('leadership.ctaSecondary')}
            </Button>
          </div>
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
                    {selectedMember.bio.split('\n').filter(paragraph => paragraph.trim() !== '').map((paragraph, index) => (
                      <Text key={index} as="p" className={styles.dialogText}>
                        {paragraph}
                      </Text>
                    ))}
                  </>
                )}
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
