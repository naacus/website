import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  makeStyles,
  shorthands,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button
} from '@fluentui/react-components';
import { Navigation24Regular, ChevronDownFilled, ChevronUpFilled, Heart16Regular } from '@fluentui/react-icons';
import LanguageSwitcher from './LanguageSwitcher';
import SearchInput from './SearchInput';
import { handleNavigation, isActivePath } from '../services/navigationService';
import { useAnalytics } from '../hooks/useAnalytics';

const blinkAnimation = {
  '0%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0.6,
  },
  '100%': {
    opacity: 1,
  },
};

const useStyles = makeStyles({
  header: {
    backgroundColor: '#ffffff',
    color: '#262626',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: 'none',
    ...shorthands.borderBottom('1px', 'solid', '#e5e5e5'),
    height: '54px',
    display: 'flex',
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    maxWidth: '1600px',
    ...shorthands.margin('0', 'auto'),
    ...shorthands.padding('0', '5%'),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('24px'),
    flex: 1,
    '@media (max-width: 768px)': {
      flex: 'none',
    },
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    ...shorthands.padding('0', '12px', '0', '0'),
    backgroundColor: 'transparent',
    border: 'none',
  },
  logoImage: {
    height: '100px',
    width: '100px',
    position: 'relative',
    top: '30px',
    objectFit: 'contain',
    ...shorthands.margin('0', '12px', '0', '0'),
    borderRadius: '50%',
    '@media (max-width: 1024px)': {
      height: '53px',
      width: '53px',
      ...shorthands.margin('0', '8px', '0', '0'),
      top: '0',
    },
  },
  logoTitle: {
    fontSize: '15px',
    fontWeight: '600',
    letterSpacing: '0.3px',
    margin: 0,
    color: '#0067b8',
    whiteSpace: 'nowrap',
    '@media (max-width: 768px)': {
      fontSize: '12px',
    },
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('0'),
    ...shorthands.margin('0'),
    ...shorthands.padding('0'),
    listStyle: 'none',
    '@media (max-width: 1024px)': {
      display: 'none',
    },
  },
  navLink: {
    color: '#262626',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '400',
    ...shorthands.padding('0', '12px'),
    height: '54px',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.1s ease',
    backgroundColor: 'transparent',
    ...shorthands.border('none'),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f2f2f2',
      textDecoration: 'underline',
    },
    '&:focus-visible': {
      outline: '3px solid #0f6cbd',
      outlineOffset: '2px',
    },
  },
  navLinkActive: {
    backgroundColor: '#eaf4ff',
    color: '#0067b8',
    fontWeight: '600',
    textDecoration: 'underline',
  },
  feedbackLink: {
    backgroundColor: '#b42318',
    color: '#ffffff',
    fontWeight: '600',
    ...shorthands.padding('0', '16px'),
    ...shorthands.borderRadius('4px'),
    animationName: blinkAnimation,
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    '&:hover': {
      backgroundColor: '#8f1a12',
      textDecoration: 'none',
    },
    '&:focus-visible': {
      outline: '3px solid #0f6cbd',
      outlineOffset: '2px',
    },
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  feedbackLinkActive: {
    backgroundColor: '#8f1a12',
    color: '#ffffff',
    fontWeight: '600',
    textDecoration: 'none',
    animationName: blinkAnimation,
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    '&:focus-visible': {
      outline: '3px solid #0f6cbd',
      outlineOffset: '2px',
    },
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  donateCta: {
    backgroundColor: '#0067b8',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '13px',
    height: '32px',
    ...shorthands.padding('0', '14px'),
    ...shorthands.borderRadius('999px'),
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    boxShadow: '0 6px 16px rgba(0, 103, 184, 0.35)',
    '&:hover': {
      backgroundColor: '#005a9e',
      textDecoration: 'none',
    },
    '&:focus-visible': {
      outline: '3px solid #0f6cbd',
      outlineOffset: '2px',
    },
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  donateCtaActive: {
    backgroundColor: '#0067b8',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '13px',
    height: '32px',
    ...shorthands.padding('0', '14px'),
    ...shorthands.borderRadius('999px'),
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    boxShadow: '0 6px 16px rgba(0, 103, 184, 0.35)',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: '#005a9e',
      textDecoration: 'none',
    },
    '&:focus-visible': {
      outline: '3px solid #0f6cbd',
      outlineOffset: '2px',
    },
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    '@media (max-width: 768px)': {
      ...shorthands.gap('2px'),
      flexWrap: 'nowrap',
    },
  },
  searchContainer: {
    position: 'relative',
    '@media (max-width: 768px)': {
      width: 'auto',
      display: 'flex',
      alignItems: 'center',
    },
  },
  searchInput: {
    width: '200px',
    height: '32px',
    fontSize: '13px',
    ...shorthands.border('1px', 'solid', '#e5e5e5'),
    ...shorthands.borderRadius('2px'),
    ...shorthands.padding('0', '32px', '0', '8px'),
    '&:focus': {
      borderTopColor: '#0067b8',
      borderRightColor: '#0067b8',
      borderBottomColor: '#0067b8',
      borderLeftColor: '#0067b8',
      outline: 'none',
    },
    '@media (max-width: 768px)': {
      display: 'none !important',
    },
  },
  searchIcon: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#616161',
  },
  iconButton: {
    ...shorthands.padding('8px'),
    minWidth: 'auto',
    height: '32px',
    color: '#262626',
    '&:hover': {
      backgroundColor: '#f2f2f2',
    },
    '@media (max-width: 768px)': {
      padding: '4px',
      height: '28px',
    },
  },
  mobileMenuButton: {
    '@media (max-width: 1024px)': {
      display: 'flex',
    },
    '@media (min-width: 1025px)': {
      display: 'none',
    },
  },
  languageSwitcher: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    '@media (max-width: 768px)': {
      ...shorthands.gap('2px'),
    },
  },
  mobileMenuItemActive: {
    backgroundColor: '#eaf4ff',
    color: '#0067b8',
    fontWeight: '600',
  },
  mobileMenuItemFeedback: {
    backgroundColor: '#b42318',
    color: '#ffffff',
    fontWeight: '600',
    animationName: blinkAnimation,
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
  },
  mobileMenuItemFeedbackActive: {
    backgroundColor: '#8f1a12',
    color: '#ffffff',
    fontWeight: '600',
    animationName: blinkAnimation,
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
  },
  mobileMenuItemDonate: {
    backgroundColor: '#0067b8',
    color: '#ffffff',
    fontWeight: '700',
  },
  mobileMenuItemDonateActive: {
    backgroundColor: '#005a9e',
    color: '#ffffff',
    fontWeight: '700',
  },
  mobileDonateCta: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '28px',
      ...shorthands.padding('0', '10px'),
      ...shorthands.borderRadius('999px'),
      border: 'none',
      backgroundColor: '#0067b8',
      color: '#ffffff',
      fontSize: '12px',
      fontWeight: '700',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      ...shorthands.gap('4px'),
    },
  },
});

