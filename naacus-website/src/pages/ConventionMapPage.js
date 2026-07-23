import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Card,
  Button,
  Input,
  Spinner,
} from '@fluentui/react-components';
import PageWrapper from '../components/PageWrapper';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  getMapsApiKey,
  getDefaultMapCenter,
} from '../config/mapsConfig';

const CATEGORY_META = {
  all: { labelKey: 'events.mapHub.categories.all', defaultLabel: 'All', color: '#0f6cbd' },
  search: { labelKey: 'events.mapHub.categories.search', defaultLabel: 'Search Results', color: '#d13438' },
  venue: { labelKey: 'events.mapHub.categories.venue', defaultLabel: 'Venues', color: '#8f4df4' },
  church: { labelKey: 'events.mapHub.categories.church', defaultLabel: 'Churches', color: '#6f1ab6' },
  hotel: { labelKey: 'events.mapHub.categories.hotel', defaultLabel: 'Hotels', color: '#0f6cbd' },
  airport: { labelKey: 'events.mapHub.categories.airport', defaultLabel: 'Airports', color: '#ce4b16' },
  parking: { labelKey: 'events.mapHub.categories.parking', defaultLabel: 'Parking', color: '#107c10' },
  transport: { labelKey: 'events.mapHub.categories.transport', defaultLabel: 'Transit', color: '#00a3a3' },
  service: { labelKey: 'events.mapHub.categories.service', defaultLabel: 'Services', color: '#735c0f' },
};

