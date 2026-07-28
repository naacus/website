/**
 * Alert/Message Box Component
 * Info, success, warning, and error message display
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Text } from '@fluentui/react-components';
import { 
  Info20Filled, 
  CheckmarkCircle20Filled, 
  Warning20Filled, 
  ErrorCircle20Filled,
  Dismiss20Regular
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  alert: {
    display: 'flex',
    ...shorthands.gap('12px'),
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('8px'),
    ...shorthands.margin('16px', '0'),
    alignItems: 'flex-start',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
  },
  info: {
    backgroundColor: '#EBF4FF',
    borderLeftColor: '#0067b8',
    color: '#0067b8',
  },
  success: {
    backgroundColor: '#E1F5E4',
    borderLeftColor: '#107C10',
    color: '#107C10',
  },
  warning: {
    backgroundColor: '#FFF4CE',
    borderLeftColor: '#FFB900',
    color: '#8F6C1F',
  },
  error: {
    backgroundColor: '#FDE7E9',
    borderLeftColor: '#D13438',
    color: '#D13438',
  },
  icon: {
    marginTop: '2px',
    fontSize: '1.3rem',
    flexShrink: 0,
  },
  content: {
    flexGrow: 1,
  },
  title: {
    fontWeight: '700',
    marginBottom: '4px',
    display: 'block',
  },
  message: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px',
    color: 'inherit',
    opacity: '0.7',
    transition: 'opacity 200ms ease',
    '&:hover': {
      opacity: '1',
    },
  },
});

export default function Alert({
  type = 'info', // 'info', 'success', 'warning', 'error'
  title,
  message,
  onClose
}) {
  const styles = useStyles();
  const [visible, setVisible] = React.useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  const typeClass = styles[type] || styles.info;

  const icons = {
    info: <Info20Filled className={styles.icon} />,
    success: <CheckmarkCircle20Filled className={styles.icon} />,
    warning: <Warning20Filled className={styles.icon} />,
    error: <ErrorCircle20Filled className={styles.icon} />,
  };

  return (
    <div className={`${styles.alert} ${typeClass}`}>
      {icons[type]}
      <div className={styles.content}>
        {title && <Text className={styles.title}>{title}</Text>}
        {message && <Text className={styles.message}>{message}</Text>}
      </div>
      {onClose && (
        <button className={styles.closeButton} onClick={handleClose}>
          <Dismiss20Regular />
        </button>
      )}
    </div>
  );
}
