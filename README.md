# URL Shortener

A React-based URL shortener application with Material UI that runs on localhost:3000. Features client-side URL shortening, analytics, and expiration management.

## Features

- **Bulk URL Shortening**: Shorten up to 5 URLs at once
- **Custom Shortcodes**: Optional custom shortcodes (3-20 alphanumeric characters)
- **Validity Control**: Set custom expiration times (default 30 minutes)
- **Click Analytics**: Track clicks with timestamps, sources, and geolocation
- **Client-side Storage**: URLs persist across browser sessions using localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Validation**: Client-side validation before submission

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Library**: Material UI (MUI)
- **Routing**: React Router
- **Build Tool**: Vite
- **Logging**: Custom logging middleware with API integration
- **Storage**: localStorage for persistence

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Frontend Test Submission
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to http://localhost:3000

## Project Structure

```
Frontend Test Submission/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navigation.tsx   # App navigation bar
│   │   ├── URLRow.tsx      # URL input form row
│   │   └── ResultCard.tsx  # URL creation result display
│   ├── pages/              # Page components
│   │   ├── URLShortenerPage.tsx  # Main shortening interface
│   │   ├── StatisticsPage.tsx    # Analytics dashboard
│   │   └── RedirectPage.tsx      # Redirect handler
│   ├── hooks/              # Custom React hooks
│   │   ├── useLinks.ts     # Link state management
│   │   └── useNotification.ts    # Notification system
│   ├── utils/              # Utility functions
│   │   ├── validation.ts   # Form validation & helpers
│   │   └── storage.ts      # localStorage utilities
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Core interfaces
│   ├── App.tsx             # Main app component
│   └── main.tsx           # App entry point
└── Logging Middleware/     # Reusable logging package
    ├── logger.js          # Core logging functionality
    ├── README.md          # Logging middleware docs
    └── package.json       # Package configuration
```

## Usage

### Creating Short URLs

1. Navigate to the home page (/)
2. Enter up to 5 URLs in the form
3. Optionally set:
   - Custom validity period (in minutes)
   - Custom shortcode (3-20 alphanumeric characters)
4. Click "Shorten URLs" to generate short links
5. Copy the generated short URLs or click to test them

### Viewing Analytics

1. Navigate to the Statistics page (/stats)
2. View all created short URLs with:
   - Creation timestamp
   - Expiration status
   - Total click count
3. Expand rows to see detailed click analytics:
   - Individual click timestamps
   - Referrer sources
   - Geographic location data

### Using Short Links

- Visit `http://localhost:3000/{shortcode}` to be redirected
- Clicks are automatically tracked for analytics
- Expired links show a friendly error message

## Validation Rules

- **URLs**: Must be well-formed (validated using URL constructor)
- **Validity**: Must be a positive integer (minutes)
- **Custom Shortcodes**: 
  - 3-20 characters long
  - Alphanumeric only (a-z, A-Z, 0-9)
  - Must be unique across all existing links

## Error Handling

The application provides user-friendly error messages for:
- Malformed URLs
- Invalid validity periods
- Shortcode collisions
- Expired links
- Unknown shortcodes
- Network failures

## Logging

The application uses a custom logging middleware that:
- Logs application events and errors
- Integrates with external logging APIs
- Provides structured logging with levels (debug, info, warn, error, fatal)
- Includes automatic retry logic and error handling

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## License

MIT License

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Material UI design system
- Consistent error handling
- Comprehensive logging