const useStyles = makeStyles({
  pageFrame: {
    maxWidth: '1180px',
    ...shorthands.margin('0', 'auto'),
    ...shorthands.padding('4px', '0', '16px'),
    fontFamily: "'Space Grotesk', 'Manrope', 'Segoe UI', sans-serif",
  },
  pageIntro: {
    background:
      'radial-gradient(circle at top right, rgba(15,108,189,.18), transparent 52%), linear-gradient(135deg, #f8fbff 0%, #ffffff 42%, #f4f9ff 100%)',
    ...shorthands.border('1px', 'solid', 'rgba(15,108,189,.16)'),
    ...shorthands.borderRadius('20px'),
    ...shorthands.padding('12px', '16px', '12px'),
    ...shorthands.margin('0', '0', '8px'),
    boxShadow: '0 14px 40px rgba(9, 67, 117, 0.08)',
    position: 'relative',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      ...shorthands.padding('10px', '10px', '10px'),
      ...shorthands.borderRadius('16px'),
    },
  },
  title: {
    display: 'block',
    fontSize: '2.05rem',
    fontWeight: '800',
    color: '#0d1f33',
    letterSpacing: '-0.02em',
    marginBottom: '6px',
    '@media (max-width: 768px)': {
      fontSize: '1.55rem',
    },
  },
  subtitle: {
    display: 'block',
    fontSize: '1.03rem',
    color: '#34475d',
    lineHeight: '1.55',
    marginBottom: '10px',
    maxWidth: '900px',
  },
  actionRow: {
    display: 'flex',
    ...shorthands.gap('10px'),
    flexWrap: 'wrap',
    marginBottom: '0',
  },
  ctaButtonPrimary: {
    minHeight: '40px',
    ...shorthands.padding('0', '18px'),
    borderRadius: '10px',
    fontWeight: 700,
    letterSpacing: '0.01em',
  },
  ctaButtonSecondary: {
    minHeight: '40px',
    ...shorthands.padding('0', '18px'),
    borderRadius: '10px',
    fontWeight: 600,
  },
  controlsCard: {
    backgroundColor: '#ffffff',
    ...shorthands.border('1px', 'solid', '#e4edf8'),
    ...shorthands.borderRadius('16px'),
    ...shorthands.padding('10px', '12px'),
    ...shorthands.margin('0', '0', '8px'),
    boxShadow: '0 6px 22px rgba(12, 40, 66, 0.06)',
    '@media (max-width: 768px)': {
      ...shorthands.padding('10px'),
    },
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap('8px'),
    marginBottom: '8px',
    '@media (max-width: 768px)': {
      flexWrap: 'nowrap',
      overflowX: 'auto',
      paddingBottom: '4px',
    },
  },
  filterButton: {
    minHeight: '40px',
    ...shorthands.padding('0', '20px'),
    borderRadius: '999px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '160ms',
    transitionTimingFunction: 'ease',
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 10px rgba(15,108,189,0.16)',
    },
    ':focus-visible': {
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineColor: '#0f6cbd',
      outlineOffset: '2px',
    },
  },
  searchRow: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '560px',
  },
  searchInput: {
    width: '100%',
  },
  searchHint: {
    display: 'block',
    color: '#4c6279',
    fontSize: '0.86rem',
    marginTop: '4px',
    lineHeight: '1.45',
  },
  mapCard: {
    ...shorthands.padding('14px'),
    ...shorthands.borderRadius('18px'),
    ...shorthands.border('1px', 'solid', '#d7e5f7'),
    boxShadow: '0 18px 42px rgba(9, 45, 78, 0.11)',
    marginBottom: '8px',
    background:
      'linear-gradient(180deg, rgba(250,253,255,1) 0%, rgba(244,249,255,1) 100%)',
    '@media (max-width: 768px)': {
      ...shorthands.padding('10px'),
      ...shorthands.borderRadius('14px'),
    },
  },
  mapShell: {
    width: '100%',
    minHeight: '430px',
    backgroundColor: '#f5f6f8',
    ...shorthands.borderRadius('14px'),
    overflow: 'hidden',
    position: 'relative',
    ...shorthands.border('1px', 'solid', '#d8e5f2'),
    '@media (max-width: 768px)': {
      minHeight: '330px',
    },
  },
  mapCanvas: {
    width: '100%',
    height: '430px',
    '@media (max-width: 768px)': {
      height: '330px',
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
    ...shorthands.padding('14px'),
    ...shorthands.border('1px', 'solid', '#c9ddf4'),
    ...shorthands.borderRadius('12px'),
    backgroundColor: '#fcfdff',
    maxHeight: '280px',
    overflowY: 'auto',
    fontSize: '0.92rem',
    lineHeight: '1.52',
  },
  directionsPanelHidden: {
    maxHeight: '0',
    overflow: 'hidden',
    ...shorthands.padding('0'),
    ...shorthands.border('0', 'solid', 'transparent'),
    ...shorthands.margin('0'),
  },
  directionsHint: {
    display: 'block',
    color: '#45617f',
    fontSize: '0.86rem',
    marginTop: '8px',
  },
  activeFilterButton: {
    color: '#ffffff',
  },
  filterVenue: {
    backgroundColor: '#8f4df4',
    borderColor: '#8f4df4',
  },
  filterChurch: {
    backgroundColor: '#6f1ab6',
    borderColor: '#6f1ab6',
  },
  filterHotel: {
    backgroundColor: '#0f6cbd',
    borderColor: '#0f6cbd',
  },
  filterAirport: {
    backgroundColor: '#ce4b16',
    borderColor: '#ce4b16',
  },
  filterParking: {
    backgroundColor: '#107c10',
    borderColor: '#107c10',
  },
  filterTransport: {
    backgroundColor: '#00a3a3',
    borderColor: '#00a3a3',
  },
  filterService: {
    backgroundColor: '#735c0f',
    borderColor: '#735c0f',
  },
  filterAll: {
    backgroundColor: '#0f6cbd',
    borderColor: '#0f6cbd',
  },
  mapActions: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 2,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    maxWidth: 'calc(100% - 24px)',
    '@media (max-width: 768px)': {
      gap: '6px',
    },
  },
  mapActionButton: {
    minHeight: '36px',
    ...shorthands.padding('0', '14px'),
    borderRadius: '999px',
    cursor: 'pointer',
    fontFamily: "'Space Grotesk', 'Manrope', 'Segoe UI', sans-serif",
    fontSize: '0.88rem',
    fontWeight: 600,
    boxShadow: '0 6px 16px rgba(5, 30, 53, 0.24)',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '160ms',
    transitionTimingFunction: 'ease',
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 8px 18px rgba(5, 30, 53, 0.28)',
    },
    ':focus-visible': {
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineColor: '#0f6cbd',
      outlineOffset: '2px',
    },
    '@media (max-width: 768px)': {
      minHeight: '34px',
      ...shorthands.padding('0', '12px'),
      fontSize: '0.82rem',
    },
  },
  mapPrimaryActionButton: {
    backgroundColor: '#0f6cbd',
    color: '#ffffff',
    borderTopColor: '#0f6cbd',
    borderRightColor: '#0f6cbd',
    borderBottomColor: '#0f6cbd',
    borderLeftColor: '#0f6cbd',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
  },
  mapSecondaryActionButton: {
    backgroundColor: 'rgba(255,255,255,.97)',
    color: '#0d4f8b',
    ...shorthands.border('1px', 'solid', '#7eb2e2'),
  },
  mapNeutralActionButton: {
    backgroundColor: 'rgba(255,255,255,.97)',
    color: '#2f4258',
    ...shorthands.border('1px', 'solid', '#b7c8db'),
  },
  directionsStep: {
    marginTop: '10px',
  },
  infoWindowContent: {
    maxWidth: '280px',
    fontFamily: "'Space Grotesk', 'Manrope', 'Segoe UI', sans-serif",
    lineHeight: '1.55',
  },
  infoWindowTitle: {
    fontSize: '1rem',
    display: 'block',
    marginBottom: '2px',
    fontWeight: '700',
  },
  infoWindowCategory: {
    color: '#555555',
    fontSize: '0.82rem',
  },
  infoWindowAddress: {
    fontSize: '0.9rem',
  },
  infoWindowDescription: {
    marginTop: '6px',
    marginRight: '0',
    marginBottom: '8px',
    marginLeft: '0',
    fontSize: '0.88rem',
    color: '#333333',
  },
  infoWindowButton: {
    marginTop: '6px',
    paddingTop: '6px',
    paddingRight: '14px',
    paddingBottom: '6px',
    paddingLeft: '14px',
    backgroundColor: '#0f6cbd',
    color: '#ffffff',
    borderTopStyle: 'none',
    borderRightStyle: 'none',
    borderBottomStyle: 'none',
    borderLeftStyle: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.88rem',
  },
  mapMetaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  mapMetaLabel: {
    color: '#274765',
    fontSize: '0.83rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  mapMetaCount: {
    color: '#37536f',
    fontSize: '0.84rem',
    fontWeight: 600,
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
      existingScript.addEventListener('error', () => reject(new Error('MAPS_SCRIPT_LOAD_FAILED')));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsScript = 'true';
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('MAPS_SCRIPT_LOAD_FAILED'));

    document.head.appendChild(script);
  });
}

