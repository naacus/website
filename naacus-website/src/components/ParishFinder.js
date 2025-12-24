import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  shorthands,
  tokens,
  Input,
  Dropdown,
  Option,
} from '@fluentui/react-components';
import parishService from '../services/parishService';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  topSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap('16px'),
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  zipCodeField: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  searchButton: {
    display: 'flex',
    ...shorthands.gap('8px'),
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  required: {
    color: '#d13438',
  },
  dropdownContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  fieldsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    ...shorthands.gap('16px'),
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  readOnlyField: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  readOnlyInput: {
    backgroundColor: tokens.colorNeutralBackground2,
    cursor: 'default',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    ...shorthands.padding('12px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius('4px'),
  },
  errorMessage: {
    color: '#d13438',
    fontSize: '0.9rem',
    marginTop: '8px',
  },
  helperText: {
    color: tokens.colorNeutralForeground2,
    fontSize: '0.85rem',
    marginTop: '4px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap('16px'),
    marginTop: '16px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  detailsContainer: {
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius('4px'),
    fontSize: '0.9rem',
  },
});

function ParishFinder({ onParishSelect, formData }) {
  const { t } = useTranslation();
  const styles = useStyles();

  const [zipCode, setZipCode] = useState('');
  const [parishes, setParishes] = useState([]);
  const [selectedParish, setSelectedParish] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handle zip code input change
   */
  const handleZipCodeChange = (event, data) => {
    const value = data.value;
    setZipCode(value);

    // Clear parishes when zip code changes
    if (value !== zipCode) {
      setParishes([]);
      setSelectedParish(null);
    }
  };

  /**
   * Search parishes by zip code
   */
  const handleSearchParishes = async () => {
    if (!zipCode || zipCode.trim() === '') {
      console.warn('Please enter a zip code');
      return;
    }

    if (!/^\d{5}$/.test(zipCode)) {
      console.warn('Please enter a valid 5-digit zip code');
      return;
    }

    setLoading(true);
    setParishes([]);
    setSelectedParish(null);

    try {
      console.log(`Searching parishes for zip code: ${zipCode}`);
      const result = await parishService.searchParishes(zipCode);

      if (result.success && result.parishes && result.parishes.length > 0) {
        setParishes(result.parishes);
        console.log(`Found ${result.parishes.length} parishes`);
      } else {
        console.warn(`No parishes found for zip code ${zipCode}. Please try another zip code.`);
      }
    } catch (err) {
      console.error('Error searching parishes:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle parish selection
   */
  const handleParishSelect = (event, data) => {
    const parishId = data.optionValue;
    const selected = parishes.find(p => p.id === parishId);

    if (selected) {
      setSelectedParish(selected);
      console.log('Selected parish:', selected);

      // Notify parent component
      if (onParishSelect) {
        onParishSelect({
          parishName: selected.name,
          parishCity: selected.city,
          parishState: selected.state,
          diocese: selected.diocese,
          phone: selected.phone,
          email: selected.email,
          website: selected.website,
          address: selected.address,
          zipCode: selected.zipCode,
          latitude: selected.latitude,
          longitude: selected.longitude,
          worshipTimes: selected.worshipTimes,
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        {/* Zip Code Input */}
        <div className={styles.zipCodeField}>
          <label className={styles.label}>
            {t('membership.zipCode') || 'Zip Code'}
            <span className={styles.required}> *</span>
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input
              type="text"
              placeholder="90210"
              value={zipCode}
              onChange={handleZipCodeChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchParishes()}
              maxLength="5"
              style={{ flex: 1 }}
              disabled={loading}
            />
            <button
              onClick={handleSearchParishes}
              disabled={loading || !zipCode}
              style={{
                padding: '8px 20px',
                backgroundColor: loading || !zipCode ? '#ccc' : tokens.colorBrandBackground,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading || !zipCode ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!loading && zipCode) {
                  e.target.style.backgroundColor = '#106ebe';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = tokens.colorBrandBackground;
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Parish Dropdown */}
        {parishes.length > 0 && (
        <div className={styles.dropdownContainer}>
          <label className={styles.label}>
            {t('membership.selectParish') || 'Select a Parish'}
            <span className={styles.required}> *</span>
          </label>
          <Dropdown
            placeholder={t('membership.selectParishPlaceholder') || 'Choose a parish...'}
            value={selectedParish?.name || ''}
            onOptionSelect={handleParishSelect}
            style={{ width: '100%' }}
          >
            {parishes.map((parish) => (
              <Option key={parish.id} value={parish.id}>
                <div>
                  <div style={{ fontWeight: '600' }}>{parish.name}</div>
                  <div style={{ fontSize: '0.85rem', color: tokens.colorNeutralForeground2 }}>
                    {parish.city}, {parish.state} {parish.zipCode}
                    {parish.distance && ` · ${parish.distance.toFixed(1)} mi`}
                  </div>
                </div>
              </Option>
            ))}
          </Dropdown>
        </div>
        )}
      </div>

      {/* Side-by-side details when parish is selected */}
      {selectedParish && (
        <div className={styles.detailsGrid}>
          {/* Selected Parish Information */}
          {formData?.parishName && (
            <div className={styles.detailsContainer}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <strong>{t('membership.parishName') || 'Parish Name'}:</strong><br />
                  {formData.parishName}
                </div>
                <div>
                  <strong>{t('membership.diocese') || 'Diocese'}:</strong><br />
                  {formData.diocese}
                </div>
                <div>
                  <strong>{t('membership.city') || 'City'}:</strong><br />
                  {formData.parishCity}
                </div>
                <div>
                  <strong>{t('membership.state') || 'State'}:</strong><br />
                  {formData.parishState}
                </div>
              </div>
            </div>
          )}

          {/* Additional Parish Details */}
          {selectedParish && selectedParish.phone && (
            <div className={styles.detailsContainer}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Parish Address:</strong><br />
                {selectedParish.address}, {selectedParish.city}, {selectedParish.state} {selectedParish.zipCode}
              </div>
              {selectedParish.phone && (
                <div style={{ marginBottom: '8px' }}>
                  <strong>Phone:</strong><br />
                  <a href={`tel:${selectedParish.phone}`}>{selectedParish.phone}</a>
                </div>
              )}
              {selectedParish.email && (
                <div style={{ marginBottom: '8px' }}>
                  <strong>Email:</strong><br />
                  <a href={`mailto:${selectedParish.email}`}>{selectedParish.email}</a>
                </div>
              )}
              {selectedParish.website && (
                <div>
                  <strong>Website:</strong><br />
                  <a href={selectedParish.website} target="_blank" rel="noopener noreferrer">{selectedParish.website}</a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ParishFinder;
