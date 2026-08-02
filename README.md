# Certificate Cover Generator

A web app to generate custom certificate and announcement covers with automatic logo extraction from any website.

## Features

- 🎨 Customizable certificate covers with gradient backgrounds
- 🏢 Automatic logo extraction from any company website
- 📐 Adjustable logo scale and text sizes
- 🎨 Multiple color palettes (Admit Card, Answer Key, Exchange Programs)
- 📥 Download as PNG image
- ⚡ Fast deployment on Cloudflare Pages

## Tech Stack

- **Frontend**: React + Vite
- **API**: Cloudflare Pages Functions
- **Hosting**: Cloudflare Pages
- **Styling**: CSS

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run dev server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to `http://localhost:5173`

**Note**: The logo extraction API (`/api`) won't work in local dev mode. Deploy to Cloudflare Pages to test it.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy:
```bash
npm run deploy
```

Or connect your Git repo to Cloudflare Pages for automatic deployments.

## Usage

1. Enter a title for your certificate/announcement
2. Select a background color palette from the dropdown
3. Enter a website URL to extract the company logo
4. Click "Fetch" to automatically get the logo
5. Adjust logo scale and text sizes as needed
6. Click "Download PNG" to save your cover

## API Endpoint

The logo extraction API is available at:
```
/api?url=https://example.com
```

Parameters:
- `url` (required): The website URL to extract logo from
- `direct=true` (optional): Return the logo image directly
- `return=json` (optional): Return all logo candidates

## License

MIT
