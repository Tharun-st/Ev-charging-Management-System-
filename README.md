# Smart EV Charging Management System

A full-stack EV charging application for drivers and charging-network administrators. Drivers can explore stations, register vehicles, book charging, review sessions and payments, and view energy summaries. Administrators have a separate dashboard for managing users, stations, ports, bookings, sessions, payments, and reports.

The project contains a React/Vite frontend, an Express REST API, and a MySQL database. The detailed database design and SQL examples are documented in [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).

## Features

- Driver registration and login with role-based access to protected pages.
- Station browsing and a fleet map.
- Vehicle registration and booking management.
- Charging-session, energy-consumption, and payment pages.
- An administration area for operational records and reports.
- MySQL schema with sample records, views, functions, procedures, triggers, and transaction examples.

## Technology

- **Frontend:** React 18, Vite, React Router, Axios, Leaflet
- **Backend:** Node.js, Express, JWT, bcryptjs, mysql2
- **Database:** MySQL 8+, InnoDB

## Requirements

- Node.js and npm (Node.js 18 or newer recommended)
- MySQL Server 8.0 or newer
- MySQL command-line client on `PATH` if using the SQL commands below

## Setup on Windows

Run commands from the project root (the directory containing this README).

### 1. Install dependencies

Install dependencies in the root launcher and both application packages:

```powershell
npm install
npm --prefix .\Smart-EV-Charging\backend install
npm --prefix .\Smart-EV-Charging\frontend install
```

### 2. Create and populate the database

The schema script creates `smart_ev_charging` and drops/recreates its tables. **Use it only for a new or disposable development database; back up any data you need first.**

In Command Prompt (`cmd.exe`), from the project root:

```bat
mysql -u root -p < "Smart-EV-Charging\database\schema.sql"
mysql -u root -p smart_ev_charging < "Smart-EV-Charging\database\insert_data.sql"
mysql -u root -p smart_ev_charging < "Smart-EV-Charging\database\views.sql"
mysql -u root -p smart_ev_charging < "Smart-EV-Charging\database\functions.sql"
mysql -u root -p smart_ev_charging < "Smart-EV-Charging\database\procedures.sql"
mysql -u root -p smart_ev_charging < "Smart-EV-Charging\database\triggers.sql"
```

The schema and seed scripts are in `Smart-EV-Charging\database`. `queries.sql` and `transactions.sql` contain examples to run manually after initialization; they are not required to start the application.

### 3. Configure the backend

Create or update `Smart-EV-Charging\backend\.env`:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smart_ev_charging
DB_PORT=3306
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Set a unique, private `JWT_SECRET`; do not commit real credentials or secrets. The backend currently has a built-in JWT fallback if this setting is omitted, so configure your own value rather than relying on that development fallback. The backend defaults to the local MySQL host, `root` user, `smart_ev_charging` database, and port `3306` if the corresponding database settings are omitted. The frontend API client currently targets `http://localhost:5000/api`.

### 4. Start the application

From the project root, start both services:

```powershell
npm start
```

Alternatively, run `.\start.bat`, or start the backend and frontend separately with `.\start-backend.bat` and `.\start-frontend.bat`.

| Service | Address |
|---|---|
| Web application | <http://localhost:5173> |
| API health check | <http://localhost:5000/> |

Stop services launched by `npm start` with `Ctrl+C` in that terminal. **Avoid `stop.bat` if other Node.js applications are running:** it forcefully terminates every `node.exe` process on the computer, not just this project's servers.

## Application output

### API health check

With the backend running, use:

```powershell
curl.exe http://localhost:5000/
```

The API responds with JSON in this shape (the timestamp is generated at request time):

```json
{
  "status": "success",
  "name": "Smart EV Charging Management System API",
  "version": "1.0.0",
  "timestamp": "<ISO-8601 timestamp>"
}
```

### Web application

Open <http://localhost:5173> to see the React application. The driver dashboard includes vehicle and booking summaries, energy and spending cards, booking/session panels, station discovery, and map navigation. Authenticated administrators can open the `/admin` area to view management pages and reports.

The current dashboard uses sample values for some cards, including **86.55 kWh** and **₹1,560**; these are UI demonstration values, not live totals from MySQL. Other pages and API-backed operations require a configured, running database. A successful health check confirms the API process is reachable; it does not by itself confirm database connectivity.

## Build

Create a production frontend bundle:

```powershell
npm run build
```

The generated static assets are written to `Smart-EV-Charging\frontend\dist`.

## Project layout

```text
.
├── README.md
├── PROJECT_DOCUMENTATION.md
├── package.json                 # Root start/build scripts
├── start.bat                    # Starts backend and frontend
└── Smart-EV-Charging
    ├── backend
    │   ├── server.js            # Express API entry point
    │   ├── routes/              # API route modules
    │   ├── controllers/         # Request/business logic
    │   └── config/              # MySQL connection pool
    ├── database                 # Schema, seed data, and SQL examples
    └── frontend
        └── src
            ├── pages/           # Driver and administrator pages
            ├── components/      # Reusable UI components
            ├── context/         # Authentication context
            └── services/        # API client and sample UI data
```

## Test/demo accounts

The SQL seed file documents these development credentials:

- **Administrator:** `admin@smartev.com` / `admin123`
- **Driver:** `alice.johnson@example.com` / `user123`

These are public sample credentials for a local development database only. Do not reuse them in production. The frontend’s sample UI data contains separate demonstration identities; use the seeded database accounts when testing the backend login flow.

## Troubleshooting

- **Database connection failed:** Confirm the MySQL service is running, the database scripts have been applied, and the backend `.env` values match your local MySQL account.
- **Frontend cannot reach API:** Confirm the backend is listening on port `5000` and `FRONTEND_URL` includes `http://localhost:5173`.
- **Port already in use:** Stop the conflicting process or change `PORT` in the backend `.env`; update the frontend API URL too if you change the API port.
- **Tables or routines missing:** Re-run the SQL setup scripts in the order shown above. The schema script drops existing tables, so back up before rerunning it.
