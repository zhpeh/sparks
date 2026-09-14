SPARKS STATIC HOSTING PACKAGE
=============================

This folder is a complete static website. Keep every file and folder together.

Hosting steps
1. Upload the contents of this folder to any static host.
2. Set index.html as the default document.
3. Serve the site over HTTPS. Picture buttons work everywhere, but browsers generally require HTTPS for microphone choices.
4. Open the public URL and test one story on desktop and phone.

No build command, database, API key, or server-side code is required.

Local test
Run this command from inside the folder:
  python3 -m http.server 8000
Then open:
  http://localhost:8000/

Phone preview
Open phone-preview.html on a desktop browser to inspect 390 px, 430 px, and landscape widths. On a real phone, use the normal index.html URL.
Story pages place short copy above a full, uncropped illustration on phones. Every Full route contains 12 illustrated pages; Quick contains 11 for Ocean and 10 for every other story. Next page is available while narration is still playing.