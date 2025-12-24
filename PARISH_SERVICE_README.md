# Parish Service Documentation

## Overview

The Parish Service provides functionality to find Catholic parishes near a given US zip code. It performs two API calls:

1. **Zippopotam.us API** - Converts a zip code to geographic coordinates (latitude/longitude)
2. **UpdateParishData API** - Finds parishes near those coordinates

## Service Files

### 1. `parishService.js`
Main service class that handles all parish-related operations.

**Key Methods:**

```javascript
// Search parishes by zip code (main method)
await parishService.searchParishes(zipCode, page = 1)

// Get coordinates from zip code
await parishService.getCoordinatesFromZipCode(zipCode)

// Get parishes near coordinates
await parishService.getParishesNearCoordinates(latitude, longitude, page = 1)

// Get demo data for testing
parishService.getDemoData(zipCode)
```

### 2. `useParishFinder.js` (Custom Hook)
React hook for easy integration in components.

**Returns:**
- `loading` - Boolean indicating if search is in progress
- `error` - Error message if search failed
- `parishes` - Array of parish objects
- `location` - Geographic location object (city, state, zip, lat, lon)
- `currentPage` - Current pagination page
- `totalResults` - Total number of parishes found
- `searchParishes(zipCode, page)` - Method to search
- `resetSearch()` - Method to clear results
- `getDemoData(zipCode)` - Get test data

### 3. `parishServiceExamples.js`
Usage examples and helper functions.

## API Response Format

### Result Object
```javascript
{
  success: boolean,
  zipCode: string,
  location: {
    latitude: number,
    longitude: number,
    city: string,
    state: string,
    zipCode: string
  },
  parishes: Array<Parish>,
  message: string,
  count: number
}
```

### Parish Object
```javascript
{
  name: string,
  address: string,
  city: string,
  state: string,
  zipCode: string,
  diocese: string,
  phone: string,
  email: string,
  website: string,
  latitude: number,
  longitude: number,
  distance: number
}
```

## Usage Examples

### Basic Usage in Component

```javascript
import { useParishFinder } from '../hooks/useParishFinder';

function ParishFinder() {
  const {
    loading,
    error,
    parishes,
    location,
    searchParishes,
    hasResults
  } = useParishFinder();

  const handleSearch = async (zipCode) => {
    await searchParishes(zipCode);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter zip code"
        onChange={(e) => handleSearch(e.target.value)}
        maxLength="5"
      />

      {loading && <p>Searching for parishes...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {hasResults && (
        <div>
          <p>Found {parishes.length} parishes near {location.city}, {location.state}</p>
          {parishes.map((parish, index) => (
            <div key={index}>
              <h4>{parish.name}</h4>
              <p>{parish.address}</p>
              <p>{parish.city}, {parish.state} {parish.zipCode}</p>
              {parish.phone && <p>Phone: {parish.phone}</p>}
              {parish.diocese && <p>Diocese: {parish.diocese}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Direct Service Usage

```javascript
import parishService from '../services/parishService';

// Search parishes by zip code
const result = await parishService.searchParishes('20017');
console.log(result.parishes);

// Get coordinates only
const location = await parishService.getCoordinatesFromZipCode('20017');
console.log(location); // { latitude, longitude, city, state, zipCode }

// Get parishes near coordinates
const parishes = await parishService.getParishesNearCoordinates(38.9072, -77.0369);
console.log(parishes);
```

## Error Handling

The service handles errors gracefully:

```javascript
const result = await parishService.searchParishes('invalid');

if (!result.success) {
  console.error(result.message); // Error message from API
  console.log(result.parishes);   // Will be empty array
}
```

## Testing

Use the demo data method for testing without API calls:

```javascript
const demoData = parishService.getDemoData('20017');
console.log(demoData.parishes); // Sample parish data
```

## API Endpoints

### Zippopotam.us API
- **Endpoint:** `https://api.zippopotam.us/us/<zipCode>`
- **Response Format:** JSON with place details including latitude/longitude
- **Rate Limit:** No documented limit
- **CORS:** Enabled

### UpdateParishData API
- **Endpoint:** `https://apiv4.updateparishdata.org/Churchs/?lat=<lat>&long=<lon>&pg=<page>`
- **Response Format:** JSON with church/parish array
- **Parameters:**
  - `lat` - Latitude coordinate
  - `long` - Longitude coordinate
  - `pg` - Page number for pagination (default: 1)

## Pagination

Both APIs support pagination. Use the `page` parameter:

```javascript
// Get second page of results
const result = await parishService.searchParishes('20017', 2);
```

## Error Cases Handled

- Invalid or empty zip code
- Zip code not found
- Network errors
- API timeouts
- Missing or malformed API responses
- Invalid coordinates

## Performance Considerations

- Results are not cached by default (add caching if needed)
- Each search makes 2 API calls (zip code → coordinates → parishes)
- Consider rate limiting if making many requests
- Use pagination for large result sets

## Future Enhancements

- [ ] Add result caching with TTL
- [ ] Add distance sorting
- [ ] Add filtering by diocese
- [ ] Add bulk zip code search
- [ ] Add reverse geocoding (address to zip code)
- [ ] Add favorites/bookmarking
- [ ] Integration with map visualization

## Troubleshooting

**No results returned:**
- Verify zip code is valid (use demo data to test)
- Check browser console for API errors
- Some remote areas may not have parishes in database

**CORS errors:**
- Both APIs support CORS
- Check browser console for specific error messages
- Try using a proxy service if CORS is blocked

**Performance issues:**
- Consider implementing request debouncing
- Add result caching for repeated searches
- Use pagination for large result sets
