# EventHub Test Plan

## Application Overview

Test the EventHub web application, which redirects unauthenticated visitors to sign-in and supports authenticated event discovery, admin event creation, ticket booking, booking lookup, and seat availability updates. Use a dedicated test account with admin permissions where required; load credentials from secure test configuration, not source control. Seed file: tests/seed.spec.ts.

## Test Scenarios

### 1. Authentication and access

**Seed:** `tests/seed.spec.ts`

#### 1.1. Sign in with valid credentials

**File:** `tests/authentication/sign-in.spec.ts`

**Steps:**
  1. Open https://eventhub.rahulshettyacademy.com and confirm the sign-in screen is shown.
    - expect: The sign-in form and Register link are visible.
  2. Enter valid test-account credentials and submit Sign In.
    - expect: Sign-in succeeds and the authenticated Events/Browse Events view is available.

#### 1.2. Reject invalid credentials

**File:** `tests/authentication/sign-in.spec.ts`

**Steps:**
  1. Open the sign-in screen and submit an invalid email/password combination.
    - expect: Authentication is rejected with a visible error.
    - expect: The user remains unauthenticated on the sign-in screen.

#### 1.3. Protect authenticated routes

**File:** `tests/authentication/access-control.spec.ts`

**Steps:**
  1. Open an authenticated-only route, such as /bookings, without a signed-in session.
    - expect: The visitor is redirected to the sign-in screen or otherwise prevented from accessing booking data.

### 2. Event administration

**Seed:** `tests/seed.spec.ts`

#### 2.1. Create an event as an admin

**File:** `tests/events/create-event.spec.ts`

**Steps:**
  1. Sign in with an admin test account and open Admin > Manage Events.
    - expect: The event management form is available.
  2. Enter a unique title, description, city, venue, future date and time, price, and seat count; submit Add Event.
    - expect: A success confirmation is shown.
    - expect: The created event is available in the event listing with the submitted details.

### 3. Event booking

**Seed:** `tests/seed.spec.ts`

#### 3.1. Book one ticket and verify booking and inventory

**File:** `tests/bookings/create-booking.spec.ts`

**Steps:**
  1. Sign in and identify an event with at least one available seat; record its available-seat count.
    - expect: The event card and booking action are visible.
  2. Start a booking, enter valid customer name, email, and phone details, and confirm the booking.
    - expect: A booking confirmation and booking reference are shown.
  3. Open My Bookings and locate the booking by its reference and event title.
    - expect: The booking appears in the booking list with the matching event and reference.
  4. Return to Events and reload the event listing.
    - expect: The event remains visible and its available-seat count has decreased by one.

#### 3.2. Validate required booking details

**File:** `tests/bookings/validation.spec.ts`

**Steps:**
  1. Start a booking and attempt to confirm with required customer fields empty or malformed.
    - expect: Invalid submission is blocked or validation feedback is shown.
    - expect: No booking confirmation/reference is created and event inventory is unchanged.
