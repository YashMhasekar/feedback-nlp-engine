# Feedback Analyzer Frontend

A modern, professional React application for the Student Feedback Analytics platform. Built with React, Tailwind CSS, and designed for educational institutions to analyze and visualize student feedback.

## Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Interactive Components**: Hover effects, smooth transitions, and engaging UI elements
- **Professional Color Palette**: Blues, teals, whites, and grays with gradient accents
- **Accessibility**: Built with accessibility best practices in mind

## Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM
- **Icons**: Heroicons (via SVG)
- **Fonts**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit `http://localhost:4010`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js          # Navigation header with logo and menu
│   │   ├── HeroSection.js     # Main hero section with CTA
│   │   ├── FeaturesSection.js # Features showcase
│   │   ├── TestimonialsSection.js # Customer testimonials carousel
│   │   ├── Footer.js          # Footer with links and newsletter
│   │   └── Homepage.js        # Main homepage component
│   ├── App.js                 # Main app component with routing
│   ├── index.js              # React app entry point
│   └── index.css             # Global styles and Tailwind imports
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── package.json              # Project dependencies and scripts
```

## Components Overview

### Header
- Sticky navigation with logo and menu items
- Responsive mobile menu
- Smooth scroll effects
- Sign In/Sign Up buttons

### Hero Section
- Eye-catching headline and subtext
- Call-to-action buttons
- Interactive dashboard mockup
- Statistics display
- Animated background elements

### Features Section
- Four main feature cards with icons
- Hover effects and animations
- Call-to-action section
- Responsive grid layout

### Testimonials Section
- Automatic carousel with navigation
- Faculty testimonials
- Statistics section
- Responsive design

### Footer
- Company information and social links
- Quick links and support sections
- Newsletter signup
- Legal links and copyright

## Customization

### Colors
The color palette is defined in `tailwind.config.js`:
- Primary: Blue shades (#0ea5e9 and variants)
- Secondary: Teal shades (#14b8a6 and variants)
- Neutral: Grays and whites

### Fonts
Using Inter font family from Google Fonts for a modern, professional look.

### Animations
Custom animations defined in Tailwind config:
- `fade-in`: Smooth fade-in effect
- `slide-up`: Slide up animation
- `bounce-gentle`: Gentle bounce effect

## Future Enhancements

- Add authentication pages (Sign In/Sign Up)
- Implement dashboard pages
- Add more interactive features
- Integrate with backend API
- Add more animations and micro-interactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Feedback Analyzer platform for educational institutions.