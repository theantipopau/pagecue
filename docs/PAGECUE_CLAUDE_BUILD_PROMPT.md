# PageCue — Master Project Prompt for Claude in VSCode

> **Purpose:** Paste this document into the root of the PageCue repository and ask Claude to read it before beginning work.  
> **Recommended filename:** `PAGECUE_CLAUDE_BUILD_PROMPT.md`  
> **Working product name:** PageCue  
> **Working tagline:** *Remember the story. Resume the journey.*

---

## 1. Your role

You are the senior product architect, UX designer, full-stack engineer, data modeller, AI-safety engineer, test engineer, and technical writer responsible for designing and building a new application called **PageCue**.

You are working inside VSCode with direct access to the current repository and its terminal.

Your job is not merely to provide recommendations or sample snippets. You are expected to:

1. Inspect the existing repository.
2. Understand the current application state.
3. Create or improve the project documentation.
4. Establish the architecture.
5. Implement the application incrementally.
6. Run the application locally.
7. Run linting, type checking, tests, and production builds.
8. Fix issues that you discover.
9. Maintain a clear changelog and roadmap.
10. Leave the repository in a coherent, documented, and working state.

Work carefully and methodically. Do not rush into creating disconnected screens or placeholder code before understanding the product rules below.

Do not overwrite useful existing work.

Do not silently replace the existing technology stack if one already exists. Inspect the repository first, explain any important conflicts in the implementation notes, and adapt sensibly.

When a decision is reversible, choose a reasonable default and proceed.

When a decision is expensive or difficult to reverse, record it in `docs/DECISIONS.md`.

Do not repeatedly ask for confirmation for routine implementation choices. Make a sensible engineering decision, document it, and continue unless genuinely blocked by missing credentials, unavailable infrastructure, or an irreversible product decision.

---

# 2. Product vision

PageCue is a **spoiler-safe reading companion** for people who frequently stop and restart books.

A reader may put down a novel for several days, weeks, or months. When they return, they often remember the general premise but cannot recall:

- Which characters have already been introduced.
- What relationships have been established.
- What happened immediately before they stopped.
- Which mysteries remain unresolved.
- Where each important character currently is.
- What the reader is expected to know at this point.
- Which details are important without revealing what happens later.

PageCue helps the reader resume the original book without restarting it and without reading a complete-book summary that contains spoilers.

The core product promise is:

> **Tell PageCue where you stopped, and receive a concise reminder containing only information you have already encountered.**

PageCue does not exist to replace reading.

PageCue does not provide condensed substitutes for books.

PageCue exists to help readers return to books they already own, borrow, or are currently reading.

---

# 3. Core user experience

The intended experience is simple:

1. The user searches for a book by title, author, or ISBN.
2. The user selects the correct book and, where possible, the correct edition.
3. The user adds the book to their personal shelf.
4. The user records their current progress.
5. PageCue determines the safest supported story boundary.
6. The user chooses a recap length.
7. PageCue generates or retrieves a spoiler-safe recap.
8. The recap reminds the reader of:
   - The story so far.
   - Important characters.
   - Current circumstances.
   - Important relationships.
   - Unresolved story threads.
9. The recap clearly states its spoiler boundary.
10. The user returns to the original book.

The product should feel calmer and more literary than a generic AI chat application.

---

# 4. Non-negotiable product rules

These rules are fundamental. Do not weaken or bypass them during implementation.

## 4.1 No unsupported book summaries

PageCue must not claim that it can accurately summarise any arbitrary commercial book using only:

- The title.
- The author.
- A page number.
- General model knowledge.
- A public book description.
- Search engine snippets.
- Reviews.
- Wikipedia-style plot summaries.
- Marketing copy.
- User-generated internet summaries.

A recap may only be produced when PageCue has an approved and structured story source for that book or demonstration title.

If PageCue does not have an approved source, the interface must clearly state that recap support is unavailable for that title or edition.

Do not fabricate availability.

## 4.2 No general AI knowledge as the story source

The recap model must not use its pre-existing knowledge of the novel.

The model must use only the structured story-state data supplied in the request.

The system prompt for recap generation must explicitly prohibit:

- Outside knowledge.
- Later plot information.
- Foreshadowing based on later events.
- Speculation.
- “Helpful” additions not grounded in the supplied data.
- Describing a detail as significant because of information revealed later.
- Referencing adaptations, sequels, reviews, fandom pages, or cultural knowledge.

## 4.3 Strict spoiler boundary

Every recap must be tied to a known maximum story segment.

The recap process must ensure that:

- Later segments are never supplied to the recap model.
- Every factual claim is traceable to one or more allowed segment IDs.
- No supporting segment exceeds the selected boundary.
- Invalid or unsupported outputs are rejected before display.
- The user sees the boundary used.
- Approximate boundaries are labelled as approximate.
- Page-based progress is not represented as exact unless edition mapping is exact.

## 4.4 The application must work without paid services

The local application must remain usable without:

- An OpenAI API key.
- An Anthropic API key.
- A Google Books API key.
- Cloudflare resources.
- A production database.
- Authentication credentials.

Use deterministic mock providers and a synthetic demonstration novel.

External integrations must be optional adapters.

## 4.5 The interface must be honest

When exact matching is unavailable, communicate uncertainty.

Examples:

- “Recap available through Chapter 8.”
- “Your selected page appears to fall near the end of Chapter 8.”
- “Page mapping is approximate for this edition.”
- “Recaps are not yet available for this edition.”
- “This title is available for tracking, but not for recap generation.”

Never disguise uncertainty behind confident language.

---

# 5. Target users

Primary users include:

## 5.1 The interrupted reader

A person who:

- Reads several books at once.
- Pauses a book for days or weeks.
- Wants to continue without restarting.
- Avoids online summaries because of spoilers.

## 5.2 The busy reader

A person who:

- Reads in short intervals.
- Has limited time.
- Needs a 10-second or 30-second refresher before continuing.

## 5.3 The series reader

A person who:

- Returns to a long fantasy, science-fiction, mystery, or historical-fiction novel.
- Needs character and relationship reminders.
- Does not want future revelations included.

## 5.4 The physical-book reader

A person who:

- Reads paperbacks or hardcovers.
- Cannot rely on Kindle or another closed reading platform.
- Wants to scan an ISBN and enter a page or chapter.

## 5.5 The cross-platform reader

A person who:

- Uses physical books, Kindle, Kobo, Apple Books, Google Play Books, library ebooks, and audiobooks.
- Wants one personal shelf and progress record across formats.

---

# 6. Product positioning

PageCue should be framed as:

> **A universal, edition-aware, spoiler-safe reading companion.**

It should not be framed primarily as:

- An AI chatbot.
- A book replacement.
- A study-notes generator.
- A full-book summary platform.
- A social reading network.
- A book review website.
- A piracy tool.
- An ebook storage locker.
- A generic document summariser.

The strongest distinction is that PageCue helps the reader return to the original book.

---

