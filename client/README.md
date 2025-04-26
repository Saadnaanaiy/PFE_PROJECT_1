# React Client for Laravel Backend

This is a React client application configured to work with a Laravel backend.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Development:

   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

## Laravel Integration

This React client is configured to work with a Laravel backend through:

- API proxy configuration in `vite.config.js` that forwards `/api` requests to Laravel
- Axios setup with CSRF token handling for Laravel Sanctum
- Authentication services compatible with Laravel's built-in authentication

### Backend Requirements

The Laravel backend should:

1. Have CORS configured to allow requests from the React client
2. Use Laravel Sanctum for API authentication
3. Expose standard API routes for authentication (/login, /register, /user, /logout)

### Development Setup

1. Run your Laravel backend on port 8000 (default Laravel port)
2. Run this React client on a different port (default Vite port is 5173)
3. All API requests from React will be proxied to Laravel through the `/api` prefix

## Project Structure

- `/src/services/api.js` - Base API setup for communicating with Laravel
- `/src/services/authService.js` - Authentication service for Laravel Sanctum
- `/src/components/LoginForm.jsx` - Example login form component
# ccc