function Header() {
  const { t } = useTranslation();
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { trackCTA } = useAnalytics();
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [communityMenuOpen, setCommunityMenuOpen] = useState(false);
  const [getInvolvedMenuOpen, setGetInvolvedMenuOpen] = useState(false);
  const [resourcesMenuOpen, setResourcesMenuOpen] = useState(false);

  const handleNavigationHelper = (path, sectionId, label = '') => {
    if (label) {
      trackCTA('navigation', 'header_menu', label);
    }
    handleNavigation({
      path,
      sectionId,
      currentPathname: location.pathname,
      navigate,
    });
  };

  const isActivePathHelper = (path) => isActivePath(path, location.pathname);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Left Section: Logo + Navigation */}
        <div className={styles.leftSection}>
          <button
            type="button"
            className={styles.logo}
            onClick={() => handleNavigationHelper(null, 'home', 'logo_home')}
            aria-label={t('header.goHome')}
          >
            <img
              src="/images/naacus-logo.png"
              alt={t('header.title')}
              className={styles.logoImage}
            />
          </button>
          
          <nav className={styles.nav}>
            <button 
              onClick={() => handleNavigationHelper('/2025', null, 'naacus_2025')}
              className={`${styles.navLink} ${isActivePathHelper('/2025') ? styles.navLinkActive : ''}`}
            >
              {t('header.nav.naacus2025')}
            </button>

            {/* About ▾ */}
            <Menu open={aboutMenuOpen} onOpenChange={(_, data) => setAboutMenuOpen(data.open)}>
              <MenuTrigger disableButtonEnhancement>
                <button
                  className={`${styles.navLink} ${(isActivePathHelper('/about') || isActivePathHelper('/leadership')) ? styles.navLinkActive : ''}`}
                >
                  {t('header.nav.about')} {aboutMenuOpen ? <ChevronUpFilled /> : <ChevronDownFilled />}
                </button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem
                    className={isActivePathHelper('/about') ? styles.mobileMenuItemActive : undefined}
                    onClick={() => handleNavigationHelper('/about', null, 'about')}
                  >
                    {t('header.nav.about')}
                  </MenuItem>
                  <MenuItem
                    className={isActivePathHelper('/leadership') ? styles.mobileMenuItemActive : undefined}
                    onClick={() => handleNavigationHelper('/leadership', null, 'leadership')}
                  >
                    {t('header.nav.leadership')}
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>

            {/* Community ▾ */}
            <Menu open={communityMenuOpen} onOpenChange={(_, data) => setCommunityMenuOpen(data.open)}>
              <MenuTrigger disableButtonEnhancement>
                <button
                  className={`${styles.navLink} ${(isActivePathHelper('/fellowship-ministries') || isActivePathHelper('/programs-activities') || isActivePathHelper('/events')) ? styles.navLinkActive : ''}`}
                >
                  {t('header.nav.community')} {communityMenuOpen ? <ChevronUpFilled /> : <ChevronDownFilled />}
                </button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem
                    className={isActivePathHelper('/fellowship-ministries') ? styles.mobileMenuItemActive : undefined}
                    onClick={() => handleNavigationHelper('/fellowship-ministries', null, 'fellowship_ministries')}
                  >
                    {t('header.nav.ministries')}
                  </MenuItem>
                  <MenuItem
                    className={isActivePathHelper('/programs-activities') ? styles.mobileMenuItemActive : undefined}
                    onClick={() => handleNavigationHelper('/programs-activities', null, 'programs_activities')}
                  >
                    {t('header.nav.programs')}
                  </MenuItem>
                  <MenuItem
                    className={isActivePathHelper('/events') ? styles.mobileMenuItemActive : undefined}
                    onClick={() => handleNavigationHelper('/events', null, 'events')}
                  >
                    {t('header.nav.events')}
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>

            {/* Get Involved ▾ */}
            <Menu open={getInvolvedMenuOpen} onOpenChange={(_, data) => setGetInvolvedMenuOpen(data.open)}>
              <MenuTrigger disableButtonEnhancement>
                <button
                  className={`${styles.navLink} ${(isActivePathHelper('/membership') || isActivePathHelper('/volunteer') || isActivePathHelper('/dues-registration') || isActivePathHelper('/donation')) ? styles.navLinkActive : ''}`}
                >
                  {t('header.nav.getInvolved')} {getInvolvedMenuOpen ? <ChevronUpFilled /> : <ChevronDownFilled />}
                </button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem
                    className={isActivePathHelper('/membership') ? styles.mobileMenuItemActive : undefined}
                    onClick={() => handleNavigationHelper('/membership', null, 'membership')}
                  >
                    {t('header.nav.membership')}
                  </MenuItem>
                  <MenuItem
                    className={isActivePathHelper('/volunteer') ? styles.mobileMenuItemActive : undefined}
                    onClick={() => handleNavigationHelper('/volunteer', null, 'volunteer')}
                  >
                    {t('header.nav.volunteer')}
                  </MenuItem>
                  <MenuItem
                    className={isActivePathHelper('/dues-registration') ? styles.mobileMenuItemActive : undefined}
                    onClick={() => handleNavigationHelper('/dues-registration', null, 'dues_registration')}
                  >
                    {t('header.nav.duesRegistration')}
                  </MenuItem>
                  <MenuItem
                    className={isActivePathHelper('/donation') ? styles.mobileMenuItemActive : undefined}
                    onClick={() => handleNavigationHelper('/donation', null, 'donation')}
                  >
                    {t('header.donate')}
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>

            {/* Resources ▾ */}
            <Menu open={resourcesMenuOpen} onOpenChange={(_, data) => setResourcesMenuOpen(data.open)}>
              <MenuTrigger disableButtonEnhancement>
                <button
                  className={`${styles.navLink} ${(isActivePathHelper('/resources') || isActivePathHelper('/prayer-library') || isActivePathHelper('/newsletters')) ? styles.navLinkActive : ''}`}
                >
                  {t('header.nav.resources')} {resourcesMenuOpen ? <ChevronUpFilled /> : <ChevronDownFilled />}
                </button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem
                    className={isActivePathHelper('/resources') ? styles.mobileMenuItemActive : undefined}
                    onClick={() => handleNavigationHelper('/resources', null, 'resources')}
                  >
                    {t('header.nav.resources')}
                  </MenuItem>
                  <MenuItem
                    className={isActivePathHelper('/prayer-library') ? styles.mobileMenuItemActive : undefined}
                    onClick={() => handleNavigationHelper('/prayer-library', null, 'prayer_library')}
                  >
                    {t('header.nav.prayers')}
                  </MenuItem>
                  <MenuItem
                    className={isActivePathHelper('/newsletters') ? styles.mobileMenuItemActive : undefined}
                    onClick={() => handleNavigationHelper('/newsletters', null, 'newsletters')}
                  >
                    {t('header.nav.newsletters')}
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>

            <button 
              onClick={() => handleNavigationHelper('/contact', null, 'contact')}
              className={`${styles.navLink} ${isActivePathHelper('/contact') ? styles.navLinkActive : ''}`}
            >
              {t('header.nav.contact')}
            </button>
          </nav>
        </div>

        {/* Right Section: Search, Language, Sign In */}
        <div className={styles.rightSection}>
          <SearchInput />
          <button
            onClick={() => handleNavigationHelper('/donation', null, 'mobile_header_donate')}
            className={styles.mobileDonateCta}
            aria-label={t('header.donate')}
          >
            <Heart16Regular />
            {t('header.donate')}
          </button>
          <button
            onClick={() => handleNavigationHelper('/donation', null, 'donate')}
            className={isActivePathHelper('/donation') ? styles.donateCtaActive : styles.donateCta}
          >
            <Heart16Regular />
            {t('header.donate')}
          </button>
          <div className={styles.languageSwitcher}>
            <LanguageSwitcher />
          </div>
          <button 
            onClick={() => handleNavigationHelper('/feedback', null, 'feedback')}
            className={`${styles.navLink} ${isActivePathHelper('/feedback') ? styles.feedbackLinkActive : styles.feedbackLink}`}
          >
            {t('header.nav.feedback')}
          </button>

          {/* Mobile Menu */}
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button 
                appearance="subtle"
                icon={<Navigation24Regular />}
                className={styles.mobileMenuButton}
                aria-label={t('header.openNavigationMenu')}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem onClick={() => handleNavigationHelper(null, 'home', 'mobile_home')}>{t('header.nav.home')}</MenuItem>
                <MenuItem
                  className={isActivePathHelper('/donation') ? styles.mobileMenuItemDonateActive : styles.mobileMenuItemDonate}
                  onClick={() => handleNavigationHelper('/donation', null, 'mobile_donation_primary')}
                >
                  {t('header.donate')}
                </MenuItem>
                <MenuItem className={isActivePathHelper('/2025') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/2025', null, 'mobile_naacus_2025')}>{t('header.nav.naacus2025')}</MenuItem>
                {/* About group */}
                <MenuItem disabled style={{ fontWeight: 600, opacity: 0.7, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>— {t('header.nav.about')} —</MenuItem>
                <MenuItem className={isActivePathHelper('/about') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/about', null, 'mobile_about')}>&nbsp;&nbsp;{t('header.nav.about')}</MenuItem>
                <MenuItem className={isActivePathHelper('/leadership') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/leadership', null, 'mobile_leadership')}>&nbsp;&nbsp;{t('header.nav.leadership')}</MenuItem>
                {/* Community group */}
                <MenuItem disabled style={{ fontWeight: 600, opacity: 0.7, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>— {t('header.nav.community')} —</MenuItem>
                <MenuItem className={isActivePathHelper('/fellowship-ministries') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/fellowship-ministries', null, 'mobile_fellowship_ministries')}>&nbsp;&nbsp;{t('header.nav.ministries')}</MenuItem>
                <MenuItem className={isActivePathHelper('/programs-activities') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/programs-activities', null, 'mobile_programs_activities')}>&nbsp;&nbsp;{t('header.nav.programs')}</MenuItem>
                <MenuItem className={isActivePathHelper('/events') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/events', null, 'mobile_events')}>&nbsp;&nbsp;{t('header.nav.events')}</MenuItem>
                {/* Get Involved group */}
                <MenuItem disabled style={{ fontWeight: 600, opacity: 0.7, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>— {t('header.nav.getInvolved')} —</MenuItem>
                <MenuItem className={isActivePathHelper('/membership') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/membership', null, 'mobile_membership')}>&nbsp;&nbsp;{t('header.nav.membership')}</MenuItem>
                <MenuItem className={isActivePathHelper('/volunteer') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/volunteer', null, 'mobile_volunteer')}>&nbsp;&nbsp;{t('header.nav.volunteer')}</MenuItem>
                <MenuItem className={isActivePathHelper('/dues-registration') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/dues-registration', null, 'mobile_dues_registration')}>&nbsp;&nbsp;{t('header.nav.duesRegistration')}</MenuItem>
                {/* Resources group */}
                <MenuItem disabled style={{ fontWeight: 600, opacity: 0.7, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>— {t('header.nav.resources')} —</MenuItem>
                <MenuItem className={isActivePathHelper('/resources') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/resources', null, 'mobile_resources')}>&nbsp;&nbsp;{t('header.nav.resources')}</MenuItem>
                <MenuItem className={isActivePathHelper('/prayer-library') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/prayer-library', null, 'mobile_prayer_library')}>&nbsp;&nbsp;{t('header.nav.prayers')}</MenuItem>
                <MenuItem className={isActivePathHelper('/newsletters') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/newsletters', null, 'mobile_newsletters')}>&nbsp;&nbsp;{t('header.nav.newsletters')}</MenuItem>
                {/* Standalone */}
                <MenuItem className={isActivePathHelper('/contact') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/contact', null, 'mobile_contact')}>{t('header.nav.contact')}</MenuItem>
                <MenuItem className={isActivePathHelper('/feedback') ? styles.mobileMenuItemFeedbackActive : styles.mobileMenuItemFeedback} onClick={() => handleNavigationHelper('/feedback', null, 'mobile_feedback')}>{t('header.nav.feedback')}</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>
    </header>
  );
}

export default Header;
