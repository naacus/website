import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Card,
  Button,
  Spinner,
} from '@fluentui/react-components';
import PageWrapper from '../components/PageWrapper';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  getMapsApiKey,
  getDefaultMapCenter,
} from '../config/mapsConfig';

const CATEGORY_META = {
  all: { label: 'All', color: '#0f6cbd' },
  venue: { label: 'Venues', color: '#8f4df4' },
  church: { label: 'Churches', color: '#6f1ab6' },
  hotel: { label: 'Hotels', color: '#0f6cbd' },
  airport: { label: 'Airports', color: '#ce4b16' },
  parking: { label: 'Parking', color: '#107c10' },
  transport: { label: 'Transit', color: '#00a3a3' },
  service: { label: 'Services', color: '#735c0f' },
};

const useStyles = makeStyles({
  pageIntro: {
    maxWidth: '1100px',
    ...shorthands.margin('0', 'auto', '28px'),
    ...shorthands.padding('20px', '0', '0'),
  },
  title: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: '700',
    color: tokens.colorNeutralForeground1,
    marginBottom: '10px',
    '@media (max-width: 768px)': {
      fontSize: '1.55rem',
    },
  },
  subtitle: {
    display: 'block',
    fontSize: '1.04rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.65',
    marginBottom: '18px',
    maxWidth: '860px',
  },
  actionRow: {
    display: 'flex',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
    marginBottom: '18px',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap('10px'),
    marginBottom: '16px',
  },
  mapCard: {
    ...shorthands.padding('12px'),
    marginBottom: '16px',
  },
  mapShell: {
    width: '100%',
    minHeight: '460px',
    backgroundColor: '#f5f6f8',
    ...shorthands.borderRadius('10px'),
    overflow: 'hidden',
    position: 'relative',
    ...shorthands.border('1px', 'solid', '#d9d9d9'),
    '@media (max-width: 768px)': {
      minHeight: '360px',
    },
  },
  mapCanvas: {
    width: '100%',
    height: '460px',
    '@media (max-width: 768px)': {
      height: '360px',
    },
  },
  mapOverlay: {
    position: 'absolute',
    inset: '0',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: '#f5f6f8',
    zIndex: 1,
  },
  mapFallback: {
    minHeight: '220px',
    display: 'grid',
    placeItems: 'center',
    ...shorthands.padding('24px'),
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
  },
  directionsPanel: {
    ...shorthands.margin('12px', '0', '0'),
    ...shorthands.padding('12px'),
    ...shorthands.border('1px', 'solid', '#d9d9d9'),
    ...shorthands.borderRadius('8px'),
    backgroundColor: '#fff',
    maxHeight: '280px',
    overflowY: 'auto',
    fontSize: '0.9rem',
  },
  directionsHint: {
    display: 'block',
    color: tokens.colorNeutralForeground2,
    fontSize: '0.88rem',
    marginTop: '8px',
  },
});

function normalizeLocations(payload) {
  if (!payload || !Array.isArray(payload.locations)) {
    return [];
  }

  return payload.locations.filter((location) =>
    typeof location.lat === 'number' && typeof location.lng === 'number' && location.category
  );
}

function loadMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    const existingScript = document.querySelector('script[data-google-maps-script="true"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps));
      existingScript.addEventListener('error', () => reject(new Error('Google Maps script failed to load.')));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsScript = 'true';
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('Google Maps script failed to load.'));

    document.head.appendChild(script);
  });
}

function ConventionMapPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { trackPageViewEvent, trackCTA } = useAnalytics();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const directionsPanelRef = useRef(null);

  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState(getDefaultMapCenter());
  const [activeCategory, setActiveCategory] = useState('all');
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [mapsState, setMapsState] = useState('loading');
  const [mapsError, setMapsError] = useState('');
  const [directionsActive, setDirectionsActive] = useState(false);
  const [activeRoute, setActiveRoute] = useState(null);

  const apiKey = useMemo(() => getMapsApiKey(), []);

  const filteredLocations = useMemo(() => {
    if (activeCategory === 'all') {
      return locations;
    }

    return locations.filter((location) => location.category === activeCategory);
  }, [locations, activeCategory]);

  const categories = useMemo(() => {
    const available = new Set(locations.map((location) => location.category));
    return ['all', ...Object.keys(CATEGORY_META).filter((key) => key !== 'all' && available.has(key))];
  }, [locations]);

  const openExternalNavigation = () => {
    if (!activeRoute || !activeRoute.destination) {
      return;
    }

    const destination = `${activeRoute.destination.lat},${activeRoute.destination.lng}`;
    const origin = activeRoute.origin
      ? `&origin=${activeRoute.origin.lat},${activeRoute.origin.lng}`
      : '';
    const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}${origin}&travelmode=driving&dir_action=navigate`;

    trackCTA('start_navigation_click', 'convention_map', activeRoute.name || 'unknown');
    window.open(navigationUrl, '_blank', 'noopener,noreferrer');
  };

  const guideMeHere = () => {
    trackCTA('guide_me_here_click', 'convention_map', activeRoute?.name || 'unknown');
    directionsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    trackPageViewEvent('ConventionMapPage');
  }, [trackPageViewEvent]);

  useEffect(() => {
    let isMounted = true;

    async function loadLocations() {
      try {
        const response = await fetch('/content/convention-map-locations.json', { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error('Unable to load convention map data.');
        }

        const payload = await response.json();
        if (!isMounted) {
          return;
        }

        const nextLocations = normalizeLocations(payload);
        setLocations(nextLocations);

        if (payload.center && typeof payload.center.lat === 'number' && typeof payload.center.lng === 'number') {
          setCenter(payload.center);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setMapsError(error.message || 'Unable to load convention map data.');
      } finally {
        if (isMounted) {
          setLoadingLocations(false);
        }
      }
    }

    loadLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!apiKey) {
      setMapsState('error');
      setMapsError('Google Maps key is missing. Set REACT_APP_GOOGLE_MAPS_API_KEY and environment-specific keys for www/test.');
      return;
    }

    if (!mapRef.current || mapInstanceRef.current) {
      return;
    }

    let canceled = false;

    loadMapsScript(apiKey)
      .then((maps) => {
        if (canceled || !mapRef.current) {
          return;
        }

        mapInstanceRef.current = new maps.Map(mapRef.current, {
          center,
          zoom: 11,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        directionsServiceRef.current = new maps.DirectionsService();
        directionsRendererRef.current = new maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: { strokeColor: '#0f6cbd', strokeWeight: 5 },
        });
        directionsRendererRef.current.setMap(mapInstanceRef.current);
        directionsRendererRef.current.setPanel(directionsPanelRef.current);

        setMapsState('ready');
      })
      .catch((error) => {
        if (canceled) {
          return;
        }

        setMapsState('error');
        setMapsError(error.message || 'Google Maps failed to initialize.');
      });

    return () => {
      canceled = true;
    };
  }, [apiKey, center]);

  useEffect(() => {
    const maps = window.google && window.google.maps;
    const map = mapInstanceRef.current;

    if (!maps || !map || mapsState !== 'ready') {
      return;
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Clear any active directions when filter changes
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] });
      setDirectionsActive(false);
      setActiveRoute(null);
    }

    if (!filteredLocations.length) {
      map.setCenter(center);
      map.setZoom(10);
      return;
    }

    const bounds = new maps.LatLngBounds();
    const infoWindow = new maps.InfoWindow();

    // Global handler invoked by the "Get Directions" button inside the info window HTML
    window.__naacusDirs = (lat, lng, name) => {
      infoWindow.close();
      const destination = { lat, lng };

      const renderRoute = (origin) => {
        directionsServiceRef.current.route(
          { origin, destination, travelMode: maps.TravelMode.DRIVING },
          (result, status) => {
            if (status === 'OK') {
              directionsRendererRef.current.setDirections(result);
              setDirectionsActive(true);
              setActiveRoute({
                name,
                origin,
                destination,
              });
            } else {
              // Directions API failed — fall back to external Google Maps
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                '_blank',
                'noopener,noreferrer'
              );
            }
          }
        );
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => renderRoute({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => renderRoute(destination)
        );
      } else {
        renderRoute(destination);
      }
    };

    filteredLocations.forEach((location) => {
      const marker = new maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
      });

      marker.addListener('click', () => {
        const categoryLabel = (CATEGORY_META[location.category] || {}).label || location.category;
        const safeName = location.name.replace(/'/g, "\\'");
        infoWindow.setContent(`
          <div style="max-width:280px;font-family:Segoe UI,Arial,sans-serif;line-height:1.55;">
            <strong style="font-size:1rem;display:block;margin-bottom:2px;">${location.name}</strong>
            <span style="color:#555;font-size:0.82rem;">${categoryLabel}</span><br/>
            ${location.address ? `<span style="font-size:0.9rem;">${location.address}</span><br/>` : ''}
            ${location.description ? `<p style="margin:6px 0 8px;font-size:0.88rem;color:#333;">${location.description}</p>` : ''}
            <button
              onclick="window.__naacusDirs(${location.lat}, ${location.lng}, '${safeName}')"
              style="margin-top:6px;padding:6px 14px;background:#0f6cbd;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:0.88rem;"
            >Get Directions</button>
          </div>
        `);
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
      bounds.extend(marker.getPosition());
    });

    if (filteredLocations.length === 1) {
      map.setCenter({ lat: filteredLocations[0].lat, lng: filteredLocations[0].lng });
      map.setZoom(14);
      return;
    }

    map.fitBounds(bounds, 60);

    // Trigger resize in case the container became visible after map init
    window.google.maps.event.trigger(map, 'resize');

    return () => {
      delete window.__naacusDirs;
    };
  }, [filteredLocations, mapsState, center]);

  return (
    <PageWrapper>
      <div className={styles.pageIntro}>
        <Text as="h1" className={styles.title}>Convention Map Hub</Text>
        <Text as="p" className={styles.subtitle}>
          Find convention venues, nearby churches, hotels, airports, parking, transit, and essential services.
          Use category filters to focus your planning and open turn-by-turn directions instantly.
        </Text>
        <div className={styles.actionRow}>
          <Button appearance="primary" onClick={() => navigate('/membership')}>Register Membership</Button>
          <Button appearance="secondary" onClick={() => navigate('/events')}>Back to Events</Button>
        </div>
      </div>

      <div className={styles.filters}>
        {categories.map((categoryKey) => {
          const meta = CATEGORY_META[categoryKey] || { label: categoryKey, color: '#0f6cbd' };
          const isActive = activeCategory === categoryKey;

          return (
            <Button
              key={categoryKey}
              appearance={isActive ? 'primary' : 'secondary'}
              onClick={() => {
                setActiveCategory(categoryKey);
                trackCTA('map_filter', 'convention_map', categoryKey);
              }}
              style={isActive ? { backgroundColor: meta.color, borderColor: meta.color } : undefined}
            >
              {meta.label}
            </Button>
          );
        })}
      </div>

      <Card className={styles.mapCard}>
        <div className={styles.mapShell}>
          {/* Map canvas always rendered so Maps SDK initializes into a real element */}
          <div
            ref={mapRef}
            className={styles.mapCanvas}
            role="application"
            aria-label="Convention locations map"
          />

          {/* Clear directions button shown while a route is active */}
          {directionsActive && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
              <button
                onClick={guideMeHere}
                style={{
                  padding: '7px 14px',
                  background: '#0f6cbd',
                  color: '#fff',
                  border: '1px solid #0f6cbd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'Segoe UI, Arial, sans-serif',
                  fontSize: '0.88rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,.2)',
                  marginRight: '8px',
                }}
              >
                Guide Me Here
              </button>
              <button
                onClick={openExternalNavigation}
                style={{
                  padding: '7px 14px',
                  background: '#fff',
                  color: '#0f6cbd',
                  border: '1px solid #0f6cbd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'Segoe UI, Arial, sans-serif',
                  fontSize: '0.88rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,.2)',
                  marginRight: '8px',
                }}
              >
                Open in Google Maps
              </button>
              <button
                onClick={() => {
                  directionsRendererRef.current.setDirections({ routes: [] });
                  setDirectionsActive(false);
                  setActiveRoute(null);
                }}
                style={{
                  padding: '7px 14px',
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'Segoe UI, Arial, sans-serif',
                  fontSize: '0.88rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,.2)',
                }}
              >
                ✕ Clear Directions
              </button>
            </div>
          )}

          {/* Overlays on top while loading or on error */}
          {loadingLocations && (
            <div className={styles.mapOverlay}>
              <Spinner size="medium" label="Loading map locations..." />
            </div>
          )}

          {!loadingLocations && mapsState === 'error' && (
            <div className={styles.mapOverlay}>
              <Text>{mapsError}</Text>
            </div>
          )}
        </div>

        <div
          ref={directionsPanelRef}
          className={styles.directionsPanel}
          style={{ display: directionsActive ? 'block' : 'none' }}
          aria-live="polite"
        />

        {directionsActive && (
          <Text className={styles.directionsHint}>
            Follow these steps to stay on NAACUS map, or use "Open in Google Maps" for native navigation.
          </Text>
        )}
      </Card>

    </PageWrapper>
  );
}

export default ConventionMapPage;
