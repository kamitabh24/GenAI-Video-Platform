# GenAI Video Platform Testing Suite

An automated End-to-End (E2E) testing framework designed for a Generative AI Video Creation Studio (Text-to-Video). This repository demonstrates how to architect highly efficient UI tests for complex AI applications by bypassing long GPU rendering bottlenecks.

## Architectural Highlights

*   **API Network Mocking:** Heavily utilizes `cy.intercept()` to stub the generative backend. This reduces test execution times from several minutes to under 3 seconds per workflow while fully validating UI loading states, error handling, and request payloads.
*   **Multi-Modal Canvas Automation:** Automates complex state-driven DOM interactions, including AI avatar selection from interactive drawers, voice-over configuration, and script injection.
*   **Media Integrity Validation:** Directly queries and validates native HTML5 video player integration in the DOM, ensuring generated MP4 assets load correctly and trigger accurate playback events without CORS policy violations.
*   **Continuous Integration:** Fully integrated with GitHub Actions for headless cross-browser execution on every commit.

## Tech Stack
*   **Test Runner:** Cypress
*   **Language:** JavaScript (Node.js)
*   **CI/CD:** GitHub Actions
*   **Methodology:** REST API Mocking, DOM Validation

## How to Run Locally

1. Clone the repository
2. Install dependencies: `npm install`
3. Open the Cypress Test Runner: `npm run cypress:open`
4. Run tests headlessly: `npm test`
