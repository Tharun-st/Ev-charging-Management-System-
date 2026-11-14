// ====================================================================
// SMART EV CHARGING MANAGEMENT SYSTEM - SAMPLE MOCK DATA (INDIA LOCALIZED)
// Purpose: Provides clean, separated sample data for Frontend UI demonstration.
// Localized for India (Bengaluru, Tamil Nadu, Indian EV Models, INR ₹ Currency)
// ====================================================================

export const initialUsers = [
  {
    user_id: 1,
    name: 'Admin Officer',
    email: 'admin@smartev.in',
    phone: '+91 98450 12345',
    role: 'admin',
    status: 'Active',
    created_at: '2026-01-01'
  },
  {
    user_id: 2,
    name: 'Priya Sharma',
    email: 'priya.sharma@example.in',
    phone: '+91 98801 23456',
    role: 'user',
    status: 'Active',
    created_at: '2026-01-12'
  },
  {
    user_id: 3,
    name: 'Karthik Ramanathan',
    email: 'karthik.r@example.in',
    phone: '+91 94440 98765',
    role: 'user',
    status: 'Active',
    created_at: '2026-02-05'
  },
  {
    user_id: 4,
    name: 'Arun Venkatesh',
    email: 'arun.v@example.in',
    phone: '+91 97908 11223',
    role: 'user',
    status: 'Active',
    created_at: '2026-02-18'
  },
  {
    user_id: 5,
    name: 'Deepa Krishnan',
    email: 'deepa.k@example.in',
    phone: '+91 98402 33445',
    role: 'user',
    status: 'Active',
    created_at: '2026-03-01'
  }
];