# 7. Phase 1 MVP scope

Build a polished and demonstrable Phase 1 application.

Phase 1 should prove the complete core experience using controlled data.

## 7.1 Required Phase 1 features

Implement:

- A polished landing page.
- A responsive application shell.
- Mobile-first design.
- Desktop, tablet, and mobile layouts.
- Light and dark appearance.
- Installable PWA foundations.
- A guest-mode reading shelf.
- Search by:
  - Title.
  - Author.
  - ISBN-10.
  - ISBN-13.
- A mock book-search provider.
- Optional Google Books search.
- Book result cards.
- Book detail view.
- Edition metadata display.
- Add to shelf.
- Remove from shelf.
- Update reading status.
- Update reading progress.
- Search and filter the shelf.
- Reading statuses:
  - Want to read.
  - Reading.
  - Paused.
  - Finished.
- Progress types:
  - Chapter.
  - Percentage.
  - Page.
- A clear edition warning for page-based progress.
- A synthetic demonstration novel.
- At least six synthetic chapters.
- Structured story snapshots.
- A complete recap flow.
- Three recap lengths:
  - Quick.
  - Standard.
  - Detailed.
- Recap sections:
  - Story so far.
  - People to remember.
  - Where things currently stand.
  - Unresolved threads.
  - Spoiler boundary.
  - Confidence.
- Saved recap history for the demonstration book.
- Loading states.
- Skeleton states.
- Empty states.
- Error states.
- Unavailable recap states.
- Accessible forms.
- Keyboard navigation.
- Reduced-motion support.
- Responsive navigation that does not overwhelm small screens.
- Local persistence for the guest shelf.
- Unit tests.
- Critical end-to-end tests.
- Documentation.
- Changelog.

## 7.2 Phase 1 non-goals

Do not build these unless the existing repository already contains them and they can be safely retained:

- Real user accounts.
- Social login.
- Payments.
- Subscriptions.
- Public profiles.
- Followers.
- Reviews.
- Ratings.
- Book clubs.
- Public comments.
- Publisher dashboards.
- Real publisher licensing workflows.
- Kindle account scraping.
- DRM circumvention.
- Arbitrary PDF ingestion.
- Arbitrary EPUB ingestion.
- Audiobook syncing.
- Vector search.
- Native mobile applications.
- Push notifications.
- Complex gamification.
- Reading streaks.
- Public sharing of generated summaries.
- Full-text storage of commercial books.
- A general chat interface.

---

# 8. Future phases

Create the architecture so these can be added later without bloating Phase 1.

## Phase 2 — Accounts and private source ingestion

Potential scope:

- User accounts.
- Secure authentication.
- Cloud-synchronised shelves.
- Private EPUB and TXT ingestion.
- Chapter detection.
- Manual chapter correction.
- Private processing jobs.
- Structured snapshot generation.
- Source deletion controls.
- Recap history.
- Data export.
- Data deletion.
- Usage limits.
- Privacy controls.

Do not implement DRM circumvention.

## Phase 3 — Physical books and edition-aware matching

Potential scope:

- ISBN barcode scanning.
- Camera support.
- Exact edition selection.
- Page-number mapping.
- Chapter-to-page maps.
- Photograph the current page.
- Optional last-sentence matching.
- Confidence scores.
- Approximate boundary warnings.
- Manual correction when mapping fails.

## Phase 4 — Licensed catalogue

Potential scope:

- Publisher and author agreements.
- Preprocessed commercial catalogue.
- Shared structured story maps.
- Edition maps.
- Catalogue administration.
- Rights tracking.
- Territory controls.
- Content expiry.
- Licensing metadata.

## Phase 5 — Cross-platform and audio integrations

Potential scope:

- Audiobook timestamp progress.
- Kobo integration where permitted.
- Kindle integration where permitted.
- Apple Books integration where permitted.
- Google Play Books integration where permitted.
- Library-service imports.
- Reading-app import/export.
- Mobile applications.

---

# 9. Recommended technical stack

First inspect the repository.

If it is empty or there is no established stack, use:

- **Framework:** Next.js with App Router.
- **Language:** TypeScript.
- **UI:** React.
- **Styling:** Tailwind CSS.
- **Components:** shadcn/ui selectively.
- **Validation:** Zod.
- **Hosting:** Cloudflare Workers through the supported OpenNext adapter.
- **Database:** Cloudflare D1.
- **Object storage for future uploads:** Cloudflare R2.
- **Testing:** Vitest and Playwright.
- **Linting:** ESLint.
- **Formatting:** Prettier or the existing formatter.
- **Package manager:** npm unless the repository already uses another package manager.
- **PWA:** Web app manifest and service worker using a compatible, maintained approach.
- **Book metadata:** Google Books through a server-side adapter.
- **AI recap:** Provider abstraction with deterministic mock implementation first.

Do not choose a dependency simply because it is fashionable.

Avoid unnecessary state-management libraries during Phase 1.

Prefer:

- Server components where appropriate.
- Client components only where interactivity requires them.
- URL state for search and filtering where useful.
- Repository and provider abstractions around external systems.
- Clear domain types.
- Strict validation at system boundaries.

---

# 10. Provider architecture

The UI must not call external services directly.

Define clear interfaces.

Suggested interfaces:

```ts
export interface BookSearchProvider {
  search(query: BookSearchQuery): Promise<BookSearchResponse>;
  getEdition?(id: string): Promise<BookEdition | null>;
}

export interface RecapProvider {
  generateRecap(input: GenerateRecapInput): Promise<ValidatedRecap>;
}

export interface LibraryRepository {
  listLibraryItems(profileId: string): Promise<LibraryItem[]>;
  getLibraryItem(id: string): Promise<LibraryItem | null>;
  addLibraryItem(input: AddLibraryItemInput): Promise<LibraryItem>;
  updateLibraryItem(
    id: string,
    input: UpdateLibraryItemInput
  ): Promise<LibraryItem>;
  removeLibraryItem(id: string): Promise<void>;
}

export interface StorySourceRepository {
  getBookSupport(bookId: string): Promise<BookSupportStatus>;
  getSnapshotAtBoundary(
    sourceDocumentId: string,
    maximumSegmentOrdinal: number
  ): Promise<StorySnapshot | null>;
  listSupportedBoundaries(
    sourceDocumentId: string
  ): Promise<StoryBoundary[]>;
}
```

Implement Phase 1 adapters resembling:

- `MockBookSearchProvider`
- `GoogleBooksProvider`
- `MockRecapProvider`
- `OpenAIRecapProvider` or another optional real provider
- `LocalLibraryRepository`
- `D1LibraryRepository`
- `SyntheticStorySourceRepository`
- `D1StorySourceRepository`

Use environment configuration to select adapters.

The default local mode must use:

- Mock book search if no metadata key is available.
- Local shelf storage.
- Synthetic story data.
- Mock recap generation.

---

# 11. Project modes

Define explicit application modes.

Suggested environment variables:

