# Events CRUD

## Problem
Events entity exists in the database but has no API endpoints or frontend UI.

## Solution
1. Add TCP handlers for event CRUD in backend-maps
2. Add gateway routes for events
3. Add frontend UI to create and list events

## Scope
- backend-maps: Add event TCP handlers + service
- backend-gateaway: Add events proxy routes
- frontend: Events page with creation form + listing
