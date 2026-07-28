/**
 * Image Gallery Component
 * Grid of image thumbnails with lightbox support
 */

import React, { useState } from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Dismiss20Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    ...shorthands.gap('16px'),
    ...shorthands.margin('0', '0', '32px', '0'),
    '@media (max-width: 900px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  thumbnail: {
    position: 'relative',
    overflow: 'hidden',
    ...shorthands.borderRadius('8px'),
    aspectRatio: '1',
    cursor: 'pointer',
    backgroundColor: tokens.colorNeutralBackground2,
    '& img': {
      display: 'block',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 300ms ease-out',
    },
    '&:hover img': {
      transform: 'scale(1.08)',
    },
  },
  lightbox: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  lightboxContent: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
  },
  lightboxImage: {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    padding: '8px',
    ...shorthands.borderRadius('4px'),
    fontSize: '1.5rem',
    transition: 'background 200ms ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  },
});

export default function ImageGallery({ images = [] }) {
  const styles = useStyles();
  const [selectedIdx, setSelectedIdx] = useState(null);

  return (
    <>
      <div className={styles.gallery}>
        {images.map((image, idx) => (
          <div
            key={idx}
            className={styles.thumbnail}
            onClick={() => setSelectedIdx(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedIdx(idx)}
          >
            <img src={image.src} alt={image.alt || `Gallery image ${idx + 1}`} />
          </div>
        ))}
      </div>

      {selectedIdx !== null && (
        <div className={styles.lightbox} onClick={() => setSelectedIdx(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setSelectedIdx(null)}
              aria-label="Close"
            >
              <Dismiss20Regular />
            </button>
            <img
              className={styles.lightboxImage}
              src={images[selectedIdx].src}
              alt={images[selectedIdx].alt || 'Full size image'}
            />
          </div>
        </div>
      )}
    </>
  );
}
