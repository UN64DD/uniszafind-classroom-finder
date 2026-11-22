# UniszaFind – Classroom Finder

A lightweight, mobile-first prototype for finding classrooms and buildings on campus, browsing room facilities, saving rooms, and following step-by-step directions. It is built with plain HTML, CSS and JavaScript — no build step or dependencies.

## Features

- Search rooms by name, room number, or building
- Filter by room type and sort by nearest / name
- Room details with facilities and a route preview on the campus map
- Step-by-step walking directions
- Save rooms for quick access
- Campus map with a tappable building list
- Optional larger-text mode and automatic dark theme support
- Responsive layout: bottom navigation on mobile, wider centred lists on tablet, and a persistent sidebar on desktop

## Project structure

```
.
├── index.html               # Home / entry point
├── 404.html                 # Custom GitHub Pages error page
├── README.md                # This file
├── .gitignore
├── .nojekyll
├── assets/
│   ├── css/styles.css       # Shared styles
│   ├── js/app.js            # Shared data, state and page logic
│   └── img/favicon.svg      # Site icon
├── pages/
│   ├── search.html
│   ├── results.html
│   ├── details.html
│   ├── navigate.html
│   ├── map.html
│   ├── saved.html
│   └── profile.html
└── archive/                 # Original single-file prototype (reference only)
```

## Running locally

Because the app uses only relative paths, opening `index.html` directly in a browser works. To run it from a local server instead:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## State and navigation

Pages are plain HTML documents linked with relative URLs. Search state, saved rooms, the current route step and display preferences are stored in `sessionStorage` (with a `window.name` fallback for browsers that block storage on `file://` URLs). All links are relative, so the site works from a domain root or a GitHub Pages project subpath.

## Publishing with GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source: Deploy from a branch**.
4. Choose your default branch (for example `main`) and the `/ (root)` folder, then save.
5. Your site will be available at `https://<username>.github.io/<repository>/`.

The `.nojekyll` file is included so GitHub Pages serves the static files as-is.

## 🎨 HMI & Interaction Design Principles

UniszaFind is designed as a low-friction wayfinding tool for students who are often moving between classes. The interface reduces cognitive load by keeping the next action obvious, prevents navigation errors through constrained choices and clear feedback, and supports intuitive campus wayfinding with familiar search, map and turn-by-turn patterns.

### 1. The 5 Core Principles of Interaction Design

**Visibility**
- A high-contrast search field is placed at the top of the home and search screens, with the magnifying-glass icon and placeholder text making its purpose immediately clear.
- Filter chips stay visible above the results: **All, Lecture Rooms, Laboratories, Faculty Buildings, Facilities**. Building blocks are also visible and labelled on the campus map.
- The map always shows a “You are here” marker alongside the labelled buildings, so users never lose their spatial context.

**Feedback**
- Selecting a room opens its details immediately and its building is highlighted on the route preview, with a dashed path and destination pin showing the way.
- Saving a room produces an instant toast confirmation and changes the button label to “Saved – tap to remove”.
- Navigation marks completed steps with a ✓ and ends with an explicit arrival message (“You’ve arrived at …”).
- *Planned for a future version:* a dedicated “Route Calculated” status and loading indicators for live routing.

**Constraints**
- Users can only choose from the defined room categories and existing buildings, so invalid filters cannot be selected.
- Search is matched case-insensitively against room names, room codes and building names, so partial inputs such as `F203` work without strict formatting rules.
- *Planned for a future version:* disabling floor-level options that do not exist for the selected block and auto-formatting room codes.

**Consistency**
- The same icon set (magnifying glass, location pin, back arrow, bookmark, profile) and the same typography, chips, buttons and card styling are used across every screen.
- Back navigation behaves identically from search, results, room details, the campus map and directions, always returning to the previous screen.
- The main navigation contains the same four destinations everywhere; it only changes presentation from a bottom bar on mobile to a sidebar on desktop.

**Affordance**
- The search box has a visible border, placeholder text and an icon, clearly communicating that it is editable.
- Result cards have elevation, a drop shadow and a chevron, signalling that they can be opened.
- Tappable buildings on the map use a pointer cursor and labels, and all interactive controls have at least 48px touch targets.

### 2. Cognitive & Mobile Ergonomics Principles

- **Recognition over Recall:** live suggestions, recent searches and category shortcuts (*Lecture Rooms, Computer Labs, Laboratories, Faculty Buildings, Facilities*) mean students do not need to memorise exact room numbering formats.
- **Mental Model Alignment:** the campus map reflects the physical layout with named blocks, a main walkway, a “You are here” marker and a route path, while the step list follows familiar turn-by-turn map conventions. *Pinch-to-zoom and pan on floor plans are planned rather than implemented in this prototype.*
- **Glanceable & Mobile Ergonomics:** thumb-friendly bottom navigation on mobile, large touch targets and concise turn-by-turn instructions support use while walking outdoors.
- **Designing for Scanning Behaviour:** strong typographic hierarchy, high-contrast colours, clear category pills and automatic dark-theme support let students scan for the relevant room in seconds.

> Items marked *planned* are design intentions for future iterations, not features of the current prototype.

### 3. Summary Matrix

| HMI Principle | UI Implementation | User Benefit |
| --- | --- | --- |
| Visibility | Prominent search field, persistent category chips, labelled buildings and “You are here” marker | The next action and current location are always obvious |
| Feedback | Building highlight, dashed route, destination pin, save toast, ✓ on completed steps, arrival message | Users know immediately whether an action succeeded and where they are |
| Constraints | Predefined categories/buildings and forgiving room-code matching; planned floor-level constraints | Fewer invalid inputs and less trial and error |
| Consistency | Shared icon set, typography, components and back behaviour across all pages | Less relearning when moving between screens |
| Affordance | Bordered inputs, elevated cards with chevrons, pointer-cursor map buildings, 48px targets | Interactive elements are easy to spot and tap |
| Recognition over Recall | Suggestions, recent searches and category shortcuts | No need to memorise room codes or building names |
| Mental Model Alignment | Campus-style map, route path and turn-by-turn steps | The interface matches how students think about the physical campus |
| Glanceable & Mobile Ergonomics | Bottom nav on mobile, large targets, short step text | Safe, quick use while walking between classes |
| Designing for Scanning | High contrast, clear hierarchy, colour-coded pills, dark theme | Fast decision-making when running late |