// 20 Indian EV Models (Electric Cars, SUVs, 2-Wheelers & Commercial)
export const initialVehicles = [
  {
    vehicle_id: 1,
    user_id: 2,
    user_name: 'Priya Sharma',
    vehicle_model: 'Tata Nexon EV Empowered Plus',
    vehicle_number: 'KA-01-EV-2024',
    battery_capacity: 45.0,
    port_type: 'CCS2 Fast DC',
    created_at: '2026-01-12'
  },
  {
    vehicle_id: 2,
    user_id: 2,
    user_name: 'Priya Sharma',
    vehicle_model: 'Tata Punch EV Long Range',
    vehicle_number: 'KA-03-EV-5542',
    battery_capacity: 35.0,
    port_type: 'CCS2 Fast DC',
    created_at: '2026-02-01'
  },
  {
    vehicle_id: 3,
    user_id: 3,
    user_name: 'Karthik Ramanathan',
    vehicle_model: 'Tata Curvv EV 55',
    vehicle_number: 'TN-09-EV-8821',
    battery_capacity: 55.0,
    port_type: 'CCS2 Fast DC',
    created_at: '2026-02-05'
  },
  {
    vehicle_id: 4,
    user_id: 4,
    user_name: 'Arun Venkatesh',
    vehicle_model: 'Tata Tiago EV XZ+ Tech LUX',
    vehicle_number: 'KA-05-EV-1190',
    battery_capacity: 24.0,
    port_type: 'CCS2 Fast DC',
    created_at: '2026-02-18'
  },
  {
    vehicle_id: 5,
    user_id: 5,
    user_name: 'Deepa Krishnan',
    vehicle_model: 'Tata Tigor EV XZ+',
    vehicle_number: 'TN-07-EV-3312',
    battery_capacity: 26.0,
    port_type: 'CCS2 Fast DC',
    created_at: '2026-03-01'
  },
  {
    vehicle_id: 6,
    user_id: 3,
    user_name: 'Karthik Ramanathan',
    vehicle_model: 'Mahindra XUV400 EL Pro',
    vehicle_number: 'KA-04-EV-9014',
    battery_capacity: 39.4,
    port_type: 'CCS2 Fast DC',
    created_at: '2026-03-10'
  },
  {
    vehicle_id: 7,
    user_id: 2,
    user_name: 'Priya Sharma',
    vehicle_model: 'Mahindra BE 6e',
    vehicle_number: 'TN-02-EV-6643',
    battery_capacity: 79.0,
    port_type: 'CCS2 Ultra-Fast DC',
    created_at: '2026-03-15'
  },
  {
    vehicle_id: 8,
    user_id: 4,
    user_name: 'Arun Venkatesh',
    vehicle_model: 'Mahindra XEV 9e',
    vehicle_number: 'KA-51-EV-4421',
    battery_capacity: 79.0,
    port_type: 'CCS2 Ultra-Fast DC',
    created_at: '2026-03-20'
  },
  {
    vehicle_id: 9,
    user_id: 3,
    user_name: 'Karthik Ramanathan',
    vehicle_model: 'MG ZS EV Exclusive Plus',
    vehicle_number: 'TN-10-EV-7729',
    battery_capacity: 50.3,
    port_type: 'CCS2 Fast DC',
    created_at: '2026-03-22'
  },
  {
    vehicle_id: 10,
    user_id: 2,
    user_name: 'Priya Sharma',
    vehicle_model: 'MG Windsor EV Essence',
    vehicle_number: 'KA-02-EV-1823',
    battery_capacity: 38.0,
    port_type: 'CCS2 Fast DC',
    created_at: '2026-03-25'
  },
  {
    vehicle_id: 11,
    user_id: 5,
    user_name: 'Deepa Krishnan',
    vehicle_model: 'MG Comet EV Plush',
    vehicle_number: 'KA-41-EV-3290',
    battery_capacity: 17.3,
    port_type: 'Type 2 AC',
    created_at: '2026-04-01'
  },
  {
    vehicle_id: 12,
    user_id: 3,
    user_name: 'Karthik Ramanathan',
    vehicle_model: 'Hyundai Ioniq 5 RWD',
    vehicle_number: 'TN-14-EV-9901',
    battery_capacity: 72.6,
    port_type: 'CCS2 Ultra-Fast DC',
    created_at: '2026-04-05'
  },
  {
    vehicle_id: 13,
    user_id: 2,
    user_name: 'Priya Sharma',
    vehicle_model: 'Hyundai Creta Electric',
    vehicle_number: 'KA-01-EV-6610',
    battery_capacity: 50.0,
    port_type: 'CCS2 Fast DC',
    created_at: '2026-04-10'
  },
  {
    vehicle_id: 14,
    user_id: 4,
    user_name: 'Arun Venkatesh',
    vehicle_model: 'Hyundai Kona Electric Premium',
    vehicle_number: 'TN-01-EV-4215',
    battery_capacity: 39.2,
    port_type: 'CCS2 Fast DC',
    created_at: '2026-04-15'
  },
  {
    vehicle_id: 15,
    user_id: 3,
    user_name: 'Karthik Ramanathan',
    vehicle_model: 'Kia EV6 GT-Line AWD',
    vehicle_number: 'KA-03-EV-7700',
    battery_capacity: 77.4,
    port_type: 'CCS2 Ultra-Fast DC',
    created_at: '2026-04-20'
  },
  {
    vehicle_id: 16,
    user_id: 5,
    user_name: 'Deepa Krishnan',
    vehicle_model: 'BYD Atto 3 Superior',
    vehicle_number: 'TN-04-EV-5020',
    battery_capacity: 60.48,
    port_type: 'CCS2 Fast DC',
    created_at: '2026-04-25'
  },
  {
    vehicle_id: 17,
    user_id: 2,
    user_name: 'Priya Sharma',
    vehicle_model: 'BYD Seal Performance AWD',
    vehicle_number: 'KA-04-EV-1008',
    battery_capacity: 82.5,
    port_type: 'CCS2 Ultra-Fast DC',
    created_at: '2026-05-01'
  },
  {
    vehicle_id: 18,
    user_id: 4,
    user_name: 'Arun Venkatesh',
    vehicle_model: 'Ola S1 Pro Gen 2',
    vehicle_number: 'KA-05-EV-7112',
    battery_capacity: 4.0,
    port_type: 'Type 2 AC',
    created_at: '2026-05-05'
  },
  {
    vehicle_id: 19,
    user_id: 3,
    user_name: 'Karthik Ramanathan',
    vehicle_model: 'Ather 450X Apex',
    vehicle_number: 'TN-09-EV-3184',
    battery_capacity: 3.7,
    port_type: 'Type 2 AC',
    created_at: '2026-05-10'
  },
  {
    vehicle_id: 20,
    user_id: 5,
    user_name: 'Deepa Krishnan',
    vehicle_model: 'Tata Ace EV Mini-Truck',
    vehicle_number: 'KA-02-EV-9988',
    battery_capacity: 21.3,
    port_type: 'CCS2 Fast DC',
    created_at: '2026-05-15'
  }
];

