# Blog Banner Template Tool

A web application for creating standardized blog banner templates. Previously, creating blog banners required using Canva templates where editing the title and logo was tedious - especially the logo part, which involved finding logos from websites, copying them, pasting, and manually adjusting them. This tool automates that workflow by fetching logos directly from websites and allowing easy title customization.

## Problem Solved

Creating blog banners using Canva templates was time-consuming due to:
- Manual logo extraction from company websites
- Copy-paste workflow for logos
- Tedious positioning and sizing adjustments

This tool streamlines the process by automatically fetching logos from any website URL and providing an intuitive interface for title editing and customization.

## Features

- Automatic logo extraction from any website URL
- Customizable text titles with adjustable sizes
- Multiple color palette options for backgrounds
- Logo scale adjustment controls
- Real-time preview of banner design
- Download as PNG image for immediate use
- Fast deployment on Cloudflare Pages

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

**Note**: The logo extraction API requires deployment to Cloudflare Pages to function. It will not work in local development mode.


## How to Use

1. Enter your blog banner title in the text field
2. Select a background color palette from the dropdown menu
3. Enter the website URL to automatically fetch the company logo
4. Click "Fetch Logo" to extract and place the logo
5. Use the slider controls to adjust logo scale and text sizes
6. Preview your banner in real-time
7. Click "Download PNG" to save your blog banner

## API Endpoint

The logo extraction API endpoint:
```
/api?url=https://example.com
```

Available parameters:
- `url` (required): Website URL to extract logo from
- `direct=true` (optional): Returns the logo image directly
- `return=json` (optional): Returns all logo candidates found

