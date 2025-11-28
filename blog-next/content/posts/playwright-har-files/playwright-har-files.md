---
title: "Speed Up Playwright Tests with HAR Files"
date: 2025-11-28
tags: ["playwright", "testing", "api", "mocking"]
description: "Record API traffic once, replay it in tests forever. Skip authentication, avoid flaky backends, and make your Playwright tests lightning fast."
draft: false
---

## Introduction

Testing UI flows that require authentication is slow. You log in, wait for tokens, hit real APIs, and hope nothing times out. But what if you could skip all that and still test your frontend thoroughly?

Enter **HAR files** — a way to record all your application's network traffic once, then replay it in your tests. No backend, no auth flows, no flaky API calls. Just fast, reliable tests.

---

## What Are HAR Files?

A HAR (HTTP Archive) file is a JSON-formatted recording of network activity between your browser and server. Think of it as a snapshot of every HTTP request and response during a user session.

When used in Playwright, HAR files let you:
- **Record** real API interactions (including auth tokens, headers, and responses)
- **Replay** those interactions in tests without hitting live servers
- **Test offline** — your frontend works with mocked data

It's like giving your tests a pre-recorded script of exactly what the backend would say.

---

## Why Use HAR Files?

**Speed:** No waiting for API responses or auth flows  
**Reliability:** No network issues or flaky endpoints  
**Isolation:** Test frontend logic without backend dependencies  
**Cost:** Fewer API calls to external services  
**Simplicity:** Skip complex mocking setups

---

## Recording a HAR File

Playwright provides `page.routeFromHAR()` to record HAR files. Set `update: true` to capture real network traffic:

```typescript
import { test } from '@playwright/test';

test('record HAR file', async ({ page }) => {
  // Record HAR file with real API calls
  await page.routeFromHAR('./hars/api-traffic.har', {
    url: '*/**/api/**',  // Only record API calls
    update: true         // Create/update HAR with real data
  });

  // Navigate and interact with your app
  await page.goto('https://your-app.com/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Wait for dashboard to load
  await page.waitForURL('**/dashboard');
});
```

Run this once, and Playwright saves matching network traffic to `hars/api-traffic.har`.

**Alternative:** You can also use Playwright CLI to record HAR files:
```bash
npx playwright open --save-har=api-traffic.har --save-har-glob="**/api/**" https://your-app.com
```

---

## Replaying a HAR File in Tests

Now use that recording to mock API responses. Simply remove `update: true` or set it to `false`:

```typescript
import { test, expect } from '@playwright/test';

test('test dashboard with mocked APIs', async ({ page }) => {
  // Replay from HAR file - no real API calls!
  await page.routeFromHAR('./hars/api-traffic.har', {
    url: '*/**/api/**',
    update: false  // Use recorded responses
  });

  // Navigate directly to dashboard (no login needed!)
  await page.goto('https://your-app.com/dashboard');
  
  // Your app thinks it's getting real API responses
  await expect(page.locator('h1')).toContainText('Welcome back');
});
```

Playwright will match requests by URL, HTTP method, and POST payloads. If multiple recordings match, it picks the one with the most matching headers.

---

## Modifying HAR Files

HAR files are stored as hashed `.txt` files inside your `hars/` folder. You can manually edit the JSON to change mock data:

```json
[
  {
    "name": "Playwright",
    "id": 100
  },
  // ... other items
]
```

Commit these files to source control. When you run tests with `update: true`, it will refresh the HAR with new API responses.

**⚠️ Security Note:** Before committing HAR files, search for real bearer tokens or sensitive data in the JSON. Replace them with dummy values like `"token"` — Playwright will still replay the responses correctly since it matches requests by URL and method, not token values.

---

## Updating HAR Files

HAR files can go stale if your API changes. Re-record them by setting `update: true`:

```typescript
test('update HAR recording', async ({ page }) => {
  await page.routeFromHAR('./hars/api-traffic.har', {
    url: '*/**/api/**',
    update: true  // Refresh HAR with current API responses
  });

  await page.goto('https://your-app.com/dashboard');
  // HAR file now updated with latest responses
});
```

---

## When NOT to Use HAR Files

- **Testing backend logic** — HAR files only mock responses, not server behavior
- **Dynamic data** — Timestamps, random IDs, or real-time data will be static
- **Authentication testing** — HAR files bypass login flows (good for UI, bad for auth tests)

For those cases, stick with real API calls or dedicated API mocking tools.

---

## Pro Tips

**1. Use context-level HAR routing:**
Apply HAR mocking to all pages in a context:
```typescript
test('test with HAR', async ({ browser }) => {
  const context = await browser.newContext();
  await context.routeFromHAR('./hars/api.har');
  
  const page = await context.newPage();
  // All pages in this context use HAR mocking
});
```

**2. Organize by feature/user type:**
```
hars/
  ├── dashboard.har
  ├── checkout.har
  ├── standardUser.har
  └── adminUser.har
```

**3. Use ZIP archives for large HAR files:**
If your HAR file ends with `.zip`, Playwright stores payloads as separate files:
```typescript
await page.routeFromHAR('./hars/api-traffic.har.zip', {
  update: true
});
```

**4. Commit HAR files to source control:**
HAR files should be versioned alongside your tests so the entire team uses the same mocked data.

---

## Final Thoughts

HAR files turn Playwright into a time machine for your network traffic. Record once, replay forever (or until your API changes). Your tests get faster, more reliable, and completely independent of backend availability.

Give it a shot — you might never go back to waiting for real APIs in your test suite.