function ConventionMapPage() {
  const styles = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { trackPageViewEvent, trackCTA } = useAnalytics();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const directionsPanelRef = useRef(null);
  const placesServiceRef = useRef(null);

  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState(getDefaultMapCenter());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchState, setSearchState] = useState('idle');
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [mapsState, setMapsState] = useState('loading');
  const [mapsError, setMapsError] = useState('');
  const [directionsActive, setDirectionsActive] = useState(false);
  const [activeRoute, setActiveRoute] = useState(null);

  const apiKey = useMemo(() => getMapsApiKey(), []);

  const initializeMap = React.useCallback((maps) => {
    if (!maps || !mapRef.current || mapInstanceRef.current) {
      return false;
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
    placesServiceRef.current = new maps.places.PlacesService(mapInstanceRef.current);
    setMapsState('ready');
    return true;
  }, [center]);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => activeCategory === 'all' || location.category === activeCategory);
  }, [locations, activeCategory]);

  const venueAnchor = useMemo(() => {
    return locations.find((location) => location.category === 'venue') || null;
  }, [locations]);

  const displayedLocations = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredLocations;
    }

    const nextLocations = [];
    if (venueAnchor) {
      nextLocations.push(venueAnchor);
    }

    return [...nextLocations, ...searchResults];
  }, [filteredLocations, searchQuery, searchResults, venueAnchor]);

  const categories = useMemo(() => {
    const available = new Set(locations.map((location) => location.category));
    return ['all', ...Object.keys(CATEGORY_META).filter((key) => key !== 'all' && available.has(key))];
  }, [locations]);

  const activeFilterClassNames = {
    all: styles.filterAll,
    venue: styles.filterVenue,
    church: styles.filterChurch,
    hotel: styles.filterHotel,
    airport: styles.filterAirport,
    parking: styles.filterParking,
    transport: styles.filterTransport,
    service: styles.filterService,
  };

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
          throw new Error('MAP_DATA_LOAD_FAILED');
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

        setMapsError(t('events.mapHub.errors.mapDataLoadFailed', {
          defaultValue: 'Unable to load convention map data.',
        }));
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
  }, [t]);

  useEffect(() => {
    if (!apiKey) {
      setMapsState('error');
      setMapsError(t('events.mapHub.errors.missingApiKey', {
        defaultValue: 'Google Maps key is missing. Set REACT_APP_GOOGLE_MAPS_API_KEY and environment-specific keys for www/test.',
      }));
      return;
    }

    if (!mapRef.current || mapInstanceRef.current) {
      return;
    }

    // If Maps SDK already exists (from prior navigation), initialize immediately.
    if (window.google && window.google.maps && initializeMap(window.google.maps)) {
      return;
    }

    let canceled = false;

    loadMapsScript(apiKey)
      .then((maps) => {
        if (canceled || !mapRef.current) {
          return;
        }

        initializeMap(maps);
      })
      .catch((error) => {
        if (canceled) {
          return;
        }

        setMapsState('error');
        if (error?.message === 'MAPS_SCRIPT_LOAD_FAILED') {
          setMapsError(t('events.mapHub.errors.mapsScriptLoadFailed', {
            defaultValue: 'Google Maps script failed to load.',
          }));
        } else {
          setMapsError(t('events.mapHub.errors.mapsInitFailed', {
            defaultValue: 'Google Maps failed to initialize.',
          }));
        }
      });

    return () => {
      canceled = true;
    };
  }, [apiKey, initializeMap, t]);

  useEffect(() => {
    if (mapsState === 'ready' || mapInstanceRef.current || !mapRef.current) {
      return;
    }

    if (window.google && window.google.maps) {
      initializeMap(window.google.maps);
    }
  }, [mapsState, initializeMap]);

  useEffect(() => {
    const maps = window.google && window.google.maps;
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      setSearchState('idle');
      return;
    }

    if (!maps || mapsState !== 'ready' || !placesServiceRef.current || !venueAnchor) {
      return;
    }

    let canceled = false;
    setSearchState('loading');

    placesServiceRef.current.textSearch(
      {
        query,
        location: { lat: venueAnchor.lat, lng: venueAnchor.lng },
        radius: 8000,
      },
      (results, status) => {
        if (canceled) {
          return;
        }

        if (status === maps.places.PlacesServiceStatus.OK && Array.isArray(results)) {
          setSearchResults(
            results
              .filter((place) => place.geometry && place.geometry.location)
              .map((place) => ({
                id: place.place_id || `${place.name}-${place.formatted_address || place.vicinity || 'search-result'}`,
                name: place.name || t('events.mapHub.search.nearbyResultName', { defaultValue: 'Nearby result' }),
                category: 'search',
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address || place.vicinity || '',
                description: t('events.mapHub.search.resultNearVenue', {
                  venueName: venueAnchor.name,
                  defaultValue: `Search result near ${venueAnchor.name}`,
                }),
              }))
          );
          setSearchState('ready');
          return;
        }

        if (status === maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          setSearchResults([]);
          setSearchState('empty');
          return;
        }

        setSearchResults([]);
        setSearchState('error');
      }
    );

    return () => {
      canceled = true;
    };
  }, [mapsState, searchQuery, venueAnchor, t]);

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

    if (!displayedLocations.length) {
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
              directionsRendererRef.current.setPanel(directionsPanelRef.current);
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

    displayedLocations.forEach((location) => {
      const marker = new maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
      });

      marker.addListener('click', () => {
        const categoryMeta = CATEGORY_META[location.category] || {};
        const categoryLabel = categoryMeta.labelKey
          ? t(categoryMeta.labelKey, { defaultValue: categoryMeta.defaultLabel || location.category })
          : location.category;
        const safeName = location.name.replace(/'/g, "\\'");
        infoWindow.setContent(`
          <div class="${styles.infoWindowContent}">
            <strong class="${styles.infoWindowTitle}">${location.name}</strong>
            <span class="${styles.infoWindowCategory}">${categoryLabel}</span><br/>
            ${location.address ? `<span class="${styles.infoWindowAddress}">${location.address}</span><br/>` : ''}
            ${location.description ? `<p class="${styles.infoWindowDescription}">${location.description}</p>` : ''}
            <button
              onclick="window.__naacusDirs(${location.lat}, ${location.lng}, '${safeName}')"
              class="${styles.infoWindowButton}"
            >${t('events.mapHub.directions.getDirections', { defaultValue: 'Get Directions' })}</button>
          </div>
        `);
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
      bounds.extend(marker.getPosition());
    });

    if (displayedLocations.length === 1) {
      map.setCenter({ lat: displayedLocations[0].lat, lng: displayedLocations[0].lng });
      map.setZoom(14);
      return;
    }

    map.fitBounds(bounds, 60);

    // Trigger resize in case the container became visible after map init
    window.google.maps.event.trigger(map, 'resize');

    return () => {
      delete window.__naacusDirs;
    };
  }, [
    displayedLocations,
    mapsState,
    center,
    t,
    styles.infoWindowAddress,
    styles.infoWindowButton,
    styles.infoWindowCategory,
    styles.infoWindowContent,
    styles.infoWindowDescription,
    styles.infoWindowTitle,
  ]);

  return (
    <PageWrapper>
      <div className={styles.pageFrame}>
        <div className={styles.pageIntro}>
          <Text as="h1" className={styles.title}>{t('events.mapHub.title', { defaultValue: 'Convention Map Hub' })}</Text>
          <Text as="p" className={styles.subtitle}>
            {t('events.mapHub.subtitle', {
              defaultValue: 'Find convention venues, nearby churches, hotels, airports, parking, transit, and essential services. Use category filters to focus your planning and open turn-by-turn directions instantly.',
            })}
          </Text>
          <div className={styles.actionRow}>
            <Button
              appearance="primary"
              className={styles.ctaButtonPrimary}
              onClick={() => navigate('/membership')}
            >
              {t('events.mapHub.actions.registerMembership', { defaultValue: 'Register Membership' })}
            </Button>
            <Button
              appearance="secondary"
              className={styles.ctaButtonSecondary}
              onClick={() => navigate('/events')}
            >
              {t('events.mapHub.actions.backToEvents', { defaultValue: 'Back to Events' })}
            </Button>
          </div>
        </div>

        <Card className={styles.controlsCard}>
          <div className={styles.filters}>
            {categories.map((categoryKey) => {
              const meta = CATEGORY_META[categoryKey] || { defaultLabel: categoryKey, color: '#0f6cbd' };
              const isActive = activeCategory === categoryKey;
              const label = meta.labelKey
                ? t(meta.labelKey, { defaultValue: meta.defaultLabel || categoryKey })
                : (meta.defaultLabel || categoryKey);

              return (
                <Button
                  key={categoryKey}
                  appearance={isActive ? 'primary' : 'secondary'}
                  className={`${styles.filterButton}${isActive ? ` ${styles.activeFilterButton} ${activeFilterClassNames[categoryKey] || ''}` : ''}`}
                  onClick={() => {
                    setActiveCategory(categoryKey);
                    trackCTA('map_filter', 'convention_map', categoryKey);
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </div>

          <div className={styles.searchRow}>
            <Input
              className={styles.searchInput}
              type="search"
              size="large"
              placeholder={t('events.mapHub.search.placeholder', { defaultValue: 'Search nearby places around the main venue' })}
              value={searchQuery}
              onChange={(_, data) => setSearchQuery(data.value)}
              aria-label={t('events.mapHub.search.ariaLabel', { defaultValue: 'Search convention map locations' })}
            />
            <Text className={styles.searchHint}>
              {t('events.mapHub.search.hintBase', { defaultValue: 'Search uses Google Places and stays focused near the main convention venue.' })}
              {searchState === 'loading' ? ` ${t('events.mapHub.search.loading', { defaultValue: 'Searching nearby places...' })}` : ''}
              {searchState === 'empty' ? ` ${t('events.mapHub.search.empty', { defaultValue: 'No nearby matches found.' })}` : ''}
              {searchState === 'error' ? ` ${t('events.mapHub.search.error', { defaultValue: 'Nearby search is unavailable right now.' })}` : ''}
            </Text>
          </div>
        </Card>

        <Card className={styles.mapCard}>
          <div className={styles.mapMetaRow}>
            <Text as="span" className={styles.mapMetaLabel}>{t('events.mapHub.map.sectionLabel', { defaultValue: 'Interactive Venue Area Map' })}</Text>
            <Text as="span" className={styles.mapMetaCount}>
              {t('events.mapHub.map.showingCount', {
                count: displayedLocations.length,
                defaultValue: `Showing ${displayedLocations.length} location${displayedLocations.length === 1 ? '' : 's'}`,
              })}
            </Text>
          </div>
          <div className={styles.mapShell}>
            {/* Map canvas always rendered so Maps SDK initializes into a real element */}
            <div
              ref={mapRef}
              className={styles.mapCanvas}
              role="application"
              aria-label={t('events.mapHub.map.ariaLabel', { defaultValue: 'Convention locations map' })}
            />

            {/* Clear directions button shown while a route is active */}
            {directionsActive && (
              <div className={styles.mapActions}>
                <button
                  onClick={guideMeHere}
                  className={`${styles.mapActionButton} ${styles.mapPrimaryActionButton}`}
                >
                    {t('events.mapHub.directions.guideMeHere', { defaultValue: 'Guide Me Here' })}
                </button>
                <button
                  onClick={openExternalNavigation}
                  className={`${styles.mapActionButton} ${styles.mapSecondaryActionButton}`}
                >
                    {t('events.mapHub.directions.openInGoogleMaps', { defaultValue: 'Open in Google Maps' })}
                </button>
                <button
                  onClick={() => {
                    directionsRendererRef.current.setDirections({ routes: [] });
                    setDirectionsActive(false);
                    setActiveRoute(null);
                  }}
                  className={`${styles.mapActionButton} ${styles.mapNeutralActionButton}`}
                >
                  {t('events.mapHub.directions.clearDirections', { defaultValue: 'Clear Directions' })}
                </button>
              </div>
            )}

            {/* Overlays on top while loading or on error */}
            {loadingLocations && (
              <div className={styles.mapOverlay}>
                <Spinner size="medium" label={t('events.mapHub.map.loadingLocations', { defaultValue: 'Loading map locations...' })} />
              </div>
            )}

            {!loadingLocations && mapsState === 'error' && (
              <div className={styles.mapOverlay}>
                <Text>{mapsError}</Text>
              </div>
            )}

            {!loadingLocations && mapsState === 'loading' && (
              <div className={styles.mapOverlay}>
                <Spinner size="medium" label={t('events.mapHub.map.initializing', { defaultValue: 'Initializing map...' })} />
              </div>
            )}
          </div>

          <div
            ref={directionsPanelRef}
            className={`${styles.directionsPanel} ${!directionsActive ? styles.directionsPanelHidden : ''}`}
            aria-live="polite"
          />

          {directionsActive && (
            <Text className={styles.directionsHint}>
              {t('events.mapHub.directions.hint', {
                defaultValue: 'Follow these steps to stay on NAACUS map, or use "Open in Google Maps" for native navigation.',
              })}
            </Text>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}

export default ConventionMapPage;