```env
NEXT_PUBLIC_APP_MODE=development

BOOK_SEARCH_PROVIDER=mock
RECAP_PROVIDER=mock
LIBRARY_REPOSITORY=local
STORY_SOURCE_REPOSITORY=synthetic

GOOGLE_BOOKS_API_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=

CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_DATABASE_ID=
CLOUDFLARE_R2_BUCKET=
```

Do not expose server secrets through `NEXT_PUBLIC_` variables.

Add an `.env.example`.

Document each environment variable in `README.md`.

The application should clearly indicate when it is running in demonstration mode, but this should be subtle and polished rather than appearing as a developer error banner.

---

# 12. Design direction

PageCue should feel like a premium reading product.

It should not feel like:

- A generic SaaS dashboard.
- A corporate admin portal.
- An AI chat tool.
- A neon technology showcase.
- A cluttered social network.
- A default shadcn demonstration.
- A template with no visual identity.

## 12.1 Visual qualities

Use:

- Warm paper-inspired backgrounds.
- Calm contrast.
- Excellent text readability.
- Editorial serif headings.
- Clean sans-serif interface text.
- Large and attractive book covers.
- Generous spacing.
- Restrained borders.
- Soft shadows.
- Subtle depth.
- Consistent radii.
- Muted accent colours.
- Refined hover and focus states.
- Thoughtful empty states.
- Carefully controlled animation.

Avoid:

- Excessive gradients.
- Glowing AI effects.
- Excessive glassmorphism.
- Strong drop shadows everywhere.
- Too many cards.
- Dense admin-style tables.
- Small text.
- Low-contrast grey text.
- Unnecessary carousels.
- Chat bubbles for the main recap.
- Mobile sidebars that cover the entire screen unnecessarily.

## 12.2 Suggested visual identity

Use a flexible theme with CSS variables.

Suggested tone:

- Background: warm ivory or parchment.
- Surface: slightly lighter paper.
- Primary text: charcoal.
- Muted text: warm grey.
- Accent: muted forest green, deep navy, or burgundy.
- Success: subdued green.
- Warning: warm amber.
- Error: restrained red.

Do not hardcode colours throughout components.

Create semantic variables for:

- `--background`
- `--surface`
- `--surface-elevated`
- `--foreground`
- `--muted`
- `--muted-foreground`
- `--border`
- `--primary`
- `--primary-foreground`
- `--success`
- `--warning`
- `--danger`
- `--focus-ring`
- `--radius-sm`
- `--radius-md`
- `--radius-lg`
- `--shadow-sm`
- `--shadow-md`
- `--motion-fast`
- `--motion-standard`
- `--motion-slow`

## 12.3 Typography

Use an editorial serif for:

- Product wordmark.
- Major headings.
- Recap headings.
- Book titles where appropriate.

Use a readable sans-serif for:

- Navigation.
- Buttons.
- Forms.
- Metadata.
- Utility text.

Do not sacrifice performance for a large font payload.

Use system fallbacks.

## 12.4 Motion

Use motion sparingly.

Suitable examples:

- Bookmark movement when saving progress.
- Soft page transition.
- Recap section reveal.
- Cover lift on hover.
- Progress indicator movement.

Respect `prefers-reduced-motion`.

Do not animate critical text excessively.

---

# 13. Information architecture

Create a coherent application structure.

Suggested primary routes:

```text
/
  Landing page or signed-out guest home

/app
  Guest shelf dashboard

/search
  Book search

/books/[bookId]
  Book detail and edition information

/library/[libraryItemId]
  Reading item detail

/library/[libraryItemId]/progress
  Progress editor

/library/[libraryItemId]/recap
  Recap configuration and result

/settings
  Theme, privacy, and application information

/about
  Product purpose and spoiler-safety explanation
```

Use route groups if helpful.

Do not create unnecessary pages.

---

# 14. Primary page requirements

## 14.1 Landing page

The landing page should communicate the product within seconds.

Include:

- Product name.
- Tagline.
- One-sentence explanation.
- Primary call to action.
- A visual example of a recap.
- A brief “How it works” section.
- Clear statement that PageCue avoids spoilers beyond the selected point.
- Clear statement that recap availability depends on supported story data.
- A privacy-focused explanation.
- A demonstration-book entry point.

Possible hero copy:

> **Pick up where you left off.**  
> PageCue reminds you what has happened in your book so far—without revealing what comes next.

Do not make unsupported claims such as “Works with every book.”

## 14.2 Shelf dashboard

Include:

- Greeting or neutral heading.
- Currently reading section.
- Paused books.
- Recently updated progress.
- Add a book action.
- Search and filter.
- Reading status controls.
- Progress indicator.
- Recap availability indicator.
- Empty state.

Each book item should make the next action obvious.

For example:

- “Update progress.”
- “Resume with a recap.”
- “Recap unavailable.”
- “Finish book.”

## 14.3 Search page

Support:

- Free-text title and author search.
- ISBN detection.
- Search submit.
- Debounced suggestions only if implemented carefully.
- Loading state.
- Empty state.
- Error state.
- Result normalisation.
- Cover fallback.
- Duplicate handling.

Each result should show:

- Cover.
- Title.
- Subtitle if relevant.
- Author.
- Publication date.
- Publisher if available.
- ISBN.
- Page count if available.
- Language if available.
- Edition ambiguity warning if needed.
- Recap support status.

A user must be able to track an unsupported book, but the recap button must remain unavailable.

## 14.4 Book detail page

Include:

- Large cover.
- Title.
- Author.
- Edition information.
- Publication details.
- ISBN.
- Page count.
- Language.
- Book description only as metadata.
- Explicit notice that description text is not used as a recap source.
- Recap availability.
- Add-to-shelf action.
- Status selector.
- Progress setup.

## 14.5 Progress editor

Support:

- Chapter.
- Percentage.
- Page.

Validation:

- Chapter must exist in a supported chapter list when available.
- Percentage must be between 0 and 100.
- Page must be positive.
- Page must not exceed known edition page count when reliable.
- Page progress must display an edition warning.
- Unsupported progress types must not silently map to exact story boundaries.

Show how the entered progress maps to a supported boundary.

Example:

> Page 214 appears to correspond approximately to the end of Chapter 11.  
> The recap will include content through Chapter 11.

The user should be able to accept the boundary or choose an earlier supported boundary.

Never automatically choose a later boundary.

## 14.6 Recap setup

Allow the user to select:

- Quick.
- Standard.
- Detailed.

Explain each:

- Quick: key reminders in approximately 10 seconds.
- Standard: concise story, characters, and open threads.
- Detailed: a fuller refresher without going beyond the boundary.

Show:

- Book title.
- Current progress.
- Safe recap boundary.
- Confidence.
- Generate button.
- Privacy note.
- Spoiler-safety note.

## 14.7 Recap result

The recap result is the central product experience.

Use an editorial reading layout rather than a chat response.

Sections:

### The story so far

A concise prose recap.

### People to remember

