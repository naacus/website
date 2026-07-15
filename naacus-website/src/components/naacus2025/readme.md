# NAACUS 2025 Accomplishments Subproject

## Purpose

This subproject presents a detailed breakdown of every event from the NAACUS 2025 Bi-Annual Conference (July 18-20, 2025). It serves as a comprehensive record of the conference and a promotional tool to inspire participation in the upcoming NAACUS 2027 conference.

## Structure

```
naacus2025/
├── Naacus2025Accomplishments.js  # Main component with event-by-event details
├── index.js                       # Export file for easy importing
└── readme.md                      # This file
```

## Component Overview

### Naacus2025Accomplishments.js

The main component that presents:

1. **Hero Section**: Conference theme, dates, and location information
   - Theme: United in Christ for Evangelization (1 Cor. 1:10-13)
   - Goal: African Catholics Faith and Culture in Action
   - Dates: July 18-20, 2025
   - Location: Columbus, OH
   - Host: Region 6

2. **Event Schedule**: Complete listing of all 12 conference events including:
   - Friday, July 18: Men's & Women's Retreats, Opening Mass
   - Saturday, July 19: Keynote, Workshops, Cultural Performance, Gala Dinner
   - Sunday, July 20: Closing Mass, Farewell Brunch

3. **Event Cards**: Each event displays:
   - Day and time
   - Event title
   - Presenter/facilitator
   - Location
   - Summary (placeholder for content to be added)
   - Media placeholders for videos and photos

4. **Call-to-Action**: Encourages visitors to subscribe for NAACUS 2027 updates

## Adding Content

### Event Summaries

Each event in the `events` array has a `summary` field currently set to "Content and summary to be provided". To add summaries:

1. Edit the `events` array in `Naacus2025Accomplishments.js`
2. Replace the `summary` value for each event with the actual description
3. Example:
```javascript
{
  id: 1,
  summary: 'A transformative day for men exploring their identity in Christ. Deacon Joseph LeMay led participants through reflection, prayer, and discussion...',
}
```

### Photos

To add photos for specific events:

1. Place photo files in `/naacus-website/public/naacus2025/photos/`
2. Name them descriptively (e.g., `event-1-mens-retreat.jpg`)
3. Update the event card to display actual images instead of placeholders
4. Consider creating a photo gallery component for each event

### Videos

To add videos for specific events:

1. Host videos on YouTube, Vimeo, or place in `/naacus-website/public/naacus2025/videos/`
2. Update the event card to embed the video player
3. Example for YouTube:
```javascript
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/VIDEO_ID" 
  title="Event Video"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
```

### Customizing Events

The events array can be customized to:

1. Add or remove events as needed
2. Update presenter names and titles
3. Adjust times and locations
4. Add additional metadata fields (workshop topics, attendee count, etc.)

## Integration

The component is designed to be integrated into the main NAACUS website:

```javascript
import { Naacus2025Accomplishments } from './components/naacus2025';

// In App.js or your routing setup
<Naacus2025Accomplishments />
```

It can be:
- Added as a standalone page with React Router
- Integrated into the main scrolling page
- Linked from the Conference2027Teaser component

## Styling

The component uses:
- **Fluent UI components**: For consistent styling with the rest of the site
- **Microsoft-inspired colors**: Matching the NAACUS website theme
- **Responsive design**: Works on all device sizes
- **Custom accent color**: #E8D4C0 (tan/beige) for highlighting

## Future Enhancements

Consider adding:

1. **Interactive Timeline**: Show the progression of events during July 2025
2. **Statistics Dashboard**: Visual representation of attendance, reach, etc.
3. **Speaker Profiles**: Highlight keynote speakers and presenters
4. **Workshop Details**: Individual pages or sections for each workshop
5. **Downloadable Resources**: PDFs, presentations, or materials from the event
6. **Social Media Integration**: Embed social media posts from the event
7. **Registration Link**: Direct link to register for NAACUS 2027

## Localization

The component structure supports future i18n integration:
- Component can be enhanced with react-i18next hooks
- All text is currently in English and can be moved to translation files
- Ready to support multiple languages (English, French, etc.) when needed

## Promotion Strategy

This subproject helps promote NAACUS 2027 by:

1. **Showcasing Success**: Demonstrating the value and impact of NAACUS events
2. **Building Momentum**: Creating excitement for the next conference
3. **Community Engagement**: Featuring community voices and experiences
4. **Visual Appeal**: Using photos and videos to tell the story
5. **Clear CTA**: Making it easy for visitors to stay informed about NAACUS 2027

## Content Guidelines

When adding content, ensure:

- **Authenticity**: Use actual photos, videos, and testimonials from the event
- **Diversity**: Represent the breadth of the African Catholic community
- **Quality**: High-resolution images and professionally edited videos
- **Permissions**: Obtain necessary permissions for all media
- **Accessibility**: Add alt text, captions, and transcripts where appropriate
- **Copyright**: Respect copyright and licensing requirements

## Maintenance

- Regularly update with new content as it becomes available
- Monitor user engagement and adjust layout/content accordingly
- Keep the CTA current as NAACUS 2027 approaches
- Archive or adapt content after NAACUS 2027 for historical purposes

## Contact

For questions about this subproject or to contribute content:
- Email: info@naacus.org
- Provide high-quality photos, videos, and testimonials from July 2025

---

Built with ❤️ for the NAACUS community  
**Together with Christ**
