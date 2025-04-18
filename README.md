# Kenya Fuel Price Tracker

A web application that displays and tracks fuel prices across different towns in Kenya. The data is sourced from the Energy and Petroleum Regulatory Authority (EPRA) Kenya.

## Features

- Real-time fuel price data from EPRA
- Search functionality by town name
- Pagination with customizable entries per page
- Responsive design for all devices
- Clean and modern user interface
- Automatic data updates

## Data Source

This application uses data from the [Energy and Petroleum Regulatory Authority (EPRA) Kenya](https://www.epra.go.ke/pump-prices). The data is updated regularly to provide accurate fuel price information.

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (Vanilla)
- Backend:
  - Node.js
  - Express.js
- Development Tools:
  - Nodemon (for development)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/alemcyril/fuel-tracker.git
cd fuel-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
fuel-tracker/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
├── nodemon.json
└── README.md
```

## Development

- `server.js`: Main server file handling API endpoints
- `public/index.html`: Main HTML structure
- `public/style.css`: Styles and layout
- `public/script.js`: Client-side functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