For each important character:

- Name.
- Short reminder.
- Current state.
- Relevant relationship if useful.

### Where things currently stand

A small number of clear points describing the latest safe circumstances.

### Unresolved threads

Only threads that remain unresolved at the boundary.

Do not call something unresolved if it was already resolved before the boundary.

### Spoiler boundary

Display:

- Maximum chapter or segment used.
- User-entered progress.
- Whether mapping is exact or approximate.
- Confidence level.
- A plain-language reassurance that later segments were not used.

### Actions

Include:

- Change recap length.
- Update progress.
- Return to shelf.
- Regenerate only when appropriate.
- Report a problem.
- Copy recap only if privacy and rights considerations are addressed.

Avoid large amounts of decorative UI around the recap text.

---

# 15. Synthetic demonstration novel

Create a completely original synthetic demonstration novel.

Do not copy or closely imitate an existing copyrighted novel.

The demonstration novel should have:

- A distinctive title.
- An author name clearly marked as fictional.
- At least six short chapters.
- At least four recurring characters.
- At least two locations.
- A central mystery or objective.
- Relationships that evolve.
- Threads that open and later resolve.
- At least one intentionally misleading early assumption.
- At least one thread that remains unresolved at the end of the available demo.

Suggested genre:

- Gentle speculative mystery.
- Historical mystery.
- Adventure.
- Literary fantasy.

Keep the story suitable for a general audience.

Create:

- Book metadata.
- Chapter metadata.
- Ordered segments.
- Cumulative story-state snapshots.
- Supported boundaries.
- Mock recaps.
- Test fixtures.

The synthetic source should be rich enough to test spoiler boundaries properly.

---

# 16. Story representation

Use ordered segments.

A chapter may contain one or more segments.

Suggested core types:

```ts
export type SegmentId = string;

export interface StorySegment {
  id: SegmentId;
  sourceDocumentId: string;
  chapterId: string;
  chapterOrdinal: number;
  segmentOrdinal: number;
  title?: string;
  startPercentage?: number;
  endPercentage?: number;
}

export interface CharacterState {
  id: string;
  name: string;
  aliases: string[];
  reminder: string;
  currentState: string;
  knownRelationships: Array<{
    characterId: string;
    description: string;
  }>;
  currentLocationId?: string;
  firstSeenSegmentOrdinal: number;
  lastSeenSegmentOrdinal: number;
  supportingSegmentIds: SegmentId[];
}

export interface StoryEvent {
  id: string;
  description: string;
  segmentOrdinal: number;
  supportingSegmentIds: SegmentId[];
}

export interface StoryThread {
  id: string;
  description: string;
  status: "open" | "resolved";
  introducedSegmentOrdinal: number;
  resolvedSegmentOrdinal?: number;
  supportingSegmentIds: SegmentId[];
}

export interface StorySnapshot {
  sourceDocumentId: string;
  boundarySegmentOrdinal: number;
  boundaryLabel: string;
  cumulativeSummary: string;
  characters: CharacterState[];
  importantEvents: StoryEvent[];
  openThreads: StoryThread[];
  resolvedThreads: StoryThread[];
  locations: Array<{
    id: string;
    name: string;
    description: string;
    supportingSegmentIds: SegmentId[];
  }>;
  supportingSegmentIds: SegmentId[];
}
```

A story snapshot must represent the reader-safe state after the specified segment.

Later information must not be retroactively inserted into earlier snapshots.

For example:

- Do not describe an apparently friendly character as “secretly the antagonist” in an early snapshot.
- Do not label an object as “the key to the final mystery” before the characters know that.
- Do not describe an early clue as important because of a later revelation.
- Do not remove an open thread until it is resolved at or before the boundary.

---

# 17. Recap output schema

Use a strict schema.

Suggested shape:

```ts
export const RecapSchema = z.object({
  bookTitle: z.string().min(1),
  boundaryLabel: z.string().min(1),
  detailLevel: z.enum(["quick", "standard", "detailed"]),
  summary: z.string().min(1),
  characters: z.array(
    z.object({
      name: z.string().min(1),
      reminder: z.string().min(1),
      currentState: z.string().min(1),
      supportingSegmentIds: z.array(z.string().min(1)).min(1),
    })
  ),
  currentSituation: z.array(
    z.object({
      text: z.string().min(1),
      supportingSegmentIds: z.array(z.string().min(1)).min(1),
    })
  ),
  unresolvedThreads: z.array(
    z.object({
      text: z.string().min(1),
      supportingSegmentIds: z.array(z.string().min(1)).min(1),
    })
  ),
  confidence: z.enum(["high", "medium", "low"]),
  confidenceReason: z.string().min(1),
  spoilerWarning: z.string().min(1),
});
```

Every factual item must contain one or more supporting segment IDs.

Do not treat structured model output as inherently safe.

Validate it again.

---

# 18. Spoiler-safety validator

Create a deterministic validator.

It must receive:

- The allowed source document ID.
- The selected maximum segment ordinal.
- The complete list of permitted segment IDs.
- The parsed recap.

It must reject output when:

- A supporting segment ID does not exist.
- A supporting segment belongs to another book.
- A supporting segment exceeds the boundary.
- A required section is malformed.
- A recap contains unsupported data.
- A boundary label conflicts with the selected boundary.
- A factual item has no supporting segment.
- The output contains HTML or unsafe markup where plain text is expected.
- The output is too large for the selected recap level.
- The output includes suspicious future-oriented phrasing where practical to detect.

Create a result type such as:

```ts
type RecapValidationResult =
  | {
      valid: true;
      recap: ValidatedRecap;
    }
  | {
      valid: false;
      reason:
        | "SCHEMA_INVALID"
        | "UNKNOWN_SEGMENT"
        | "FUTURE_SEGMENT_REFERENCE"
        | "BOOK_MISMATCH"
        | "BOUNDARY_MISMATCH"
        | "UNSUPPORTED_CLAIM"
        | "UNSAFE_CONTENT";
      safeMessage: string;
    };
```

Never display an unvalidated recap.

On failure:

- Log only safe diagnostic metadata.
- Do not log source-book text.
- Do not show stack traces to the user.
- Display a safe recovery message.
- Permit retry where appropriate.
- Preserve the selected boundary.

---

# 19. AI recap instructions

The real AI provider must be behind an interface.

The provider should receive only:

- Book title.
- Detail level.
- Boundary label.
- Structured snapshot.
- Allowed segment IDs.
- Output schema instructions.

Do not supply future snapshots.

Do not supply the full book.

Do not ask the model to recall the book.

Use a system instruction equivalent to:

```text
You generate spoiler-safe reading recaps.

Use only the structured story-state data supplied in this request.

Do not use any outside knowledge about the book, author, series, adaptation, genre conventions, reviews, fandom material, or later events.

Do not infer what happens after the supplied boundary.

Do not foreshadow.

Do not describe a detail as significant because of information learned later.

Do not speculate.

Do not invent motives, relationships, events, or character states.

Do not include direct quotations from the source book.

Every factual item must cite one or more supplied supporting segment IDs.

The result is a reminder that helps the reader return to the original book. It must not replace the source text.

Use clear, natural language appropriate to the selected detail level.

Return only data matching the required schema.
```

