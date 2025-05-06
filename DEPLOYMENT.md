# Deployment Guide for Soul Distribution

## Prerequisites
- Node.js 18.x or higher
- MongoDB database (Atlas recommended)
- Vercel or Render account for deployment

## Environment Variables
Set up the following environment variables in your deployment platform:

```
# Required: MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Required: Authentication Secret (minimum 32 characters)
JWT_SECRET=your_secure_jwt_secret_key_here_min_32_chars

# Optional: App URL for absolute URLs
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

## Deployment Steps

### Vercel
1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel project settings
3. Deploy using default Next.js settings

### Render
1. Create a new Web Service and connect your GitHub repository
2. Set the build command to `npm install && npm run build`
3. Set the start command to `npm run start:render`
4. Configure environment variables in the Render environment settings

## Troubleshooting
- If you encounter CSS optimization errors, ensure the `critters` package is installed
- For MongoDB connection issues, check that your IP is whitelisted in MongoDB Atlas
- For image optimization issues, ensure proper domain configuration in `next.config.js`

## Notes
- The project uses MongoDB for database storage
- Spotify API credentials are configured in `next.config.js`
- The project uses Edge runtime for some API routes 