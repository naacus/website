import React from 'react';
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
  Button,
  Input
} from '@fluentui/react-components';
import { Navigation24Regular, Search24Regular } from '@fluentui/react-icons';
import LanguageSwitcher from './LanguageSwitcher';
import DonationDialog from './DonationDialog';
import { handleNavigation, isActivePath } from '../services/navigationService';
import { useAnalytics } from '../hooks/useAnalytics';

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
  },
  logoImage: {
    height: '100px',
    width: '100px',
    position: 'relative',
    top: '30px',
    objectFit: 'contain',
    ...shorthands.margin('0', '12px', '0', '0'),
    borderRadius: '50%',
    '@media (max-width: 768px)': {
      // height: '40px',
      width: '53px',
      // marginRight: '8px',
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
    transition: 'background-color 0.1s ease',
    backgroundColor: 'transparent',
    ...shorthands.border('none'),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f2f2f2',
      textDecoration: 'underline',
    },
  },
  navLinkActive: {
    backgroundColor: '#eaf4ff',
    color: '#0067b8',
    fontWeight: '600',
    textDecoration: 'underline',
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
    '@media (max-width: 768px)': {
      display: 'flex',
    },
    '@media (min-width: 769px)': {
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
  donateButton: {
    backgroundColor: '#0067b8',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '13px',
    ...shorthands.padding('6px', '12px'),
    border: 'none',
    ...shorthands.borderRadius('2px'),
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    height: '28px',
    '&:hover': {
      backgroundColor: '#004578',
    },
    '@media (max-width: 768px)': {
      padding: '2px 6px',
      fontSize: '9px',
      whiteSpace: 'nowrap',
      minWidth: 'auto',
      height: '18px',
      lineHeight: '18px',
    },
  },
  mobileMenuItemActive: {
    backgroundColor: '#eaf4ff',
    color: '#0067b8',
    fontWeight: '600',
  },
});

function Header() {
  const { t } = useTranslation();
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { trackCTA } = useAnalytics();

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
          <div className={styles.logo} onClick={() => handleNavigationHelper(null, 'home', 'logo_home')}>
            <img
              src="/images/naacus-logo.png"
              alt={t('header.title')}
              className={styles.logoImage}
            />
          </div>
          
          <nav className={styles.nav}>
            <button 
              onClick={() => handleNavigationHelper('/2025', null, 'naacus_2025')}
              className={`${styles.navLink} ${isActivePathHelper('/2025') ? styles.navLinkActive : ''}`}
            >
              {t('header.nav.naacus2025', 'NAACUS 2025')}
            </button>
            <button 
              onClick={() => handleNavigationHelper('/about', null, 'about')}
              className={`${styles.navLink} ${isActivePathHelper('/about') ? styles.navLinkActive : ''}`}
            >
              {t('header.nav.about')}
            </button>
            <button 
              onClick={() => handleNavigationHelper('/leadership', null, 'leadership')}
              className={`${styles.navLink} ${isActivePathHelper('/leadership') ? styles.navLinkActive : ''}`}
            >
              {t('header.nav.leadership')}
            </button>
            <button 
              onClick={() => handleNavigationHelper('/fellowship-ministries', null, 'fellowship_ministries')}
              className={`${styles.navLink} ${isActivePathHelper('/fellowship-ministries') ? styles.navLinkActive : ''}`}
            >
              {t('header.nav.ministries')}
            </button>
            <button 
              onClick={() => handleNavigationHelper('/programs-activities', null, 'programs_activities')}
              className={`${styles.navLink} ${isActivePathHelper('/programs-activities') ? styles.navLinkActive : ''}`}
            >
              {t('header.nav.programs')}
            </button>
            <button 
              onClick={() => handleNavigationHelper('/events', null, 'events')}
              className={`${styles.navLink} ${isActivePathHelper('/events') ? styles.navLinkActive : ''}`}
            >
              {t('header.nav.events')}
            </button>
            <button 
              onClick={() => handleNavigationHelper('/membership', null, 'membership')}
              className={`${styles.navLink} ${isActivePathHelper('/membership') ? styles.navLinkActive : ''}`}
            >
              {t('header.nav.membership')}
            </button>
            <button 
              onClick={() => handleNavigationHelper('/volunteer', null, 'volunteer')}
              className={`${styles.navLink} ${isActivePathHelper('/volunteer') ? styles.navLinkActive : ''}`}
            >
              {t('header.nav.volunteer')}
            </button>
            <button 
              onClick={() => handleNavigationHelper('/resources', null, 'resources')}
              className={`${styles.navLink} ${isActivePathHelper('/resources') ? styles.navLinkActive : ''}`}
            >
              {t('header.nav.resources')}
            </button>
            <button 
              onClick={() => handleNavigationHelper('/newsletters', null, 'newsletters')}
              className={`${styles.navLink} ${isActivePathHelper('/newsletters') ? styles.navLinkActive : ''}`}
            >
              {t('header.nav.newsletters')}
            </button>
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
          <div className={styles.searchContainer}>
            <Input 
              className={styles.searchInput}
              placeholder={t('header.searchPlaceholder')}
              contentAfter={<Search24Regular className={styles.searchIcon} />}
            />
          </div>
          <DonationDialog />
          <div className={styles.languageSwitcher}>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu */}
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button 
                appearance="subtle"
                icon={<Navigation24Regular />}
                className={styles.mobileMenuButton}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem onClick={() => handleNavigationHelper(null, 'home', 'mobile_home')}>{t('header.nav.home')}</MenuItem>
                <MenuItem className={isActivePathHelper('/2025') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/2025', null, 'mobile_naacus_2025')}>{t('header.nav.naacus2025', 'NAACUS 2025')}</MenuItem>
                <MenuItem className={isActivePathHelper('/about') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/about', null, 'mobile_about')}>{t('header.nav.about')}</MenuItem>
                <MenuItem className={isActivePathHelper('/leadership') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/leadership', null, 'mobile_leadership')}>{t('header.nav.leadership')}</MenuItem>
                <MenuItem className={isActivePathHelper('/fellowship-ministries') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/fellowship-ministries', null, 'mobile_fellowship_ministries')}>Fellowship & Ministries</MenuItem>
                <MenuItem className={isActivePathHelper('/programs-activities') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/programs-activities', null, 'mobile_programs_activities')}>Programs & Activities</MenuItem>
                <MenuItem className={isActivePathHelper('/events') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/events', null, 'mobile_events')}>{t('header.nav.events')}</MenuItem>
                <MenuItem className={isActivePathHelper('/membership') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/membership', null, 'mobile_membership')}>Membership</MenuItem>
                <MenuItem className={isActivePathHelper('/volunteer') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/volunteer', null, 'mobile_volunteer')}>Volunteer</MenuItem>
                <MenuItem className={isActivePathHelper('/resources') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/resources', null, 'mobile_resources')}>{t('header.nav.resources')}</MenuItem>
                <MenuItem className={isActivePathHelper('/newsletters') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/newsletters', null, 'mobile_newsletters')}>Newsletters</MenuItem>
                <MenuItem className={isActivePathHelper('/contact') ? styles.mobileMenuItemActive : undefined} onClick={() => handleNavigationHelper('/contact', null, 'mobile_contact')}>{t('header.nav.contact')}</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>
    </header>
  );
}

export default Header;