Use a low-variance configuration appropriate for factual summarisation.

Read the model name from an environment variable.

Disable provider-side storage where supported.

Set sensible timeouts.

Handle:

- Provider errors.
- Timeouts.
- Rate limits.
- Invalid structured output.
- Empty output.
- Schema mismatch.
- Retry limits.

Do not create unbounded retry loops.

The default local implementation must be deterministic and not call an AI service.

---

# 20. Book metadata integration

Implement a `GoogleBooksProvider` through a server-only route or server action.

Do not expose the API key to the browser.

Support:

- General title search.
- Author search.
- ISBN-10.
- ISBN-13.

Create internal types independent of Google’s response shape.

Normalise:

- External volume ID.
- Title.
- Subtitle.
- Authors.
- Publisher.
- Published date.
- Description.
- ISBN-10.
- ISBN-13.
- Page count.
- Language.
- Cover URLs.
- Preview availability.
- Canonical metadata source.

Handle:

- Missing covers.
- Missing descriptions.
- Missing page counts.
- Missing ISBNs.
- Duplicate entries.
- Rate limits.
- Timeouts.
- Empty results.
- Invalid responses.
- Network failure.

Do not use the Google Books description as a recap source.

Treat it only as catalogue metadata.

Add a mock provider with predictable fixtures.

---

# 21. ISBN handling

Create utilities to:

- Remove spaces and hyphens.
- Detect ISBN-10.
- Detect ISBN-13.
- Validate checksums.
- Convert ISBN-10 to ISBN-13 where appropriate.
- Format ISBNs for display.
- Distinguish malformed identifiers from ordinary search text.

Test valid and invalid examples.

Do not assume every 10- or 13-digit string is an ISBN.

---

# 22. Reading progress model

Suggested model:

```ts
export type ReadingStatus =
  | "want_to_read"
  | "reading"
  | "paused"
  | "finished";

export type ProgressType =
  | "chapter"
  | "percentage"
  | "page";

export interface ReadingProgress {
  type: ProgressType;
  value: number;
  chapterOrdinal?: number;
  chapterLabel?: string;
  pageNumber?: number;
  percentage?: number;
  mappedBoundarySegmentOrdinal?: number;
  mappedBoundaryLabel?: string;
  mappingConfidence?: "exact" | "high" | "medium" | "low";
  mappingExplanation?: string;
  updatedAt: string;
}
```

Rules:

- Progress values must be validated.
- The system must not silently round up to a later story boundary.
- If an entered position falls between supported boundaries, choose the earlier safe boundary.
- A user may choose an even earlier boundary.
- Mark books complete separately from entering 100%.
- Keep progress history if it can be implemented cleanly.
- Use ISO timestamps.

---

# 23. Local guest shelf

Phase 1 should work in guest mode.

Use a repository abstraction.

A local implementation may use `localStorage`, IndexedDB, or another lightweight browser persistence mechanism.

Requirements:

- Version stored data.
- Validate data when reading.
- Recover gracefully from corrupt data.
- Migrate schema versions where practical.
- Avoid direct storage access throughout UI components.
- Provide an option to reset demonstration data.
- Seed the synthetic demonstration book.
- Do not pretend guest data is cloud-synchronised.
- Clearly state that clearing browser data can remove the guest shelf.

If using localStorage, keep the stored payload modest.

---

# 24. D1 schema

Create migrations even if the default Phase 1 experience uses local storage.

Suggested tables:

## `books`

- `id`
- `canonical_title`
- `subtitle`
- `authors_json`
- `description`
- `language`
- `cover_url`
- `metadata_provider`
- `metadata_provider_id`
- `created_at`
- `updated_at`

## `editions`

- `id`
- `book_id`
- `isbn_10`
- `isbn_13`
- `publisher`
- `publication_date`
- `page_count`
- `format`
- `language`
- `created_at`
- `updated_at`

## `profiles`

Optional Phase 1 placeholder for future accounts:

- `id`
- `display_name`
- `created_at`
- `updated_at`

## `library_items`

- `id`
- `profile_id`
- `edition_id`
- `status`
- `progress_type`
- `progress_value`
- `chapter_ordinal`
- `page_number`
- `percentage`
- `mapped_boundary_segment_ordinal`
- `mapping_confidence`
- `created_at`
- `updated_at`

## `source_documents`

- `id`
- `edition_id`
- `source_type`
- `processing_status`
- `source_hash`
- `chapter_count`
- `created_at`
- `updated_at`

## `chapters`

- `id`
- `source_document_id`
- `ordinal`
- `title`
- `created_at`

## `segments`

- `id`
- `chapter_id`
- `source_document_id`
- `ordinal`
- `chapter_ordinal`
- `start_percentage`
- `end_percentage`
- `text_hash`
- `created_at`

## `story_snapshots`

- `id`
- `source_document_id`
- `boundary_segment_id`
- `boundary_segment_ordinal`
- `boundary_label`
- `snapshot_json`
- `prompt_version`
- `model`
- `created_at`

## `recaps`

- `id`
- `library_item_id`
- `source_document_id`
- `boundary_segment_ordinal`
- `detail_level`
- `recap_json`
- `provider`
- `model`
- `prompt_version`
- `validation_status`
- `created_at`

Requirements:

- Use foreign keys.
- Create useful indexes.
- Avoid storing arbitrary raw source-book text.
- Use stable IDs.
- Use migration files.
- Document schema decisions.
- Keep SQL compatible with D1.
- Add seed data for the synthetic novel if useful.

---

# 25. Security requirements

Implement sensible security for the MVP.

## 25.1 Secrets

- Keep API keys server-side.
- Never commit `.env` files.
- Provide `.env.example`.
- Ensure `.gitignore` is correct.
- Do not return secrets in server errors.
- Do not place secrets in client bundles.

## 25.2 Input validation

Validate:

- Search queries.
- ISBNs.
- Library item IDs.
- Progress values.
- Recap lengths.
- Boundary ordinals.
- Provider responses.
- Environment variables.

Use Zod or an equivalent consistent validation layer.

## 25.3 Output safety

- Render recap content as text.
- Do not use `dangerouslySetInnerHTML` for AI-generated content.
- Escape user-supplied values.
- Do not execute model output.
- Do not construct SQL from untrusted strings.
- Use parameterised queries.

## 25.4 Error handling

- Use typed errors where practical.
- Log safe metadata.
- Do not expose stack traces in production.
- Provide user-friendly recovery actions.
- Distinguish validation errors from service outages.

## 25.5 HTTP protections

Configure sensible headers where compatible:

- Content Security Policy.
- `X-Content-Type-Options`.
- Referrer policy.
- Frame protection.
- Permissions policy.
- Strict transport security in production.

