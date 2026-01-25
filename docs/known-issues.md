# Known Issues

This document tracks known issues and planned improvements for the portfolio project.

## Navigation Highlighting

### Highlighting Flicker on Refresh

- **Issue:** When refreshing the page while scrolled to a specific section (e.g., `#skills`), the navbar briefly highlights "About" before jumping to the correct section.
- **Cause:** This is a hydration mismatch between the server-rendered state and the client-side Intersection Observer initialization.
- **Status:** Acknowledged. Planned for future optimization.

### Intersection Observer Precision

- **Issue:** On very small screens or with very short sections, the ScrollSpy might occasionally highlight the wrong section if multiple sections are visible simultaneously.
- **Status:** Monitoring.
