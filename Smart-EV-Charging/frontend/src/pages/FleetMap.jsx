import React, { useState, useEffect, useRef, useMemo } from 'react';
import { stationsApi, vehiclesApi } from '../services/api';
import { initialStations, initialVehicles } from '../services/mockData';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/FleetMap.css';
import {
  Zap,
  Car,
  MapPin,
  BatteryCharging,
  Gauge,
  Activity,
  Layers,
  Search,
  RefreshCw,
  ArrowRight,
  Shield,
  Navigation,
  X,
  Compass,
  AlertTriangle,
  Radio,
  Sliders,
  CheckCircle2,
  XCircle,
  Clock,
  LocateFixed,
  Route as RouteIcon,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Haversine distance calculation in km
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

const FleetMap = () => {
  const [stations, setStations] = useState(initialStations);
  const [fleet, setFleet] = useState(() => {
    const indianLocations = [
      { lat: 12.9784, lng: 77.6408 }, // Indiranagar, Bengaluru
      { lat: 12.9352, lng: 77.6245 }, // Koramangala, Bengaluru
      { lat: 12.8452, lng: 77.6602 }, // Electronic City, Bengaluru
      { lat: 12.9698, lng: 77.7499 }, // Whitefield, Bengaluru
      { lat: 13.0827, lng: 80.2707 }, // Chennai Central, TN
      { lat: 12.9010, lng: 80.2279 }, // OMR Sholinganallur, Chennai
      { lat: 13.0067, lng: 80.2024 }, // Guindy, Chennai
      { lat: 11.0168, lng: 76.9558 }, // Coimbatore, TN
      { lat: 11.0285, lng: 77.0125 }, // Peelamedu, Coimbatore
      { lat: 11.6643, lng: 78.1460 }, // Salem NH-44, TN
      { lat: 12.7409, lng: 77.8253 }, // Hosur SIPCOT, TN
      { lat: 9.9252, lng: 78.1098 },  // Madurai Bypass, TN
      { lat: 13.1986, lng: 77.7066 }, // Kempegowda Airport, BLR
      { lat: 12.9279, lng: 77.6271 }, // BTM Layout, BLR
      { lat: 12.9141, lng: 77.6109 }, // JP Nagar, BLR
      { lat: 12.9915, lng: 77.5855 }, // Malleshwaram, BLR
      { lat: 12.9863, lng: 80.2173 }, // Velachery, Chennai
      { lat: 11.6843, lng: 78.1260 }, // Mamangam, Salem
      { lat: 12.7291, lng: 77.8384 }, // Sipcot Phase 2, Hosur
      { lat: 9.9185, lng: 78.1400 }   // Anna Nagar, Madurai
    ];
    return initialVehicles.map((v, i) => {
      const loc = indianLocations[i % indianLocations.length];
      return {
        ...v,
        license_plate: v.vehicle_number,
        latitude: loc.lat + (Math.random() * 0.008 - 0.004),
        longitude: loc.lng + (Math.random() * 0.008 - 0.004),
        status: i % 3 === 0 ? 'charging' : i % 3 === 1 ? 'en_route' : 'idle',
        battery_level: 60 + ((i * 7) % 38),
        battery_capacity: v.battery_capacity,
        current_power_kw: i % 3 === 0 ? 60 : 0
      };
    });
  });
  const [summary, setSummary] = useState({
    total_fleet: 20,
    charging_now: 7,
    en_route: 7,
    idle: 6,
    avg_battery_percent: 76,
    total_power_draw_kw: 420
  });
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [autoSimulate, setAutoSimulate] = useState(true);
  const [latestUpdateNotice, setLatestUpdateNotice] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  const [activeFilter, setActiveFilter] = useState('all'); // all, stations, available, occupied, full, maintenance, vehicles, charging, en_route
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // { type: 'station' | 'vehicle', data: ... }
  const [stationPorts, setStationPorts] = useState(() => {
    const pMap = {};
    initialStations.forEach((s) => {
      pMap[s.station_id] = s.ports || [];
    });
    return pMap;
  });
  const [simLoading, setSimLoading] = useState(false);
  const [mapTheme, setMapTheme] = useState('streets'); // 'streets' | 'satellite'

  // User GPS and Navigation Route states (Default: Bengaluru, Karnataka)
  const [userLocation, setUserLocation] = useState({ lat: 12.9716, lng: 77.5946 }); // Bengaluru Central
  const [activeRoute, setActiveRoute] = useState(null); // { destination: station, distanceKm: 0, etaMins: 0 }

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const hasFittedRef = useRef(false);

  // Resilient fetch for stations and fleet data (strictly uses verified Indian stations from mockData)
  const fetchData = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setIsSyncing(true);
      }

      // Always maintain the verified Indian stations across Bengaluru & Tamil Nadu
      setStations(initialStations);

      setLastSyncTime(new Date());
    } catch (err) {
      console.error('Failed to load fleet map data:', err);
    } finally {
      if (!silent) setLoading(false);
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch individual port details for selected station
  const fetchStationPorts = async (stationId) => {
    const localSt = initialStations.find((s) => s.station_id === stationId);
    if (localSt && localSt.ports && localSt.ports.length > 0) {
      setStationPorts((prev) => ({ ...prev, [stationId]: localSt.ports }));
    }
  };

  // When a station is selected, load its ports
  useEffect(() => {
    if (selectedItem?.type === 'station' && selectedItem.data?.station_id) {
      fetchStationPorts(selectedItem.data.station_id);
    }
  }, [selectedItem?.data?.station_id]);

  // Live EV Port Telemetry Simulation Engine: cycles port states between Available, Charging/Occupied, Maintenance
  useEffect(() => {
    if (!autoSimulate || stations.length === 0) return;

    const interval = setInterval(() => {
      // Pick a random station
      const randStIdx = Math.floor(Math.random() * stations.length);
      const targetStation = stations[randStIdx];
      const currentPorts = stationPorts[targetStation.station_id] || targetStation.ports || [];
      if (currentPorts.length === 0) return;

      const randPortIdx = Math.floor(Math.random() * currentPorts.length);
      const targetPort = currentPorts[randPortIdx];

      // Transition statuses
      let nextStatus = 'Available';
      const cur = (targetPort.status || '').toLowerCase();
      if (cur === 'available') {
        nextStatus = Math.random() > 0.35 ? 'Charging' : 'Maintenance';
      } else if (cur === 'charging' || cur === 'occupied' || cur === 'booked') {
        nextStatus = Math.random() > 0.4 ? 'Available' : 'Charging';
      } else {
        nextStatus = 'Available';
      }

      const updatedPorts = currentPorts.map((p, idx) =>
        idx === randPortIdx ? { ...p, status: nextStatus } : p
      );

      const newAvailableCount = updatedPorts.filter(p => p.status.toLowerCase() === 'available').length;
      const newOccupiedCount = updatedPorts.filter(p => p.status.toLowerCase() === 'charging' || p.status.toLowerCase() === 'occupied' || p.status.toLowerCase() === 'booked').length;
      const newOccStatus = updatedPorts.every(p => p.status.toLowerCase() === 'maintenance')
        ? 'maintenance'
        : newAvailableCount === 0
        ? 'full'
        : newOccupiedCount > 0
        ? 'occupied'
        : 'available';

      // Update stations
      setStations(prev =>
        prev.map((s, idx) =>
          idx === randStIdx
            ? {
                ...s,
                ports: updatedPorts,
                available_ports: newAvailableCount,
                occupied_ports: newOccupiedCount,
                occupancy_status: newOccStatus
              }
            : s
        )
      );

      // Update stationPorts
      setStationPorts(prev => ({
        ...prev,
        [targetStation.station_id]: updatedPorts
      }));

      // Set live telemetry ticker notice
      setLatestUpdateNotice({
        stationId: targetStation.station_id,
        stationName: targetStation.station_name,
        portNumber: targetPort.port_number,
        portId: targetPort.port_id,
        status: nextStatus,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });

      // Keep selectedItem updated
      setSelectedItem(prev => {
        if (prev && prev.type === 'station' && prev.data.station_id === targetStation.station_id) {
          return {
            type: 'station',
            data: {
              ...prev.data,
              ports: updatedPorts,
              available_ports: newAvailableCount,
              occupied_ports: newOccupiedCount,
              occupancy_status: newOccStatus
            }
          };
        }
        return prev;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [autoSimulate, stations, stationPorts]);

  // Handle manual station state simulation (Full, Maintenance, Occupied, Available)
  const handleSimulateState = (stationId, state) => {
    setSimLoading(true);
    setTimeout(() => {
      setStations(prev =>
        prev.map(st => {
          if (st.station_id === stationId) {
            const currentPorts = stationPorts[stationId] || st.ports || [];
            let updatedPorts = [];
            if (state === 'full') {
              updatedPorts = currentPorts.map(p => ({ ...p, status: 'Charging' }));
            } else if (state === 'maintenance') {
              updatedPorts = currentPorts.map(p => ({ ...p, status: 'Maintenance' }));
            } else if (state === 'available') {
              updatedPorts = currentPorts.map(p => ({ ...p, status: 'Available' }));
            } else if (state === 'occupied') {
              updatedPorts = currentPorts.map((p, idx) => ({
                ...p,
                status: idx === 0 ? 'Charging' : 'Available'
              }));
            }
            const avail = updatedPorts.filter(p => p.status.toLowerCase() === 'available').length;
            const occ = updatedPorts.filter(p => p.status.toLowerCase() === 'charging' || p.status.toLowerCase() === 'occupied').length;
            return {
              ...st,
              ports: updatedPorts,
              available_ports: avail,
              occupied_ports: occ,
              occupancy_status: state
            };
          }
          return st;
        })
      );

      setStationPorts(prev => {
        const currentPorts = prev[stationId] || [];
        let updatedPorts = [];
        if (state === 'full') updatedPorts = currentPorts.map(p => ({ ...p, status: 'Charging' }));
        else if (state === 'maintenance') updatedPorts = currentPorts.map(p => ({ ...p, status: 'Maintenance' }));
        else if (state === 'available') updatedPorts = currentPorts.map(p => ({ ...p, status: 'Available' }));
        else if (state === 'occupied') updatedPorts = currentPorts.map((p, idx) => ({ ...p, status: idx === 0 ? 'Charging' : 'Available' }));
        return { ...prev, [stationId]: updatedPorts };
      });

      setSelectedItem(prev => {
        if (prev && prev.type === 'station' && prev.data.station_id === stationId) {
          return {
            type: 'station',
            data: {
              ...prev.data,
              occupancy_status: state
            }
          };
        }
        return prev;
      });
      setSimLoading(false);
    }, 150);
  };

  // Locate User via HTML5 Geolocation API
  const handleLocateUser = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation({ lat, lng });
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1 });
          }
        },
        (err) => {
          console.warn('Geolocation denied or unavailable, using Bengaluru center:', err.message);
          const defaultLoc = { lat: 12.9716, lng: 77.5946 };
          setUserLocation(defaultLoc);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([defaultLoc.lat, defaultLoc.lng], 12);
          }
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    }
  };

  // Recenter map to Bengaluru Hub
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([12.9716, 77.5946], 10, { duration: 1.2 });
    }
  };

  // Generate and draw an interactive navigation route to a station
  const handleNavigateToStation = (st) => {
    const destLat = parseFloat(st.latitude);
    const destLng = parseFloat(st.longitude);
    if (isNaN(destLat) || isNaN(destLng) || !mapInstanceRef.current) return;

    const startLat = userLocation ? userLocation.lat : 12.9716;
    const startLng = userLocation ? userLocation.lng : 77.5946;

    const distKm = calculateDistanceKm(startLat, startLng, destLat, destLng);
    const etaMins = Math.max(3, Math.round((distKm / 45) * 60)); // Avg 45 km/h urban EV speed

    setActiveRoute({
      destination: st,
      distanceKm: distKm,
      distanceMi: (distKm * 0.621371).toFixed(1),
      etaMins
    });

    if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers();

      // Create an aesthetic, multi-waypoint road route polyline
      const midLat = (startLat + destLat) / 2 + (Math.random() - 0.5) * 0.015;
      const midLng = (startLng + destLng) / 2 + (Math.random() - 0.5) * 0.015;
      const latlngs = [
        [startLat, startLng],
        [(startLat * 2 + midLat) / 3, (startLng * 2 + midLng) / 3],
        [midLat, midLng],
        [(midLat + destLat * 2) / 3, (midLng + destLng * 2) / 3],
        [destLat, destLng]
      ];

      // 1. Neon glow backdrop line
      const glowLine = L.polyline(latlngs, {
        color: '#33e1ed',
        weight: 9,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      });

      // 2. High-contrast inner laser polyline
      const coreLine = L.polyline(latlngs, {
        color: '#c6ff3d',
        weight: 4,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      });

      routeLayerRef.current.addLayer(glowLine);
      routeLayerRef.current.addLayer(coreLine);

      // Fit map to route bounds with comfortable padding
      mapInstanceRef.current.fitBounds(L.latLngBounds(latlngs), {
        padding: [80, 80],
        maxZoom: 14
      });
    }
  };

  const handleClearRoute = () => {
    setActiveRoute(null);
    if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers();
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.9716, 77.5946],
        zoom: 9,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Standard clean OpenStreetMap tiles
      const initialTiles = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          subdomains: ['a', 'b', 'c']
        }
      );

      initialTiles.addTo(map);
      tileLayerRef.current = initialTiles;

      // Layer groups for markers, routes, and user position
      const routeLayer = L.layerGroup().addTo(map);
      routeLayerRef.current = routeLayer;

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      const userLayer = L.layerGroup().addTo(map);
      userMarkerRef.current = userLayer;

      mapInstanceRef.current = map;

      // Handle resize observer to ensure no grey tiles
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
      setTimeout(() => {
        map.invalidateSize();
      }, 350);
      setTimeout(() => {
        map.invalidateSize();
      }, 800);

      return () => {
        resizeObserver.disconnect();
        map.remove();
        mapInstanceRef.current = null;
      };
    }
  }, []);

  // Update user GPS location pin on map
  useEffect(() => {
    if (!mapInstanceRef.current || !userMarkerRef.current || !userLocation) return;

    userMarkerRef.current.clearLayers();

    const userIconHtml = `
      <div class="custom-user-location-pin" title="Your Location">
        <div class="user-pulse"></div>
        <div class="user-core"></div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userIconHtml,
      className: 'leaflet-user-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 });
    marker.bindPopup(`
      <div class="map-popup-card">
        <h4 style="margin:0 0 4px 0; color:#3b82f6; font-size:0.85rem;">📍 You Are Here</h4>
        <p style="margin:0; font-size:0.75rem; color:#94a3b8;">GPS Origin for navigation & distance</p>
      </div>
    `);
    userMarkerRef.current.addLayer(marker);
  }, [userLocation]);

  // Handle map theme switch
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    let newTileLayer;
    if (mapTheme === 'satellite') {
      newTileLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      );
    } else {
      newTileLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19, subdomains: ['a', 'b', 'c'] }
      );
    }

    newTileLayer.addTo(mapInstanceRef.current);
    tileLayerRef.current = newTileLayer;

    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);
  }, [mapTheme]);

  // Search Results for dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();

    const matchedStations = stations
      .filter(
        (s) =>
          s.station_name.toLowerCase().includes(query) ||
          s.location.toLowerCase().includes(query)
      )
      .map((s) => ({ type: 'station', data: s }));

    const matchedFleet = fleet
      .filter(
        (v) =>
          v.vehicle_model.toLowerCase().includes(query) ||
          v.license_plate.toLowerCase().includes(query) ||
          v.driver_name?.toLowerCase().includes(query)
      )
      .map((v) => ({ type: 'vehicle', data: v }));

    return [...matchedStations, ...matchedFleet].slice(0, 8);
  }, [searchQuery, stations, fleet]);

  // Handle selection from search dropdown
  const handleSelectSearchResult = (result) => {
    setSelectedItem(result);
    setShowSearchDropdown(false);

    const lat = parseFloat(result.data.latitude);
    const lng = parseFloat(result.data.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      mapInstanceRef.current?.flyTo([lat, lng], 14, { duration: 1.2 });
    }

    if (result.type === 'station') {
      fetchStationPorts(result.data.station_id);
    }
  };

  // Render Markers whenever stations, fleet, or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    // 1. Render Charging Station Markers
    if (activeFilter !== 'vehicles' && activeFilter !== 'en_route') {
      stations.forEach((st) => {
        const lat = parseFloat(st.latitude);
        const lng = parseFloat(st.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const availablePorts = parseInt(st.available_ports || 0, 10);
        const occupiedPorts = parseInt(st.occupied_ports || 0, 10);
        const totalPorts = parseInt(st.total_ports || 0, 10);

        const occStatus =
          st.occupancy_status ||
          (st.status === 'maintenance'
            ? 'maintenance'
            : availablePorts === 0
            ? 'full'
            : occupiedPorts > 0
            ? 'occupied'
            : 'available');

        // Filter checks
        if (activeFilter === 'available' && (occStatus !== 'available' || availablePorts === 0)) return;
        if (activeFilter === 'occupied' && occStatus !== 'occupied') return;
        if (activeFilter === 'full' && occStatus !== 'full') return;
        if (activeFilter === 'maintenance' && occStatus !== 'maintenance') return;
        if (activeFilter === 'charging' && occupiedPorts === 0) return;

        // Search match
        if (searchQuery && !showSearchDropdown) {
          const match =
            st.station_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            st.location.toLowerCase().includes(searchQuery.toLowerCase());
          if (!match) return;
        }

        let statusClass = 'station-pin-available';
        let badgeClass = 'badge-avail';
        let badgeText = `${availablePorts}/${totalPorts}`;

        if (occStatus === 'maintenance') {
          statusClass = 'station-pin-maintenance';
          badgeClass = 'badge-maint';
          badgeText = 'MAINT';
        } else if (occStatus === 'full') {
          statusClass = 'station-pin-full';
          badgeClass = 'badge-full';
          badgeText = 'FULL';
        } else if (occStatus === 'occupied') {
          statusClass = 'station-pin-occupied';
          badgeClass = 'badge-occupied';
          badgeText = `${availablePorts}/${totalPorts}`;
        }

        const iconHtml = `
          <div class="custom-station-pin ${statusClass}" title="${st.station_name} — ${occStatus.toUpperCase()}">
            <div class="pin-pulse"></div>
            <div class="pin-core">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div class="pin-badge ${badgeClass}">${badgeText}</div>
          </div>
        `;

        const stationIcon = L.divIcon({
          html: iconHtml,
          className: 'leaflet-station-marker',
          iconSize: [42, 42],
          iconAnchor: [21, 21]
        });

        const marker = L.marker([lat, lng], { icon: stationIcon });

        // Bind interactive rich popup with individual port booking
        const distFromUser = userLocation ? calculateDistanceKm(userLocation.lat, userLocation.lng, lat, lng) : null;
        const ports = stationPorts[st.station_id] || st.ports || [];
        const portsHtml = ports.length > 0 ? ports.map(p => {
          const isMaint = (p.status || '').toLowerCase() === 'maintenance';
          const isAvail = (p.status || '').toLowerCase() === 'available';
          return `
            <div class="popup-port-row">
              <div>
                <strong style="color:var(--text-main); font-size:0.75rem;">${p.port_number}</strong>
                <span style="font-size:0.68rem; color:#94a3b8; margin-left:3px;">(${p.port_type} • ${p.power_rating}kW)</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <span class="port-badge-status port-badge-${p.status}">${p.status}</span>
                <a href="/booking?stationId=${st.station_id}&portId=${p.port_id}" class="btn-port-book-direct ${isMaint ? 'disabled' : ''}">
                  ${isAvail ? 'Book Port →' : 'Reserve →'}
                </a>
              </div>
            </div>
          `;
        }).join('') : '<div style="font-size:0.72rem; color:#94a3b8; text-align:center; padding:4px;">Telemetry ports ready</div>';

        const popupContent = `
          <div class="map-popup-card">
            <div class="popup-header">
              <h4 class="popup-title">${st.station_name}</h4>
              <span class="admin-badge ${occStatus === 'available' ? 'badge-available' : occStatus === 'occupied' ? 'badge-occupied' : occStatus === 'full' ? 'badge-failed' : 'badge-maintenance'}">
                ${occStatus.toUpperCase()}
              </span>
            </div>
            <div class="popup-location">📍 ${st.location} ${distFromUser ? `• <strong>${distFromUser} km</strong>` : ''}</div>
            <div class="popup-meta-grid">
              <div class="popup-meta-item">
                <div class="popup-meta-label">Open Ports</div>
                <div class="popup-meta-val">${availablePorts} / ${totalPorts}</div>
              </div>
              <div class="popup-meta-item">
                <div class="popup-meta-label">Tariff</div>
                <div class="popup-meta-val">₹${parseFloat(st.price_per_kwh).toFixed(2)}/kWh</div>
              </div>
            </div>

            <!-- Direct Port Selection -->
            <div class="popup-ports-container">
              <div class="popup-ports-title">
                <span>Select Connector Port</span>
                <span>⚡ Live Status</span>
              </div>
              <div class="popup-port-list">
                ${portsHtml}
              </div>
            </div>

            <div class="popup-actions-grid">
              <button id="btn-popup-nav-${st.station_id}" class="btn-popup-nav">
                ⚡ Navigate
              </button>
              <a href="/booking?stationId=${st.station_id}" class="btn-popup-book">
                Book Any Port →
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const navBtn = document.getElementById(`btn-popup-nav-${st.station_id}`);
          if (navBtn) {
            navBtn.onclick = () => {
              handleNavigateToStation(st);
              marker.closePopup();
            };
          }
        });

        marker.on('click', () => {
          setSelectedItem({ type: 'station', data: st });
          fetchStationPorts(st.station_id);
        });

        layer.addLayer(marker);
      });
    }

    // 2. Render Fleet Vehicles
    if (
      activeFilter !== 'stations' &&
      activeFilter !== 'available' &&
      activeFilter !== 'full' &&
      activeFilter !== 'maintenance'
    ) {
      fleet.forEach((veh) => {
        const lat = parseFloat(veh.latitude);
        const lng = parseFloat(veh.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        if (activeFilter === 'charging' && veh.status !== 'charging') return;
        if (activeFilter === 'en_route' && veh.status !== 'en_route') return;
        if (activeFilter === 'occupied' && veh.status !== 'charging') return;

        // Search match
        if (searchQuery && !showSearchDropdown) {
          const match =
            veh.vehicle_model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            veh.license_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
            veh.driver_name?.toLowerCase().includes(searchQuery.toLowerCase());
          if (!match) return;
        }

        const isCharging = veh.status === 'charging';
        const isEnRoute = veh.status === 'en_route';

        const statusClass = isCharging
          ? 'vehicle-pin-charging'
          : isEnRoute
          ? 'vehicle-pin-enroute'
          : 'vehicle-pin-idle';

        const batteryColor =
          veh.battery_level > 60
            ? 'var(--accent-emerald)'
            : veh.battery_level > 25
            ? 'var(--accent-volt)'
            : 'var(--accent-rose)';

        const vehicleHtml = `
          <div class="custom-vehicle-pin ${statusClass}" title="${veh.vehicle_model} (${veh.license_plate})">
            ${isCharging ? '<div class="charging-sparkle-ring"></div>' : ''}
            <div class="vehicle-icon-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                <circle cx="7" cy="17" r="2"></circle>
                <path d="M9 17h6"></path>
                <circle cx="17" cy="17" r="2"></circle>
              </svg>
            </div>
            <div class="vehicle-soc-badge" style="border-color: ${batteryColor}">
              ${veh.battery_level}%
            </div>
          </div>
        `;

        const vehicleIcon = L.divIcon({
          html: vehicleHtml,
          className: 'leaflet-vehicle-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const marker = L.marker([lat, lng], { icon: vehicleIcon });

        marker.bindPopup(`
          <div class="map-popup-card">
            <h4 style="margin:0 0 4px 0; color:#c084fc; font-size:0.9rem;">🚗 ${veh.vehicle_model}</h4>
            <p style="margin:0 0 6px 0; font-size:0.75rem; color:#94a3b8;">Plate: <strong>${veh.license_plate}</strong> • Driver: ${veh.driver_name}</p>
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; background:rgba(0,0,0,0.4); padding:6px; border-radius:4px;">
              <span>Battery: <strong>${veh.battery_level}%</strong></span>
              <span>Status: <strong style="text-transform:capitalize;">${veh.status}</strong></span>
            </div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedItem({ type: 'vehicle', data: veh });
        });

        layer.addLayer(marker);
      });
    }
  }, [stations, fleet, activeFilter, searchQuery, showSearchDropdown, userLocation]);

  // Station counts by status
  const availableCount = stations.filter((s) => s.occupancy_status === 'available').length;
  const occupiedCount = stations.filter((s) => s.occupancy_status === 'occupied').length;
  const fullCount = stations.filter((s) => s.occupancy_status === 'full').length;
  const maintCount = stations.filter((s) => s.occupancy_status === 'maintenance').length;

  return (
    <div className="fleet-map-page-wrapper">
      {/* Real-time Telemetry Live Ticker Banner */}
      {latestUpdateNotice && (
        <div className="live-port-ticker-bar">
          <div className="ticker-left">
            <span className="ticker-pulse-badge">LIVE AUTO-TELEMETRY</span>
            <span>
              Port <strong>{latestUpdateNotice.portNumber}</strong> at <strong>{latestUpdateNotice.stationName}</strong> updated to{' '}
              <span className={`port-badge-status port-badge-${latestUpdateNotice.status}`}>
                {latestUpdateNotice.status.toUpperCase()}
              </span>
            </span>
          </div>
          <span className="text-xs text-muted font-mono">{latestUpdateNotice.time}</span>
        </div>
      )}

      {/* Top Telemetry KPI Ribbon */}
      <div className="map-kpi-ribbon">
        <div className="kpi-ribbon-item">
          <div className="kpi-icon-pill icon-emerald">
            <MapPin size={18} />
          </div>
          <div>
            <div className="kpi-label">Stations Network</div>
            <div className="kpi-val">
              {stations.length} <span className="kpi-sub">Nodes</span>
            </div>
          </div>
        </div>

        <div className="kpi-ribbon-item">
          <div className="kpi-icon-pill icon-emerald">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div className="kpi-label">Available Nodes</div>
            <div className="kpi-val">
              {availableCount} <span className="kpi-sub">Ready</span>
            </div>
          </div>
        </div>

        <div className="kpi-ribbon-item">
          <div className="kpi-icon-pill icon-cyan">
            <Zap size={18} />
          </div>
          <div>
            <div className="kpi-label">Active Charging</div>
            <div className="kpi-val">
              {occupiedCount} <span className="kpi-sub">Busy</span>
            </div>
          </div>
        </div>

        <div className="kpi-ribbon-item">
          <div className="kpi-icon-pill icon-rose">
            <XCircle size={18} />
          </div>
          <div>
            <div className="kpi-label">Full Capacity</div>
            <div className="kpi-val">
              {fullCount} <span className="kpi-sub">0 Slots</span>
            </div>
          </div>
        </div>

        <div className="kpi-ribbon-item">
          <div className="kpi-icon-pill icon-volt">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="kpi-label">Maintenance</div>
            <div className="kpi-val">
              {maintCount} <span className="kpi-sub">Offline</span>
            </div>
          </div>
        </div>

        <div className="kpi-ribbon-item">
          <div className="kpi-icon-pill icon-purple">
            <Car size={18} />
          </div>
          <div>
            <div className="kpi-label">Fleet EVs</div>
            <div className="kpi-val">
              {summary.total_fleet || fleet.length} <span className="kpi-sub">Tracked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Map Control & Search Toolbar */}
      <div className="map-floating-toolbar" style={{ position: 'relative', top: 'auto', left: 'auto', right: 'auto', width: '100%', marginBottom: '0.5rem' }}>
        {/* Interactive Search with Auto-Suggestions Dropdown */}
          <div className="toolbar-search-wrapper">
            <div className="toolbar-search-box">
              <Search size={16} className="text-muted" />
              <input
                type="text"
                placeholder="Search node, city, or EV..."
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                  className="btn-clear-search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {showSearchDropdown && searchResults.length > 0 && (
              <div className="toolbar-search-dropdown">
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="search-dropdown-item"
                    onClick={() => handleSelectSearchResult(item)}
                  >
                    <div className={`dropdown-icon ${item.type === 'station' ? 'station-icon' : 'vehicle-icon'}`}>
                      {item.type === 'station' ? <Zap size={16} /> : <Car size={16} />}
                    </div>
                    <div className="dropdown-text">
                      <div className="dropdown-title">
                        {item.type === 'station' ? item.data.station_name : item.data.vehicle_model}
                      </div>
                      <div className="dropdown-sub">
                        {item.type === 'station'
                          ? item.data.location
                          : `Plate: ${item.data.license_plate} • ${item.data.driver_name}`}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-muted" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter Chips */}
          <div className="filter-chips-group">
            <button
              onClick={() => setActiveFilter('all')}
              className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
            >
              All Assets ({stations.length + fleet.length})
            </button>
            <button
              onClick={() => setActiveFilter('stations')}
              className={`filter-chip ${activeFilter === 'stations' ? 'active' : ''}`}
            >
              <Zap size={14} /> Stations ({stations.length})
            </button>
            <button
              onClick={() => setActiveFilter('available')}
              className={`filter-chip ${activeFilter === 'available' ? 'active' : ''}`}
            >
              <span className="legend-dot dot-available"></span> Available ({availableCount})
            </button>
            <button
              onClick={() => setActiveFilter('occupied')}
              className={`filter-chip ${activeFilter === 'occupied' ? 'active' : ''}`}
            >
              <span className="legend-dot dot-occupied"></span> Busy ({occupiedCount})
            </button>
            <button
              onClick={() => setActiveFilter('full')}
              className={`filter-chip ${activeFilter === 'full' ? 'active' : ''}`}
            >
              <span className="legend-dot dot-full"></span> Full ({fullCount})
            </button>
            <button
              onClick={() => setActiveFilter('maintenance')}
              className={`filter-chip ${activeFilter === 'maintenance' ? 'active' : ''}`}
            >
              <span className="legend-dot dot-maintenance"></span> Offline ({maintCount})
            </button>
            <button
              onClick={() => setActiveFilter('vehicles')}
              className={`filter-chip ${activeFilter === 'vehicles' ? 'active' : ''}`}
            >
              <Car size={14} /> Fleet ({fleet.length})
            </button>
          </div>

          {/* Quick Action Tools */}
          <div className="toolbar-right-actions">
            {/* GPS Locate Me Button */}
            <button
              onClick={handleLocateUser}
              className="btn-map-tool"
              title="Locate Me (Show My GPS Location)"
            >
              <LocateFixed size={15} className="text-cyan" />
              <span>Locate Me</span>
            </button>

            {/* Live Auto-Sync Indicator */}
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`live-sync-pill ${isSyncing ? 'syncing' : ''}`}
              title={autoSync ? 'Live auto-polling active. Click to pause.' : 'Live auto-polling paused. Click to resume.'}
            >
              <span className="sync-dot"></span>
              <span>{isSyncing ? 'SYNCING...' : autoSync ? 'AUTO-SYNC ON' : 'SYNC PAUSED'}</span>
            </button>

            {/* Live Traffic Simulator Button */}
            <button
              onClick={() => setAutoSimulate(!autoSimulate)}
              className={`btn-map-tool ${autoSimulate ? 'active-sim' : ''}`}
              title="Automatically simulate realistic EV arrivals and moving vehicle trajectories"
              style={autoSimulate ? { borderColor: 'var(--accent-volt)', color: 'var(--accent-volt)' } : {}}
            >
              <Activity size={15} className={autoSimulate ? 'spin-icon text-volt' : ''} />
              <span>Simulate: {autoSimulate ? 'ON' : 'OFF'}</span>
            </button>

            {/* Map Theme Toggle */}
            <button
              onClick={() => setMapTheme(mapTheme === 'streets' ? 'satellite' : 'streets')}
              className="btn-map-tool"
              title="Toggle Map Style (Clean Streets / Satellite)"
            >
              <Layers size={15} />
              <span className="capitalize">{mapTheme === 'satellite' ? 'Satellite' : 'Clean Streets'}</span>
            </button>

            {/* Recenter Bengaluru Hub */}
            <button onClick={handleResetView} className="btn-map-tool" title="Recenter on Bengaluru Hub">
              <Compass size={15} />
              <span>Bengaluru Hub</span>
            </button>

            {/* Manual Refresh */}
            <button onClick={() => fetchData(false)} className="btn-map-tool" title="Force Refresh Data">
              <RefreshCw size={15} className={loading ? 'spin-icon' : ''} />
            </button>
          </div>
        </div>

        {/* Main Map Viewport & Overlay Controls */}
        <div
          className="map-viewport-container"
          style={{
            position: 'relative',
            width: '100%',
            height: '620px',
            minHeight: '620px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)'
          }}
        >
          {/* Leaflet Map Canvas */}
          <div
            ref={mapContainerRef}
            className="leaflet-map-canvas"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1
            }}
          />

          {/* Floating Quick Legend */}
          <div className="map-floating-legend">
          <div className="legend-item">
            <span className="legend-dot dot-available"></span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-occupied"></span>
            <span>Occupied (Charging)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-full"></span>
            <span>Full (0 Slots)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-maintenance"></span>
            <span>Maintenance</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-charging"></span>
            <span>EV Charging ⚡</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-enroute"></span>
            <span>EV En Route 🚗</span>
          </div>
        </div>

        {/* Active Route Navigation HUD */}
        {activeRoute && (
          <div className="map-navigation-hud">
            <div className="nav-hud-left">
              <div className="nav-hud-icon">
                <Navigation size={22} />
              </div>
              <div className="nav-hud-details">
                <h4>Routing to {activeRoute.destination.station_name}</h4>
                <div className="nav-hud-sub">{activeRoute.destination.location}</div>
              </div>
            </div>

            <div className="nav-hud-stats">
              <div className="nav-stat-item">
                <div className="nav-stat-val">{activeRoute.distanceKm} km</div>
                <div className="nav-stat-label">{activeRoute.distanceMi} miles</div>
              </div>
              <div className="nav-stat-item">
                <div className="nav-stat-val text-cyan">~{activeRoute.etaMins} mins</div>
                <div className="nav-stat-label">Estimated Drive</div>
              </div>
              <div className="nav-stat-item">
                <div className="nav-stat-val text-emerald">${parseFloat(activeRoute.destination.price_per_kwh).toFixed(2)}</div>
                <div className="nav-stat-label">Per kWh</div>
              </div>
            </div>

            <div className="nav-hud-actions">
              <Link
                to={`/booking?stationId=${activeRoute.destination.station_id}`}
                className="admin-btn-primary admin-btn-sm"
              >
                <Zap size={14} />
                <span>Book Slot</span>
              </Link>
              <button onClick={handleClearRoute} className="btn-clear-route">
                <X size={14} />
                <span>Exit Route</span>
              </button>
            </div>
          </div>
        )}

        {/* Interactive Detail Drawer / Side Sheet */}
        {selectedItem && (
          <div className="map-detail-drawer">
            <div className="drawer-header">
              <div className="drawer-title-flex">
                <div className={`drawer-icon-box ${selectedItem.type === 'station' ? 'box-station' : 'box-vehicle'}`}>
                  {selectedItem.type === 'station' ? <Zap size={22} /> : <Car size={22} />}
                </div>
                <div>
                  <div className="drawer-category">
                    {selectedItem.type === 'station' ? 'CHARGING STATION NODE' : 'FLEET EV ASSET'}
                  </div>
                  <h3>
                    {selectedItem.type === 'station'
                      ? selectedItem.data.station_name
                      : selectedItem.data.vehicle_model}
                  </h3>
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="btn-drawer-close">
                <X size={18} />
              </button>
            </div>

            <div className="drawer-body">
              {selectedItem.type === 'station' ? (
                <>
                  {/* Status Banner */}
                  {selectedItem.data.occupancy_status === 'full' ? (
                    <div className="drawer-status-banner banner-full">
                      <XCircle size={18} />
                      <span>FULL CAPACITY — 0 AVAILABLE PORTS</span>
                    </div>
                  ) : selectedItem.data.occupancy_status === 'maintenance' ? (
                    <div className="drawer-status-banner banner-maintenance">
                      <AlertTriangle size={18} />
                      <span>UNDER MAINTENANCE — OFFLINE</span>
                    </div>
                  ) : selectedItem.data.occupancy_status === 'occupied' ? (
                    <div className="drawer-status-banner banner-occupied">
                      <Zap size={18} />
                      <span>ACTIVE CHARGING — {selectedItem.data.available_ports} PORTS OPEN</span>
                    </div>
                  ) : (
                    <div className="drawer-status-banner banner-available">
                      <CheckCircle2 size={18} />
                      <span>AVAILABLE — ALL PORTS READY</span>
                    </div>
                  )}

                  <div className="drawer-info-row" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={16} className="text-muted" />
                      <span>{selectedItem.data.location}</span>
                    </div>
                    {userLocation && (
                      <span className="distance-tag">
                        ⚡ {calculateDistanceKm(userLocation.lat, userLocation.lng, selectedItem.data.latitude, selectedItem.data.longitude)} km away
                      </span>
                    )}
                  </div>

                  <div className="drawer-grid-stats">
                    <div className="drawer-stat-card">
                      <div className="stat-label">Price / kWh</div>
                      <div className="stat-val text-emerald">₹${parseFloat(selectedItem.data.price_per_kwh).toFixed(2)}</div>
                    </div>
                    <div className="drawer-stat-card">
                      <div className="stat-label">Available Ports</div>
                      <div className="stat-val text-cyan">
                        {selectedItem.data.available_ports} / {selectedItem.data.total_ports}
                      </div>
                    </div>
                    <div className="drawer-stat-card">
                      <div className="stat-label">Occupied Ports</div>
                      <div className="stat-val text-warning">{selectedItem.data.occupied_ports || 0}</div>
                    </div>
                    <div className="drawer-stat-card">
                      <div className="stat-label">Occupancy State</div>
                      <div className="stat-val capitalize text-primary font-bold">
                        {selectedItem.data.occupancy_status}
                      </div>
                    </div>
                  </div>

                  {/* Individual Ports Breakdown */}
                  <div className="drawer-ports-section">
                    <div className="drawer-ports-header">
                      <span>Charging Ports Breakdown</span>
                      <span>{stationPorts[selectedItem.data.station_id]?.length || selectedItem.data.total_ports} Ports</span>
                    </div>

                    <div className="drawer-ports-list">
                      {stationPorts[selectedItem.data.station_id] &&
                      stationPorts[selectedItem.data.station_id].length > 0 ? (
                        stationPorts[selectedItem.data.station_id].map((p) => (
                          <div key={p.port_id} className="drawer-port-row">
                            <div>
                              <strong>{p.port_number}</strong>
                              <span className="text-xs text-muted ml-2">
                                ({p.port_type} • {p.power_rating}kW)
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className={`port-badge-status port-badge-${p.status}`}>
                                {p.status}
                              </span>
                              {p.status.toLowerCase() === 'available' ? (
                                <Link
                                  to={`/booking?stationId=${selectedItem.data.station_id}&portId=${p.port_id}`}
                                  className="btn-port-book-direct"
                                >
                                  Book Port →
                                </Link>
                              ) : p.status.toLowerCase() === 'maintenance' ? (
                                <span className="text-xs text-muted">Offline</span>
                              ) : (
                                <Link
                                  to={`/booking?stationId=${selectedItem.data.station_id}&portId=${p.port_id}`}
                                  className="btn-port-book-direct"
                                  style={{ background: '#F59E0B', color: '#78350F' }}
                                >
                                  Reserve Next →
                                </Link>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-muted text-center py-2">
                          Loading port telemetry...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navigation Route Trigger Button */}
                  <div style={{ marginTop: '0.75rem' }}>
                    <button
                      onClick={() => handleNavigateToStation(selectedItem.data)}
                      className="admin-btn-secondary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <Navigation size={16} className="text-cyan" />
                      <span>Draw Navigation Route & Drive ETA</span>
                    </button>
                  </div>

                  {/* Interactive State Simulator Tool for this station */}
                  <div className="drawer-simulation-bar" style={{ marginTop: '0.75rem' }}>
                    <div className="sim-title">
                      <Sliders size={13} />
                      <span>Live Test: Simulate Node Status</span>
                    </div>
                    <div className="sim-buttons-grid">
                      <button
                        disabled={simLoading}
                        onClick={() => handleSimulateState(selectedItem.data.station_id, 'full')}
                        className="btn-sim btn-sim-full"
                        title="Simulate all ports occupied (Full)"
                      >
                        🔴 Full
                      </button>
                      <button
                        disabled={simLoading}
                        onClick={() => handleSimulateState(selectedItem.data.station_id, 'occupied')}
                        className="btn-sim btn-sim-occ"
                        title="Simulate 1 port occupied (Charging)"
                      >
                        🔵 Busy
                      </button>
                      <button
                        disabled={simLoading}
                        onClick={() => handleSimulateState(selectedItem.data.station_id, 'available')}
                        className="btn-sim btn-sim-avail"
                        title="Simulate all ports open (Available)"
                      >
                        🟢 Open
                      </button>
                      <button
                        disabled={simLoading}
                        onClick={() => handleSimulateState(selectedItem.data.station_id, 'maintenance')}
                        className="btn-sim btn-sim-maint"
                        title="Simulate station offline (Maintenance)"
                      >
                        🟡 Maint
                      </button>
                    </div>
                  </div>

                  <div className="drawer-action-group">
                    <Link
                      to={`/booking?stationId=${selectedItem.data.station_id}`}
                      className="btn-drawer-primary"
                    >
                      <Zap size={16} />
                      <span>Book Charging Slot</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="drawer-info-row">
                    <Shield size={16} className="text-cyan" />
                    <span>
                      License: <strong className="font-mono text-cyan">{selectedItem.data.license_plate}</strong>
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      Driver: <strong>{selectedItem.data.driver_name}</strong>
                    </span>
                  </div>

                  <div className="battery-soc-progress-box">
                    <div className="soc-header">
                      <span>Battery State of Charge (SoC)</span>
                      <span className="font-bold">{selectedItem.data.battery_level}%</span>
                    </div>
                    <div className="soc-bar-bg">
                      <div
                        className="soc-bar-fill"
                        style={{
                          width: `${selectedItem.data.battery_level}%`,
                          backgroundColor:
                            selectedItem.data.battery_level > 60
                              ? 'var(--accent-emerald)'
                              : selectedItem.data.battery_level > 25
                              ? 'var(--accent-volt)'
                              : 'var(--accent-rose)'
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="drawer-grid-stats">
                    <div className="drawer-stat-card">
                      <div className="stat-label">Operational Status</div>
                      <div className="stat-val text-primary capitalize">
                        {selectedItem.data.status === 'charging'
                          ? '⚡ Charging'
                          : selectedItem.data.status === 'en_route'
                          ? '🚗 En Route'
                          : '🅿️ Idle'}
                      </div>
                    </div>
                    <div className="drawer-stat-card">
                      <div className="stat-label">Battery Capacity</div>
                      <div className="stat-val text-cyan">{selectedItem.data.battery_capacity} kWh</div>
                    </div>
                    <div className="drawer-stat-card">
                      <div className="stat-label">Current Power Draw</div>
                      <div className="stat-val text-warning">{selectedItem.data.current_power_kw || 0} kW</div>
                    </div>
                    <div className="drawer-stat-card">
                      <div className="stat-label">Connector Type</div>
                      <div className="stat-val text-emerald">{selectedItem.data.port_type}</div>
                    </div>
                  </div>

                  {selectedItem.data.assigned_station && (
                    <div className="drawer-assigned-station-box">
                      <div className="assigned-title">
                        <Zap size={14} className="text-emerald" />
                        <span>Connected to Charger Node</span>
                      </div>
                      <div className="font-semibold text-primary">
                        {selectedItem.data.assigned_station.station_name}
                      </div>
                      <div className="text-xs text-muted">
                        Port: {selectedItem.data.assigned_station.port_number} • {selectedItem.data.assigned_station.station_location}
                      </div>
                    </div>
                  )}

                  <div className="drawer-action-group">
                    <Link to="/charging-session" className="btn-drawer-primary">
                      <BatteryCharging size={16} />
                      <span>View Live Telemetry Session</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FleetMap;