Do not break required framework behaviour.

## 25.6 Rate limiting

Create a rate-limit abstraction for:

- Book search.
- Recap generation.

The local implementation may be simple.

Document how production rate limiting should work on Cloudflare.

---

# 26. Privacy requirements

Create a clear privacy explanation.

PageCue should communicate:

- Guest data is stored locally in Phase 1.
- External metadata searches may be sent to the configured provider.
- AI recaps use only approved structured story-state data.
- Later upload features will require the user to have lawful access to uploaded files.
- Users will need deletion controls before private uploads are released.
- Raw commercial book text should not be logged.
- Generated recaps are personal memory aids.

Do not make legal guarantees.

Include a visible disclaimer that legal advice is required before launching support for commercial copyrighted catalogues at scale.

---

# 27. Accessibility requirements

Meet a strong practical accessibility baseline.

Requirements:

- Semantic HTML.
- Logical heading hierarchy.
- Form labels.
- Descriptive button names.
- Keyboard navigation.
- Visible focus indicators.
- Skip link.
- Sufficient colour contrast.
- Screen-reader-friendly status updates.
- Reduced-motion support.
- Cover alt text.
- Decorative images marked appropriately.
- Error messages associated with fields.
- No critical information conveyed only by colour.
- Touch targets suitable for mobile.
- Dialog focus management.
- Avoid hover-only functionality.

Test primary flows with keyboard navigation.

---

# 28. Performance requirements

Aim for a fast, calm experience.

Requirements:

- Optimise cover images.
- Avoid downloading unnecessary client JavaScript.
- Use server rendering where useful.
- Lazy-load non-critical interface sections.
- Avoid large animation libraries unless justified.
- Avoid duplicate API requests.
- Cache metadata carefully.
- Do not cache personal recap data publicly.
- Use loading boundaries.
- Keep the initial route lightweight.
- Measure bundle size if tooling permits.
- Avoid premature optimisation that harms clarity.

---

# 29. Error and empty states

Design these deliberately.

Required states include:

- No books on shelf.
- No currently reading books.
- Search has not yet been used.
- No search results.
- Metadata provider unavailable.
- Book cover unavailable.
- Edition details incomplete.
- Recap not supported.
- Progress not entered.
- Story boundary uncertain.
- Recap provider unavailable.
- Recap validation failed.
- Local data corrupt.
- Offline mode.
- Demonstration mode.
- D1 unavailable.
- AI credentials missing.

Each state should explain what happened and provide a useful next action.

---

# 30. Offline and PWA foundations

Add a web app manifest.

Include:

- Product name.
- Short name.
- Description.
- Theme colour.
- Background colour.
- Display mode.
- Icons.
- Start URL.

Provide sensible offline behaviour.

At minimum:

- App shell should load where feasible.
- Existing guest shelf should remain readable.
- The synthetic demonstration data should remain usable if already cached.
- External search should clearly state that it requires a connection.
- Do not display stale network results as fresh without explanation.

Do not overcomplicate service-worker logic.

---

# 31. Testing requirements

Use Vitest for unit and integration tests.

Use Playwright for critical user flows.

## 31.1 Unit tests

Create tests for:

- ISBN normalisation.
- ISBN-10 checksum validation.
- ISBN-13 checksum validation.
- Search query classification.
- Google Books result normalisation.
- Duplicate edition handling.
- Missing metadata handling.
- Reading progress validation.
- Safe boundary selection.
- Selection of the earlier boundary.
- Story snapshot retrieval.
- Recap schema validation.
- Supporting segment validation.
- Future-segment rejection.
- Unknown segment rejection.
- Wrong-book segment rejection.
- Boundary mismatch rejection.
- Local repository persistence.
- Local schema migration.
- Corrupt local data recovery.
- Recap-length constraints.
- Environment configuration parsing.

## 31.2 Malicious spoiler fixtures

Create explicit fixtures where the recap provider:

- References a future segment.
- Mentions a later character identity.
- Uses an unknown segment ID.
- Uses a segment from another book.
- Claims an open thread is resolved too early.
- Uses a later boundary label.
- Omits all supporting evidence.

Confirm that these outputs are rejected.

## 31.3 Playwright flows

Create end-to-end coverage for:

1. Open the landing page.
2. Enter the application in guest mode.
3. Search using the mock provider.
4. Add a book to the shelf.
5. Update its reading status.
6. Set chapter progress.
7. Open the synthetic demonstration novel.
8. Set a supported progress boundary.
9. Generate a quick recap.
10. Change to standard recap.
11. Change to detailed recap.
12. Confirm the displayed spoiler boundary.
13. Return to the shelf.
14. Refresh the browser and confirm persistence.
15. Remove a book.
16. Test the empty shelf state.
17. Test keyboard navigation.
18. Test a mobile viewport.
19. Confirm that recap generation is unavailable for an unsupported title.
20. Confirm safe handling of recap validation failure.

## 31.4 Quality commands

Ensure the repository has scripts resembling:

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "lint": "...",
    "typecheck": "...",
    "test": "...",
    "test:watch": "...",
    "test:e2e": "...",
    "format": "...",
    "format:check": "..."
  }
}
```

Run all relevant checks before declaring a phase complete.

---

# 32. Documentation requirements

Create or maintain:

```text
README.md
CHANGELOG.md
CLAUDE.md
AGENTS.md
.env.example

docs/
  PRODUCT_SPEC.md
  ARCHITECTURE.md
  DATA_MODEL.md
  AI_RECAP_PIPELINE.md
  SPOILER_SAFETY.md
  DESIGN_SYSTEM.md
  SECURITY_AND_PRIVACY.md
  ACCESSIBILITY.md
  TESTING.md
  DEPLOYMENT.md
  ROADMAP.md
  DECISIONS.md
