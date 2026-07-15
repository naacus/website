# NAACUS 2025 Videos

This folder contains videos from the NAACUS gathering in July 2025.

## Guidelines for Adding Videos

### File Hosting
**Option 1: External Hosting (Recommended)**
- Upload to YouTube, Vimeo, or similar platform
- Keep a reference file here with video IDs and embed codes
- Better for bandwidth and streaming

**Option 2: Direct Upload**
- Only for short clips (under 50MB)
- Use compressed formats

### File Format
- Preferred: MP4 (H.264 codec)
- Alternative: WebM
- Recommended resolution: 1080p (1920x1080)
- Frame rate: 30fps or 60fps

### File Naming Convention
- Use descriptive names: `keynote-bishop-smith.mp4`, `workshop-youth-ministry.mp4`
- Include date: `2025-07-15-opening-mass.mp4`
- Use lowercase with hyphens

### Content Suggestions
1. **Keynote Addresses**: Full recordings of main speakers
2. **Workshop Highlights**: Key moments from sessions
3. **Testimonials**: Personal stories from participants
4. **Cultural Performances**: Dance, music, choir performances
5. **Mass Recordings**: Full or highlights from liturgical celebrations
6. **Interviews**: With speakers, participants, organizers
7. **Conference Highlight Reel**: 2-3 minute overview of the event
8. **Daily Recaps**: Short summaries of each day
9. **Behind the Scenes**: Setup, planning, volunteers
10. **Thank You Message**: From organizers to participants

### Video Metadata
Create a `videos.json` file with details:

```json
{
  "videos": [
    {
      "id": "video-001",
      "title": "Opening Keynote: Unity in Christ",
      "description": "Bishop John Doe delivers the opening keynote address on unity in the African Catholic community",
      "duration": "45:23",
      "date": "2025-07-15",
      "speaker": "Bishop John Doe",
      "youtube_id": "dQw4w9WgXcQ",
      "thumbnail": "keynote-bishop-doe-thumb.jpg",
      "category": "keynote"
    }
  ]
}
```

### For YouTube Videos
Store references in `youtube-videos.txt`:
```
Opening Keynote - https://youtube.com/watch?v=VIDEO_ID
Workshop on Evangelization - https://youtube.com/watch?v=VIDEO_ID
Cultural Performance - https://youtube.com/watch?v=VIDEO_ID
```

### Accessibility
- Include closed captions (SRT files)
- Provide transcripts for key speeches
- Store captions in a `captions/` subfolder

### Permissions & Copyright
- Obtain consent from speakers and performers
- Include copyright information
- Credit videographers
- Respect music licensing requirements

### Organization
Consider creating subfolders:
- `keynotes/`
- `workshops/`
- `testimonials/`
- `performances/`
- `masses/`
- `highlights/`
- `interviews/`
- `captions/` (for subtitle files)
