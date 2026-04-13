# Work Plan: Home Page Layout & localStorage Checkbox Functionality

## Objective

1. Rearrange home page animals to be below the 5 circular colored buttons in a 3-row grid (max 4 per row)
2. Configure localStorage to save checkbox states on words-and-sentences page for PDF flow-through
3. Add tests to verify functionality

---

## Phase 1: Home Page Layout Changes

### Files Modified

- `src/app/pages/home/home.html`
- `src/app/pages/home/home.scss`

### Tasks

1. **Restructure DOM Order**
   - Move animal-selection-section to be a sibling below circle-section (currently it's side-by-side)
   - Ensure separator appears above unchecked animals section

2. **CSS Grid Layout for Animals**
   - Change `.animal-list` to use `grid-template-columns: repeat(4, 1fr)` for desktop
   - Add responsive media queries for tablets (3 columns) and mobile (2 columns)
   - Grid should allow animals to flow into 3 rows max

### Success Criteria

- Animals appear below the circular buttons (not to the side)
- 4 animals per row on desktop
- Responsive layout on smaller screens

---

## Phase 2: words-and-sentences localStorage Verification

### Files Modified

- `src/app/pages/sounds-speech/words-and-sentences.ts`
- `src/app/pages/sounds-speech/words-and-sentences.html`

### Current State Analysis

- Checkboxes are already saved to `tinyStepsAnimalCheckboxes` in localStorage
- PDF generation reads from this storage (`generatePDF()` method)
- Checkboxes should persist after page reload

### Tasks

1. **Verify Current Implementation**
   - Check `handleCheck()` method saves to localStorage correctly
   - Verify `isItemChecked()` reads from localStorage correctly
   - Ensure PDF generation includes checked items for ALL animals

2. **Fix Any Issues Found**
   - Ensure checkbox state persists across page reloads
   - Verify PDF includes checked items from localStorage

### Success Criteria

- Checkbox states persist after navigation away and back
- PDF includes checked items for the selected animal

---

## Phase 3: Test Coverage Addition

### Files Modified

- `src/app/e2e/home.spec.ts`
- Add new test file for words-and-sentences

### Tasks

1. **Home Page Tests** (add to existing `home.spec.ts`)
   - Test animal grouping (checked vs unchecked)
   - Test separator visibility between sections
   - Test responsive grid layout (4 columns on desktop)

2. **Words-and-Sentences Tests** (new file)
   - Test checkbox state persists in localStorage
   - Test PDF generation includes checked items
   - Test checkbox click updates localStorage

### Success Criteria

- All new tests pass
- Existing tests still pass after changes

---

## Execution Plan

### Step 1: Update home.html

- Move animal-selection-section to be a child of main-content (not sibling with circle-section)
- Ensure DOM order: circle-section first, then animal-selection-section

### Step 2: Update home.scss

- Adjust CSS to change from flex-row layout to stacked layout
- Add 3-row grid with max 4 items per row
- Update separator styling if needed

### Step 3: Verify words-and-sentences.ts

- Ensure localStorage usage is correct and persistent

### Step 4: Write Tests

- Add e2e tests for new layout
- Add tests for checkbox localStorage functionality

### Step 5: Run All Tests

- `ng test` - unit tests
- `ng e2e` - e2e tests

### Step 6: Manual Verification

- Open app, verify layout looks correct
- Check checkbox persistence across page reloads
- Generate PDF and verify checked items appear

---

## Success Criteria Summary

| Requirement                       | Verification Method                     |
| --------------------------------- | --------------------------------------- |
| Animals below buttons             | Visual inspection, DOM order            |
| 4 animals per row max             | CSS grid check, visual inspection       |
| Separator above unchecked         | Visual inspection, DOM order            |
| Checkbox persists in localStorage | Test with page reload, browser DevTools |
| PDF includes checked items        | Open generated PDF file                 |
| All tests pass                    | `ng test`, `ng e2e` output              |

---

## Notes

- Use Sisyphus (not Hephaestus) for implementation
- No assumptions - verify each change works before proceeding
- Report in ReportB14.md with details of changes and challenges