```

## 32.1 `README.md`

Include:

- Product summary.
- Current project status.
- Screenshot placeholders or actual screenshots when available.
- Technology stack.
- Local setup.
- Environment variables.
- Commands.
- Mock mode.
- Google Books setup.
- AI provider setup.
- D1 setup.
- Testing.
- Deployment.
- Known limitations.
- Roadmap link.

## 32.2 `CLAUDE.md`

Create a concise standing instruction file for future Claude sessions.

It must state:

- Read the project documentation before substantial changes.
- Preserve spoiler-safety.
- Never use general model knowledge as the story source.
- Never send later snapshots to recap generation.
- Maintain mock mode.
- Keep secrets server-side.
- Validate AI output.
- Run checks.
- Update docs and changelog.
- Preserve Cloudflare compatibility.
- Record major decisions.

## 32.3 `AGENTS.md`

Create an agent-neutral instruction file containing the same non-negotiable rules for other coding agents.

## 32.4 `PRODUCT_SPEC.md`

Include:

- User problem.
- Product promise.
- Target users.
- User stories.
- Functional requirements.
- Non-functional requirements.
- MVP scope.
- Non-goals.
- Terminology.
- Success indicators.
- Risks.
- Future phases.

## 32.5 `ARCHITECTURE.md`

Include:

- System context.
- Provider boundaries.
- Client/server responsibilities.
- Local mode.
- Cloudflare mode.
- Data flow.
- Recap flow.
- Error flow.
- Trust boundaries.
- Deployment view.

Use Mermaid diagrams where useful.

## 32.6 `AI_RECAP_PIPELINE.md`

Include:

- Source ingestion concept.
- Segmenting.
- Snapshot construction.
- Boundary selection.
- Recap generation.
- Structured output.
- Validation.
- Failure handling.
- Prompt versioning.
- Model-provider abstraction.

## 32.7 `SPOILER_SAFETY.md`

Include:

- Threat model.
- Product rules.
- Future-information risks.
- Prompt-level controls.
- Retrieval controls.
- Deterministic validation.
- Testing strategy.
- Incident handling.
- Known limitations.

## 32.8 `DESIGN_SYSTEM.md`

Include:

- Visual principles.
- Tokens.
- Typography.
- Components.
- Motion.
- Accessibility.
- Light and dark themes.
- Mobile behaviour.

## 32.9 `ROADMAP.md`

Use clear phases, milestones, and completion criteria.

Track:

- Completed.
- In progress.
- Planned.
- Deferred.

## 32.10 `DECISIONS.md`

Record decisions in a lightweight ADR-style format:

- Date.
- Decision.
- Context.
- Options considered.
- Choice.
- Consequences.
- Revisit trigger.

## 32.11 `CHANGELOG.md`

Use a clear versioned or unreleased structure.

Update it after meaningful work.

Do not write vague entries such as “updated app.”

Use entries such as:

- Added deterministic spoiler-boundary validator.
- Added synthetic six-chapter demonstration novel.
- Added guest shelf persistence with schema validation.
- Added server-side Google Books adapter.

---

# 33. Code quality expectations

Use strict TypeScript.

Avoid `any`.

Where `unknown` is necessary, validate it.

Use:

- Clear naming.
- Small focused functions.
- Domain types.
- Pure functions for validation and mapping.
- Explicit return types for important boundaries.
- Consistent error handling.
- Comments that explain why, not what.
- Tests for non-trivial logic.

Avoid:

- Giant components.
- Repeated fetch logic.
- API response shapes leaking into UI code.
- Business logic inside visual components.
- Hardcoded demonstration data scattered through files.
- Direct `localStorage` calls across components.
- Unvalidated JSON parsing.
- Silent catches.
- Magic numbers.
- Deeply nested conditional rendering.
- Premature abstractions with no use case.

Do not create a “utils” dumping ground.

Group code by domain or clear responsibility.

---

# 34. Suggested source structure

Adapt to the framework version and existing repository.

A possible structure:

```text
src/
  app/
    (marketing)/
    (product)/
    api/
  components/
    book/
    layout/
    progress/
    recap/
    shelf/
    ui/
  config/
  domain/
    books/
    library/
    progress/
    recap/
    story/
  providers/
    book-search/
    recap/
  repositories/
    library/
    story-source/
  lib/
    validation/
    storage/
    security/
    formatting/
  data/
    demo/
  styles/
  tests/