// 12 Indian EV Charging Stations across Bengaluru (Karnataka) & Tamil Nadu
export const initialStations = [
  {
    station_id: 1,
    station_name: 'BESCOM Smart EV Hub - Vidhana Soudha',
    location: 'Ambedkar Veedhi, Central Bengaluru, Karnataka',
    latitude: 12.9797,
    longitude: 77.5907,
    total_ports: 4,
    available_ports: 3,
    charger_type: 'CCS2 Fast DC (60kW) & Type 2 AC',
    price_per_kwh: 17.50,
    status: 'Active',
    ports: [
      { port_id: 101, port_number: 'P1-01', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Available' },
      { port_id: 102, port_number: 'P1-02', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Charging' },
      { port_id: 103, port_number: 'P1-03', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' },
      { port_id: 104, port_number: 'P1-04', port_type: 'Type 2 AC', power_rating: 7.4, status: 'Available' }
    ]
  },
  {
    station_id: 2,
    station_name: 'Zeon Fast Charge Hub - Indiranagar',
    location: '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka',
    latitude: 12.9784,
    longitude: 77.6408,
    total_ports: 4,
    available_ports: 2,
    charger_type: 'CCS2 Ultra-Fast DC (120kW)',
    price_per_kwh: 19.00,
    status: 'Active',
    ports: [
      { port_id: 201, port_number: 'P2-01', port_type: 'CCS2 Ultra-Fast DC', power_rating: 120, status: 'Available' },
      { port_id: 202, port_number: 'P2-02', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Charging' },
      { port_id: 203, port_number: 'P2-03', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' },
      { port_id: 204, port_number: 'P2-04', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Booked' }
    ]
  },
  {
    station_id: 3,
    station_name: 'Tata Power Supercharging - Electronic City',
    location: 'Phase 1, Hosur Main Rd, Electronic City, Bengaluru, Karnataka',
    latitude: 12.8452,
    longitude: 77.6602,
    total_ports: 6,
    available_ports: 4,
    charger_type: 'CCS2 Fast DC (60kW) & Bharat DC-001',
    price_per_kwh: 18.00,
    status: 'Active',
    ports: [
      { port_id: 301, port_number: 'P3-01', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Available' },
      { port_id: 302, port_number: 'P3-02', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Charging' },
      { port_id: 303, port_number: 'P3-03', port_type: 'CCS2 Ultra-Fast DC', power_rating: 150, status: 'Available' },
      { port_id: 304, port_number: 'P3-04', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' },
      { port_id: 305, port_number: 'P3-05', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' },
      { port_id: 306, port_number: 'P3-06', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Maintenance' }
    ]
  },
  {
    station_id: 4,
    station_name: 'Statiq Mega Station - Koramangala',
    location: '80 Feet Rd, 5th Block, Koramangala, Bengaluru, Karnataka',
    latitude: 12.9352,
    longitude: 77.6245,
    total_ports: 4,
    available_ports: 3,
    charger_type: 'CCS2 Ultra-Fast DC (150kW) & Type 2',
    price_per_kwh: 18.50,
    status: 'Active',
    ports: [
      { port_id: 401, port_number: 'P4-01', port_type: 'CCS2 Ultra-Fast DC', power_rating: 150, status: 'Available' },
      { port_id: 402, port_number: 'P4-02', port_type: 'CCS2 Ultra-Fast DC', power_rating: 150, status: 'Available' },
      { port_id: 403, port_number: 'P4-03', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Charging' },
      { port_id: 404, port_number: 'P4-04', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' }
    ]
  },
  {
    station_id: 5,
    station_name: 'Jio-bp Pulse Hypercharge - Whitefield',
    location: 'ITPL Main Rd, KIADB Export Promotion Park, Whitefield, Bengaluru',
    latitude: 12.9698,
    longitude: 77.7499,
    total_ports: 4,
    available_ports: 1,
    charger_type: 'CCS2 Fast DC (60kW)',
    price_per_kwh: 19.50,
    status: 'Active',
    ports: [
      { port_id: 501, port_number: 'P5-01', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Charging' },
      { port_id: 502, port_number: 'P5-02', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Charging' },
      { port_id: 503, port_number: 'P5-03', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' },
      { port_id: 504, port_number: 'P5-04', port_type: 'Type 2 AC', power_rating: 22, status: 'Booked' }
    ]
  },
  {
    station_id: 6,
    station_name: 'Shell Recharge Superhub - Kempegowda Airport',
    location: 'KIAL Road, Devanahalli, Bengaluru, Karnataka',
    latitude: 13.1986,
    longitude: 77.7066,
    total_ports: 6,
    available_ports: 5,
    charger_type: 'CCS2 Ultra-Fast DC (180kW) & Type 2',
    price_per_kwh: 21.00,
    status: 'Active',
    ports: [
      { port_id: 601, port_number: 'P6-01', port_type: 'CCS2 Ultra-Fast DC', power_rating: 180, status: 'Available' },
      { port_id: 602, port_number: 'P6-02', port_type: 'CCS2 Ultra-Fast DC', power_rating: 180, status: 'Available' },
      { port_id: 603, port_number: 'P6-03', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Charging' },
      { port_id: 604, port_number: 'P6-04', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Available' },
      { port_id: 605, port_number: 'P6-05', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' },
      { port_id: 606, port_number: 'P6-06', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' }
    ]
  },
  {
    station_id: 7,
    station_name: 'Relux Electric Hub - OMR IT Expressway',
    location: 'Sholinganallur Junction, Rajiv Gandhi Salai (OMR), Chennai, Tamil Nadu',
    latitude: 12.9010,
    longitude: 80.2279,
    total_ports: 6,
    available_ports: 4,
    charger_type: 'CCS2 Fast DC (120kW) & CHAdeMO',
    price_per_kwh: 18.50,
    status: 'Active',
    ports: [
      { port_id: 701, port_number: 'P7-01', port_type: 'CCS2 Ultra-Fast DC', power_rating: 120, status: 'Available' },
      { port_id: 702, port_number: 'P7-02', port_type: 'CCS2 Ultra-Fast DC', power_rating: 120, status: 'Charging' },
      { port_id: 703, port_number: 'P7-03', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Available' },
      { port_id: 704, port_number: 'P7-04', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Available' },
      { port_id: 705, port_number: 'P7-05', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' },
      { port_id: 706, port_number: 'P7-06', port_type: 'CHAdeMO Fast DC', power_rating: 50, status: 'Maintenance' }
    ]
  },
  {
    station_id: 8,
    station_name: 'Tata Power Fast Charger - Guindy Industrial Estate',
    location: 'Mount Road, Guindy, Chennai, Tamil Nadu',
    latitude: 13.0067,
    longitude: 80.2024,
    total_ports: 4,
    available_ports: 2,
    charger_type: 'CCS2 Fast DC (60kW) & Type 2',
    price_per_kwh: 17.00,
    status: 'Active',
    ports: [
      { port_id: 801, port_number: 'P8-01', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Available' },
      { port_id: 802, port_number: 'P8-02', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Charging' },
      { port_id: 803, port_number: 'P8-03', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' },
      { port_id: 804, port_number: 'P8-04', port_type: 'Type 2 AC', power_rating: 22, status: 'Booked' }
    ]
  },
  {
    station_id: 9,
    station_name: 'Zeon Superfast Hub - Avinashi Road',
    location: 'Peelamedu, Near Airport, Avinashi Rd, Coimbatore, Tamil Nadu',
    latitude: 11.0285,
    longitude: 77.0125,
    total_ports: 4,
    available_ports: 3,
    charger_type: 'CCS2 Ultra-Fast DC (120kW)',
    price_per_kwh: 19.50,
    status: 'Active',
    ports: [
      { port_id: 901, port_number: 'P9-01', port_type: 'CCS2 Ultra-Fast DC', power_rating: 120, status: 'Available' },
      { port_id: 902, port_number: 'P9-02', port_type: 'CCS2 Ultra-Fast DC', power_rating: 120, status: 'Available' },
      { port_id: 903, port_number: 'P9-03', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Charging' },
      { port_id: 904, port_number: 'P9-04', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' }
    ]
  },
  {
    station_id: 10,
    station_name: 'Ather Grid Mega Hub - Salem NH-44 Corridor',
    location: 'Bangalore-Salem Highway (NH-44), Mamangam, Salem, Tamil Nadu',
    latitude: 11.6843,
    longitude: 78.1260,
    total_ports: 4,
    available_ports: 0,
    charger_type: 'CCS2 Fast DC & Fast AC',
    price_per_kwh: 16.50,
    status: 'Maintenance',
    ports: [
      { port_id: 1001, port_number: 'P10-01', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Maintenance' },
      { port_id: 1002, port_number: 'P10-02', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Maintenance' },
      { port_id: 1003, port_number: 'P10-03', port_type: 'Type 2 AC', power_rating: 22, status: 'Maintenance' },
      { port_id: 1004, port_number: 'P10-04', port_type: 'Type 2 AC', power_rating: 22, status: 'Maintenance' }
    ]
  },
  {
    station_id: 11,
    station_name: 'BPCL e-Drive Fast Charger - Hosur SIPCOT',
    location: 'SIPCOT Industrial Complex 1, Bangalore-Chennai Corridor, Hosur, Tamil Nadu',
    latitude: 12.7409,
    longitude: 77.8253,
    total_ports: 4,
    available_ports: 3,
    charger_type: 'CCS2 Fast DC (60kW) & Type 2 AC',
    price_per_kwh: 17.50,
    status: 'Active',
    ports: [
      { port_id: 1101, port_number: 'P11-01', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Available' },
      { port_id: 1102, port_number: 'P11-02', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Charging' },
      { port_id: 1103, port_number: 'P11-03', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' },
      { port_id: 1104, port_number: 'P11-04', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' }
    ]
  },
  {
    station_id: 12,
    station_name: 'ChargeZone Express - Bypass Road Madurai',
    location: 'Madurai-Dindigul Highway Bypass, Ponmeni, Madurai, Tamil Nadu',
    latitude: 9.9252,
    longitude: 78.1098,
    total_ports: 4,
    available_ports: 2,
    charger_type: 'CCS2 Fast DC (60kW)',
    price_per_kwh: 18.00,
    status: 'Active',
    ports: [
      { port_id: 1201, port_number: 'P12-01', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Available' },
      { port_id: 1202, port_number: 'P12-02', port_type: 'CCS2 Fast DC', power_rating: 60, status: 'Charging' },
      { port_id: 1203, port_number: 'P12-03', port_type: 'Type 2 AC', power_rating: 22, status: 'Available' },
      { port_id: 1204, port_number: 'P12-04', port_type: 'Type 2 AC', power_rating: 22, status: 'Booked' }
    ]
  }
];

// Flattened ports list for Admin Charging Port Management
export const initialPorts = [
  { port_id: 101, port_number: 'P1-01', station_id: 1, station: 'BESCOM Smart EV Hub - Vidhana Soudha', charger_type: 'CCS2 Fast DC (60kW)', status: 'Available' },
  { port_id: 102, port_number: 'P1-02', station_id: 1, station: 'BESCOM Smart EV Hub - Vidhana Soudha', charger_type: 'CCS2 Fast DC (60kW)', status: 'Charging' },
  { port_id: 103, port_number: 'P1-03', station_id: 1, station: 'BESCOM Smart EV Hub - Vidhana Soudha', charger_type: 'Type 2 AC (22kW)', status: 'Available' },
  { port_id: 104, port_number: 'P1-04', station_id: 1, station: 'BESCOM Smart EV Hub - Vidhana Soudha', charger_type: 'Type 2 AC (7.4kW)', status: 'Available' },
  { port_id: 201, port_number: 'P2-01', station_id: 2, station: 'Zeon Fast Charge Hub - Indiranagar', charger_type: 'CCS2 Ultra-Fast DC (120kW)', status: 'Available' },
  { port_id: 202, port_number: 'P2-02', station_id: 2, station: 'Zeon Fast Charge Hub - Indiranagar', charger_type: 'CCS2 Fast DC (60kW)', status: 'Charging' },
  { port_id: 203, port_number: 'P2-03', station_id: 2, station: 'Zeon Fast Charge Hub - Indiranagar', charger_type: 'Type 2 AC (22kW)', status: 'Available' },
  { port_id: 204, port_number: 'P2-04', station_id: 2, station: 'Zeon Fast Charge Hub - Indiranagar', charger_type: 'CCS2 Fast DC (60kW)', status: 'Booked' },
  { port_id: 301, port_number: 'P3-01', station_id: 3, station: 'Tata Power Supercharging - Electronic City', charger_type: 'CCS2 Fast DC (60kW)', status: 'Available' },
  { port_id: 302, port_number: 'P3-02', station_id: 3, station: 'Tata Power Supercharging - Electronic City', charger_type: 'CCS2 Fast DC (60kW)', status: 'Charging' },
  { port_id: 303, port_number: 'P3-03', station_id: 3, station: 'Tata Power Supercharging - Electronic City', charger_type: 'CCS2 Ultra-Fast DC (150kW)', status: 'Available' },
  { port_id: 401, port_number: 'P4-01', station_id: 4, station: 'Statiq Mega Station - Koramangala', charger_type: 'CCS2 Ultra-Fast DC (150kW)', status: 'Available' },
  { port_id: 501, port_number: 'P5-01', station_id: 5, station: 'Jio-bp Pulse Hypercharge - Whitefield', charger_type: 'CCS2 Fast DC (60kW)', status: 'Charging' },
  { port_id: 601, port_number: 'P6-01', station_id: 6, station: 'Shell Recharge Superhub - Kempegowda Airport', charger_type: 'CCS2 Ultra-Fast DC (180kW)', status: 'Available' },
  { port_id: 701, port_number: 'P7-01', station_id: 7, station: 'Relux Electric Hub - OMR IT Expressway, Chennai', charger_type: 'CCS2 Ultra-Fast DC (120kW)', status: 'Available' },
  { port_id: 801, port_number: 'P8-01', station_id: 8, station: 'Tata Power Fast Charger - Guindy, Chennai', charger_type: 'CCS2 Fast DC (60kW)', status: 'Available' },
  { port_id: 901, port_number: 'P9-01', station_id: 9, station: 'Zeon Superfast Hub - Avinashi Rd, Coimbatore', charger_type: 'CCS2 Ultra-Fast DC (120kW)', status: 'Available' },
  { port_id: 1101, port_number: 'P11-01', station_id: 11, station: 'BPCL e-Drive Fast Charger - Hosur SIPCOT', charger_type: 'CCS2 Fast DC (60kW)', status: 'Available' }
];

export const initialBookings = [
  {
    booking_id: 101,
    user_id: 2,
    customer_name: 'Priya Sharma',
    vehicle_id: 1,
    vehicle: 'Tata Nexon EV (KA-01-EV-2024)',
    station_id: 1,
    station: 'BESCOM Smart EV Hub - Vidhana Soudha',
    port_id: 101,
    port: 'Port P1-01 (CCS2 Fast DC)',
    date: '2026-09-12',
    start_time: '14:00',
    end_time: '15:00',
    status: 'Confirmed'
  },
  {
    booking_id: 102,
    user_id: 2,
    customer_name: 'Priya Sharma',
    vehicle_id: 2,
    vehicle: 'Tata Punch EV (KA-03-EV-5542)',
    station_id: 2,
    station: 'Zeon Fast Charge Hub - Indiranagar',
    port_id: 201,
    port: 'Port P2-01 (CCS2 Ultra-Fast)',
    date: '2026-09-15',
    start_time: '10:00',
    end_time: '11:00',
    status: 'Confirmed'
  },
  {
    booking_id: 103,
    user_id: 3,
    customer_name: 'Karthik Ramanathan',
    vehicle_id: 3,
    vehicle: 'Tata Curvv EV 55 (TN-09-EV-8821)',
    station_id: 7,
    station: 'Relux Electric Hub - OMR Chennai',
    port_id: 701,
    port: 'Port P7-01 (CCS2 Ultra-Fast)',
    date: '2026-09-08',
    start_time: '09:00',
    end_time: '10:30',
    status: 'Completed'
  },
  {
    booking_id: 104,
    user_id: 4,
    customer_name: 'Arun Venkatesh',
    vehicle_id: 6,
    vehicle: 'Mahindra XUV400 EL Pro (KA-04-EV-9014)',
    station_id: 3,
    station: 'Tata Power Supercharging - Electronic City',
    port_id: 301,
    port: 'Port P3-01 (CCS2 Fast DC)',
    date: '2026-09-05',
    start_time: '16:00',
    end_time: '17:00',
    status: 'Completed'
  },
  {
    booking_id: 105,
    user_id: 5,
    customer_name: 'Deepa Krishnan',
    vehicle_id: 12,
    vehicle: 'Hyundai Ioniq 5 (TN-14-EV-9901)',
    station_id: 8,
    station: 'Tata Power Fast Charger - Guindy Chennai',
    port_id: 804,
    port: 'Port P8-04 (Type 2 AC)',
    date: '2026-09-02',
    start_time: '11:00',
    end_time: '12:00',
    status: 'Cancelled'
  }
];

export const initialActiveSession = {
  session_id: 1001,
  station: 'BESCOM Smart EV Hub - Vidhana Soudha',
  station_id: 1,
  port: 'Port P1-02 (CCS2 Fast DC 60kW)',
  port_id: 102,
  user_name: 'Priya Sharma',
  vehicle: 'Tata Nexon EV Empowered Plus',
  vehicle_number: 'KA-01-EV-2024',
  start_time: '09:15 AM',
  current_duration: '42 mins',
  energy_used: 24.5, // kWh
  battery_level: 76, // %
  initial_battery: 32, // %
  current_cost: 428.75, // ₹
  tariff: 17.50, // ₹/kWh
  voltage: 400.0,
  power_kw: 54.2,
  status: 'Charging'
};

export const initialAllSessions = [
  {
    session_id: 1001,
    user: 'Priya Sharma',
    vehicle: 'Tata Nexon EV (KA-01-EV-2024)',
    station: 'BESCOM Smart EV Hub - Vidhana Soudha',
    port: 'P1-02',
    start_time: '09:15 AM',
    date: '2026-09-10',
    duration: '42 mins',
    energy_consumed: 24.5,
    cost: 428.75,
    status: 'Charging'
  },
  {
    session_id: 1002,
    user: 'Karthik Ramanathan',
    vehicle: 'Tata Curvv EV 55 (TN-09-EV-8821)',
    station: 'Zeon Fast Charge Hub - Indiranagar',
    port: 'P2-02',
    start_time: '09:40 AM',
    date: '2026-09-10',
    duration: '28 mins',
    energy_consumed: 28.2,
    cost: 535.80,
    status: 'Charging'
  },
  {
    session_id: 998,
    user: 'Priya Sharma',
    vehicle: 'Tata Nexon EV (KA-01-EV-2024)',
    station: 'BESCOM Smart EV Hub - Vidhana Soudha',
    port: 'P1-01',
    start_time: '10:00 AM',
    date: '2026-09-08',
    duration: '50 mins',
    energy_consumed: 38.5,
    cost: 673.75,
    status: 'Completed'
  },
  {
    session_id: 995,
    user: 'Karthik Ramanathan',
    vehicle: 'Mahindra BE 6e',
    station: 'Relux Electric Hub - OMR Chennai',
    port: 'P7-02',
    start_time: '02:15 PM',
    date: '2026-09-04',
    duration: '1 hr 10 mins',
    energy_consumed: 54.0,
    cost: 999.00,
    status: 'Completed'
  },
  {
    session_id: 989,
    user: 'Arun Venkatesh',
    vehicle: 'Mahindra XUV400 EL Pro',
    station: 'Tata Power Supercharging - Electronic City',
    port: 'P3-02',
    start_time: '04:10 PM',
    date: '2026-08-28',
    duration: '35 mins',
    energy_consumed: 31.2,
    cost: 561.60,
    status: 'Completed'
  },
  {
    session_id: 981,
    user: 'Deepa Krishnan',
    vehicle: 'MG ZS EV Exclusive Plus',
    station: 'Shell Recharge Superhub - Kempegowda Airport',
    port: 'P6-03',
    start_time: '11:05 AM',
    date: '2026-08-20',
    duration: '45 mins',
    energy_consumed: 42.0,
    cost: 882.00,
    status: 'Completed'
  }
];

export const initialSessionHistory = [
  {
    session_id: 1001,
    date: '2026-09-10',
    station: 'BESCOM Smart EV Hub - Vidhana Soudha',
    vehicle: 'Tata Nexon EV',
    energy_consumed: 24.5,
    duration: '42 mins',
    cost: 428.75,
    status: 'In-Progress'
  },
  {
    session_id: 998,
    date: '2026-09-08',
    station: 'BESCOM Smart EV Hub - Vidhana Soudha',
    vehicle: 'Tata Nexon EV',
    energy_consumed: 38.5,
    duration: '50 mins',
    cost: 673.75,
    status: 'Completed'
  },
  {
    session_id: 995,
    date: '2026-09-04',
    station: 'Relux Electric Hub - OMR Chennai',
    vehicle: 'Mahindra BE 6e',
    energy_consumed: 54.0,
    duration: '1 hr 10 mins',
    cost: 999.00,
    status: 'Completed'
  },
  {
    session_id: 989,
    date: '2026-08-28',
    station: 'Tata Power Supercharging - Electronic City',
    vehicle: 'Mahindra XUV400',
    energy_consumed: 31.2,
    duration: '35 mins',
    cost: 561.60,
    status: 'Completed'
  },
  {
    session_id: 981,
    date: '2026-08-20',
    station: 'Shell Recharge Superhub - Kempegowda Airport',
    vehicle: 'MG ZS EV',
    energy_consumed: 42.0,
    duration: '45 mins',
    cost: 882.00,
    status: 'Completed'
  }
];

export const initialPayments = [
  {
    payment_id: 'PAY-8801',
    session_id: '#998',
    amount: 673.75,
    method: 'UPI (Google Pay)',
    date: '2026-09-08',
    user: 'Priya Sharma',
    status: 'Completed'
  },
  {
    payment_id: 'PAY-8802',
    session_id: '#995',
    amount: 999.00,
    method: 'RuPay Credit Card',
    date: '2026-09-04',
    user: 'Karthik Ramanathan',
    status: 'Completed'
  },
  {
    payment_id: 'PAY-8803',
    session_id: '#989',
    amount: 561.60,
    method: 'UPI (PhonePe)',
    date: '2026-08-28',
    user: 'Arun Venkatesh',
    status: 'Completed'
  },
  {
    payment_id: 'PAY-8804',
    session_id: '#981',
    amount: 882.00,
    method: 'Net Banking (SBI)',
    date: '2026-08-20',
    user: 'Deepa Krishnan',
    status: 'Completed'
  },
  {
    payment_id: 'PAY-8805',
    session_id: '#1001',
    amount: 428.75,
    method: 'UPI (Paytm)',
    date: '2026-09-10',
    user: 'Priya Sharma',
    status: 'Pending'
  },
  {
    payment_id: 'PAY-8806',
    session_id: '#1002',
    amount: 535.80,
    method: 'UPI (BHIM)',
    date: '2026-09-10',
    user: 'Karthik Ramanathan',
    status: 'Pending'
  }
];

export const initialEnergyChartData = [
  { label: 'Mon', kwh: 14.5, sessions: 1 },
  { label: 'Tue', kwh: 28.0, sessions: 2 },
  { label: 'Wed', kwh: 19.2, sessions: 1 },
  { label: 'Thu', kwh: 38.5, sessions: 2 },
  { label: 'Fri', kwh: 32.4, sessions: 2 },
  { label: 'Sat', kwh: 54.0, sessions: 3 },
  { label: 'Sun', kwh: 24.1, sessions: 1 }
];

export const monthlyReportsData = [
  { month: 'Apr', energy_kwh: 4200, revenue: 73500, bookings: 135 },
  { month: 'May', energy_kwh: 5800, revenue: 104400, bookings: 188 },
  { month: 'Jun', energy_kwh: 7100, revenue: 127800, bookings: 232 },
  { month: 'Jul', energy_kwh: 8900, revenue: 164650, bookings: 295 },
  { month: 'Aug', energy_kwh: 10500, revenue: 194250, bookings: 340 },
  { month: 'Sep', energy_kwh: 12800, revenue: 236800, bookings: 412 }
];

export const adminSummaryStats = {
  total_users: 5,
  total_vehicles: 20,
  charging_stations: 12,
  charging_ports: 56,
  available_ports: 33,
  active_sessions: 2,
  total_bookings: 5,
  total_revenue: 236800.00
};
