/**
 * Media Card Component
 * Card with image, title, description, and optional badges/tags
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Card, Text, Badge } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: tokens.shadow16,
      '& .media-image': {
        transform: 'scale(1.05)',
      },
    },
  },
  imageWrapper: {
    overflow: 'hidden',
    height: '220px',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  image: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 300ms ease-out',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    ...shorthands.padding('20px'),
  },
  badgeGroup: {
    display: 'flex',
    ...shorthands.gap('8px'),
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  title: {
    display: 'block',
    fontSize: '1.15rem',
    fontWeight: '700',
    color: tokens.colorBrandBackground,
    marginBottom: '8px',
    lineHeight: '1.4',
  },
  description: {
    display: 'block',
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    marginBottom: '12px',
    flexGrow: 1,
  },
  meta: {
    display: 'block',
    fontSize: '0.85rem',
    color: tokens.colorNeutralForeground3,
    marginTop: 'auto',
    paddingTop: '12px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
  },
});

export default function MediaCard({
  image,
  title,
  description,
  tags = [],
  meta
}) {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={image}
          alt={title || ''}
        />
      </div>
      <div className={styles.content}>
        {tags.length > 0 && (
          <div className={styles.badgeGroup}>
            {tags.map((tag, idx) => (
              <Badge key={idx} appearance="outline" size="small">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {title && <Text className={styles.title}>{title}</Text>}
        {description && <Text className={styles.description}>{description}</Text>}
        {meta && <Text as="small" className={styles.meta}>{meta}</Text>}
      </div>
    </Card>
  );
}