```

Keep domain logic separate from provider adapters.

Do not force this structure if the existing application already has a coherent alternative.

---

# 35. Cloudflare requirements

Maintain compatibility with Cloudflare Workers.

When setting up Cloudflare:

- Use the supported Next.js/OpenNext adapter.
- Add Wrangler configuration.
- Bind D1 correctly.
- Reserve R2 bindings for future use.
- Document local and remote migrations.
- Avoid Node-only packages that are incompatible with Workers unless isolated from production runtime.
- Confirm production build compatibility.
- Document environment variables and secrets.
- Do not commit account IDs if the repository should remain portable.
- Use preview environments where practical.

Create commands or instructions for:

- Creating D1.
- Applying local migrations.
- Applying remote migrations.
- Running with Wrangler.
- Deploying.
- Setting secrets.

Do not perform destructive remote operations without clear user intent.

---

# 36. Analytics and observability

Do not add invasive analytics in Phase 1.

Create an analytics abstraction or event naming plan only if useful.

Potential privacy-conscious events:

- Book search submitted.
- Book added to shelf.
- Progress updated.
- Recap requested.
- Recap completed.
- Recap validation failed.
- Unsupported title encountered.

Do not send:

- Raw source text.
- Full recap text.
- Sensitive user notes.
- API keys.
- Uploaded book content.

Create safe structured logging for server events.

Use request IDs where practical.

---

# 37. Product success indicators

Document how Phase 1 would be evaluated.

Potential indicators:

- A user can understand the product without explanation.
- A user can add a book in under one minute.
- A user can update progress in a few interactions.
- A user can generate a recap from the demo book without confusion.
- The user understands exactly where the spoiler boundary is.
- Unsupported books are handled honestly.
- A malicious future-segment recap is rejected.
- The app works on mobile.
- Guest shelf data persists after refresh.
- The app runs locally without external credentials.
- The production build succeeds.
- Core accessibility checks pass.

Do not add artificial vanity metrics.

---

# 38. Legal and content-risk boundaries

Do not provide legal advice.

Do not claim that copyrighted-book summarisation is automatically lawful.

Design the product so later legal review is possible.

Phase 1 should use only:

- Synthetic original story data.
- Public metadata.
- User-created tracking data.
- Optional public-domain material only if deliberately added later.

Do not store full commercial book text.

Do not create features for:

- Bypassing DRM.
- Downloading unauthorised ebooks.
- Extracting text from protected platforms.
- Sharing copyrighted source text.
- Reconstructing books from summaries.
- Publicly redistributing user-uploaded books.

Add a development note that publisher licensing and Australian copyright advice are required before broad commercial launch.

---

# 39. Implementation sequence

Follow this order unless repository conditions require a documented adjustment.

## Stage 1 — Repository inspection

1. Inspect all files.
2. Inspect package configuration.
3. Inspect Git status.
4. Identify the current framework.
5. Identify existing work worth preserving.
6. Identify missing documentation.
7. Record the current state.

Do not begin by deleting files.

## Stage 2 — Documentation foundation

Create or update:

- `CLAUDE.md`
- `AGENTS.md`
- `README.md`
- `CHANGELOG.md`
- `docs/PRODUCT_SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/AI_RECAP_PIPELINE.md`
- `docs/SPOILER_SAFETY.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/SECURITY_AND_PRIVACY.md`
- `docs/ACCESSIBILITY.md`
- `docs/TESTING.md`
- `docs/DEPLOYMENT.md`
- `docs/ROADMAP.md`
- `docs/DECISIONS.md`
- `.env.example`

## Stage 3 — Application foundation

1. Scaffold or configure Next.js.
2. Enable strict TypeScript.
3. Configure linting and formatting.
4. Configure Tailwind.
5. Establish design tokens.
6. Add application shell.
7. Add light and dark themes.
8. Add responsive navigation.
9. Add PWA manifest.
10. Add error boundaries.

## Stage 4 — Domain model

Create:

- Book metadata types.
- Edition types.
- Library item types.
- Reading status types.
- Progress types.
- Story segment types.
- Story snapshot types.
- Recap schema.
- Provider interfaces.
- Repository interfaces.
- Error types.

## Stage 5 — Synthetic demo data

Create:

- Original novel metadata.
- Six or more chapters.
- Ordered segments.
- Cumulative snapshots.
- Boundary list.
- Mock recaps.
- Malicious test fixtures.

## Stage 6 — Guest shelf

Implement:

- Local repository.
- Add item.
- Update item.
- Remove item.
- Reading status.
- Progress.
- Persistence.
- Data validation.
- Corrupt-data recovery.
- Seed demonstration item.

## Stage 7 — Core interface

Build:

- Landing page.
- Shelf dashboard.
- Search page.
- Book details.
- Progress editor.
- Recap setup.
- Recap result.
- Settings/about.

Ensure pages are connected and functional.

## Stage 8 — Recap pipeline

Implement:

- Safe boundary selection.
- Snapshot retrieval.
- Mock recap provider.
- Output schema.
- Deterministic validation.
- Safe error handling.
- Recap history.
- Detail levels.

## Stage 9 — Metadata integration

Implement:

- Server-side Google Books provider.
- Mock fallback.
- ISBN detection.
- Normalisation.
- Duplicate handling.
- Error states.
- Optional caching.

## Stage 10 — D1 and Cloudflare

Implement:

- Migrations.
- Bindings.
- D1 adapters.
- Wrangler configuration.
- Local development instructions.
- Deployment instructions.
- Production build checks.

## Stage 11 — Optional real AI provider

Implement only after mock mode is complete.

Add:

- Provider adapter.
- Environment selection.
- Structured output.
- Timeout.
- Retry policy.
- Storage-disabled request option where supported.
- Validation.
- Tests with mocked provider responses.

## Stage 12 — Testing and polish

1. Add unit tests.
2. Add malicious spoiler tests.
3. Add Playwright flows.
4. Test mobile layouts.
5. Test keyboard navigation.
6. Test dark mode.
7. Test empty states.
8. Test offline behaviour.
9. Run lint.
10. Run type checking.
11. Run unit tests.
12. Run end-to-end tests.
13. Run production build.
14. Fix all discovered issues.

## Stage 13 — Final documentation

Update:

- README.
- Roadmap.
- Decisions.
- Changelog.
- Known limitations.
- Deployment instructions.
- Next recommended phase.

---

# 40. Definition of done for Phase 1

Phase 1 is complete only when:

- The application runs locally.
- No external credentials are required for the main demo.
- The landing page clearly explains PageCue.
- A user can enter guest mode.
- A user can search mock books.
- A user can add a book.
- A user can update status and progress.
- A user can open the demonstration novel.
- A user can select a safe boundary.
- A user can generate quick, standard, and detailed recaps.
- The recap displays the boundary and confidence.
- Unsupported titles cannot generate fabricated recaps.
- Future segment references are rejected.
- Guest shelf data persists.
- The interface works on mobile.
- Keyboard navigation works for the primary flow.
- Light and dark themes work.
- Unit tests pass.
- End-to-end tests pass.
- Linting passes.
- Type checking passes.
- Production build passes.
- Documentation reflects the implementation.
- `CHANGELOG.md` is current.
- Known limitations are clearly listed.

A visually attractive but disconnected prototype is not done.

A functioning backend with a poor, confusing interface is not done.

A recap that is not deterministically validated is not done.

---

# 41. Working method inside VSCode

At the beginning of the session:

1. Read this entire file.
2. Inspect the repository.
3. Read `CLAUDE.md` if it exists.
4. Read `AGENTS.md` if it exists.
5. Read the files in `docs/`.
6. Review `CHANGELOG.md`.
7. Review Git status.
8. Identify the next logical milestone.

During work:

- Make cohesive changes.
- Avoid mixing unrelated refactors.
- Run relevant tests after each meaningful milestone.
- Show concise progress updates.
- Explain material architecture changes.
- Record decisions.
- Update documentation.
- Do not leave temporary debug code.
- Do not commit secrets.
- Do not claim tests passed unless you ran them.
- Do not claim deployment succeeded unless it was actually performed.

When editing:

- Prefer modifying existing coherent files over creating duplicates.
- Search the repository before adding a new abstraction.
- Preserve existing naming conventions where sensible.
- Remove dead code created by your own changes.
- Keep generated files out of source control where appropriate.

---

# 42. Git workflow

Use Git carefully.

Before substantial work:

- Check `git status`.
- Avoid overwriting uncommitted user changes.
- Review existing branches.

Create logical commits if the environment and user workflow support it.

Suggested commit groups:

- `docs: define PageCue product and architecture`
- `feat: scaffold PageCue application shell`
- `feat: add guest reading shelf`
- `feat: add synthetic story snapshots`
- `feat: add spoiler-safe recap pipeline`
- `feat: add book metadata search`
- `test: add spoiler-boundary validation coverage`
- `docs: update deployment and roadmap`

Do not force push.

Do not rewrite history without explicit instruction.

Do not commit `.env` files.

---

# 43. Final response requirements after a major build session

At the end of the work, provide a concise but complete report containing:

## Implementation summary

What was built or changed.

## File structure

The important new and changed files.

## Commands

Exact commands to:

- Install.
- Run locally.
- Lint.
- Type-check.
- Test.
- Run end-to-end tests.
- Build.
- Run Cloudflare locally.
- Apply migrations.
- Deploy.

## Environment variables

List required and optional variables.

Do not reveal secret values.

## Functional status

Clearly distinguish:

- Fully functional.
- Functional in mock mode.
- Requires credentials.
- Not yet implemented.
- Deferred.

## Test status

State exactly which checks were run and their outcomes.

## Known limitations

Be honest.

## Next recommended milestone

Recommend one clear next phase based on the roadmap.

---

# 44. Initial task

Begin now.

Your first actions must be:

1. Inspect the current repository.
2. Report the existing project state briefly.
3. Create or update the documentation foundation.
4. Create `CLAUDE.md` and `AGENTS.md`.
5. Establish the roadmap and decisions log.
6. Scaffold or improve the application foundation.
7. Implement the first functional vertical slice:
   - Open PageCue.
   - Enter guest mode.
   - View the synthetic demonstration book.
   - Set a supported reading boundary.
   - Generate a deterministic mock recap.
   - Display the recap with a clear spoiler boundary.
8. Add tests for that vertical slice.
9. Run linting, type checking, tests, and a production build.
10. Fix issues found.
11. Update `CHANGELOG.md`.

Do not stop after writing a plan.

Do not create only placeholder screens.

Do not attempt to support arbitrary commercial-book recaps.

Build the smallest complete, polished, safe version of the central PageCue experience first.
