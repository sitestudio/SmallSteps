# TinySteps

This project was generated using [Angular CLI](https://github.com/angular/cli) version 21.2.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
npm run test:e2e
```

For headless testing (CI/CD):

```bash
npm run test:e2e:headless
```

For UI mode:

```bash
npm run test:e2e:ui
```

## Features

- **Multi-language support** for early childhood education assessment
- **Animal selection system** with localStorage persistence for tracking progress
- **Dark/light mode toggle** accessible from any page via floating theme button in upper right corner
- **Print/PDF generation** for assessment checklists using jsPDF
- **Training mode** toggle for specialized learning activities

## Theme System

The application uses a centralized `ThemeService` for consistent theme management:

- Toggle button appears in upper-right corner of every page
- Theme preference persists to localStorage (`themePreference`)
- Automatically detects system theme on first load
- CSS variables define light/dark color schemes in `src/styles.scss`

## Additional Resources

For more information on using the Angular CLI, visit:
https://angular.dev/tools/cli
