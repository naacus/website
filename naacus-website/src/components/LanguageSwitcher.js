import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import { updateLanguageProperty } from '../services/googleAnalyticsService';

const useStyles = makeStyles({
  button: {
    minWidth: '40px',
    padding: '8px',
    color: tokens.colorNeutralForeground1,
  },
  flagIcon: {
    fontSize: '1.5rem',
  },
});

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const styles = useStyles();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Update GA user property when language changes
    updateLanguageProperty(lng);
  };

  const languages = {
    en: { flag: '🇺🇸', name: 'English' },
    fr: { flag: '🇫🇷', name: 'Français' },
  };

  const currentLang = languages[i18n.language] || languages.en;

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          className={styles.button}
        >
          <span className={styles.flagIcon}>{currentLang.flag}</span>
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem onClick={() => changeLanguage('en')}>
            🇺🇸 English
          </MenuItem>
          <MenuItem onClick={() => changeLanguage('fr')}>
            🇫🇷 Français
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}

export default LanguageSwitcher;
