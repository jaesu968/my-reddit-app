# Reddit Mini

A Reddit-style client built with React, Vite, Redux Toolkit, React Router, and Bootstrap. Browse Reddit's popular posts, explore subreddits, read comments, and search content — all in a responsive, animated UI.

## Wireframes

### Desktop
![Desktop Wireframe](wireframes/RedditClientWireframesDesktopUpdated.jpg)

### Mobile
![Mobile Wireframe](wireframes/RedditClientWireframesUpdated.jpg)

## Technologies Used

- HTML
- CSS
- JavaScript
- React 19
- Vite 8
- Redux Toolkit
- React Redux
- React Router
- Bootstrap 5
- React Bootstrap
- ESLint 9
- react-markdown
- remark-gfm
- rehype-raw
- Vitest + @testing-library/react

## Features

- Live Reddit API integration via Vite proxy (local) and Netlify OAuth proxy function (production)
- Browse top posts from Reddit's popular feed
- Browse and select subreddits -- auto-loads posts for that community
- View post details with full markdown body rendering 
- Comments loaded per post (top 10, with image support)
- Client-side upvote/downvote on posts
- Global search bar filters posts and subreddits simultaneously
- Responsive layout -- works desktop to mobile 
- Error boundary -- graceful fallback on render errors
- Animations - card hover lift, PostDetail slide-in, loading pulse, selection transitions

## Project Structure

- `src/app` - Redux store and root reducer
- `src/features` - feature-specific slices/components/pages/api stubs
- `src/shared` - shared UI components, API stubs, hooks, styles, and utilities
- `src/pages` - route-level pages

## Testing

### Unit Tests (Vitest)

Run component and slice unit tests:

```bash
npm test          # run all unit tests once
npm run test:watch  # watch mode
npm run test:ui     # Vitest browser UI
```

### E2E Tests (Playwright)

Three end-to-end tests covering core user flows:

- **Page load** — verifies post cards are visible on launch
- **Search filtering** — confirms no-results state with an unmatched query
- **Post selection** — clicks a post, asserts it becomes selected and detail content appears

```bash
npm run e2e           # run all E2E tests (headless, all browsers)
npm run e2e:headed    # run with visible browser window
npm run e2e:ui        # open Playwright interactive UI
npm run e2e:debug     # step through tests with Playwright debugger
```

> Playwright must have browsers installed: `npx playwright install`

---

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the project:
   ```bash
   npm run dev      # development server
   npm run build    # production build
   npm run preview  # preview production build
   ```

## Possible Future Work 

- Remote Reddit search (beyond locally fetched data)
- Pagination / load more posts
- Persistent vote state in Redux
- Nested comment threading 
- OAuth login for real voting/posting
- Progressive Web App (PWA) support   