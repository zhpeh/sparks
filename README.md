# Sparks Voice Ready — Story Studio

Deployment-ready, self-contained HTML demo for the Sparks picture-first
bedtime-story experience.

## Package contents

- `index.html` — complete application, including embedded artwork and narration.
- `README.md` — deployment and verification instructions.

There is no build step, package manager, framework, or external asset directory.

## Experience flow

1. Welcome
2. Grown-up setup and optional microphone permission
3. Personalized feature home
4. Story Studio
   - Choose a hero
   - Pick a world
   - Choose a theme
5. AI story-generation animation
6. One best-matched story
7. Existing voice-ready preview and complete story experience

The home also includes placeholder personalization and gamification values.
Question Chest and AI Readalong are disabled and marked `SOON`.

## Local preview

Opening `index.html` directly works for most visual testing:

```text
file:///path/to/sparks-voice-story-studio/index.html
```

For more reliable browser behaviour, serve the directory:

```bash
cd sparks-voice-story-studio
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Deploy to Vercel

### Web interface

1. Extract this ZIP.
2. Create a new Vercel project.
3. Upload or import the extracted `sparks-voice-story-studio` directory.
4. Select **Other** as the framework preset if prompted.
5. Leave the build command empty.
6. Leave the output directory empty or set it to `.`.
7. Deploy.

Vercel will serve `index.html` from the project root.

### Vercel CLI

Use only an approved, existing Vercel CLI installation.

```bash
cd sparks-voice-story-studio
vercel
```

For production:

```bash
vercel --prod
```

No additional configuration file is required.

## Deploy to another static host

Upload `index.html` to the public root of any HTTPS static host, including:

- GitHub Pages
- Netlify
- Azure Static Web Apps
- Amazon S3 with CloudFront
- Any standard web server

The host must serve `index.html` for the root path.

## Voice requirements

The app always supports picture and button choices. Voice features depend on
browser support and user permission.

For the full voice experience:

- Use a current Chrome or Edge browser.
- Serve the app over HTTPS in production.
- Allow microphone access when prompted.
- Open the app as a top-level page rather than inside a restricted iframe.

If speech recognition or microphone access is unavailable, the app falls back
to picture choices.

## Data and storage

- Story Shelf data is stored in browser `localStorage` on the current device.
- The application does not require a backend or database.
- Saved adventures do not include the child's name, voice recordings, scores,
  or answer transcripts.
- Clearing browser site data removes locally saved Story Shelf entries.

## Story Studio matching

Story Studio scores all six existing stories and returns exactly one result:

- Hero match: 3 points
- World match: 2 points
- Theme match: 1 point

Ties follow the existing story order, producing a deterministic result.

## Deployment verification

After deployment:

1. Confirm the Welcome screen loads.
2. Complete Grown-up setup with and without voice enabled.
3. Confirm setup opens the personalized Home screen.
4. Confirm Story Studio accepts one hero, world, and theme.
5. Confirm **Generate my story** returns one story.
6. Open the matched preview and start the story.
7. Confirm Question Chest and AI Readalong remain disabled with `SOON` labels.
8. Test at mobile and desktop widths.
9. Confirm Story Shelf persists after a browser refresh.

## File-size note

`index.html` is approximately 54 MB because all artwork and narration are
embedded for portability. Some hosting providers may impose per-file upload
limits. If the target platform rejects the file, the assets will need to be
extracted into separate files and referenced by relative paths.
