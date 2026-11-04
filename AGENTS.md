## Project-Specific Rules — HabitFlow

### Project Overview
HabitFlow is a minimalist habit-tracking mobile application built with React Native, Expo, Expo Router and TypeScript.

The main goal is to build a functional, maintainable application while keeping the code understandable for a developer who is learning mobile development.

### Language
- All user-facing text must be written in Spanish.
- Use English for variable names, function names, component names and code identifiers.
- Comments and technical documentation can be written in English or Spanish, but remain consistent within each file.

### Development Approach
- Prefer simple, readable and maintainable solutions.
- Avoid overengineering, unnecessary abstractions and premature optimization.
- Do not introduce complex architecture or additional libraries without a clear reason.
- Do not rewrite working code unless the task explicitly requires it.
- Make only the changes necessary to complete the requested task.
- Preserve existing functionality and visual consistency.
- Before modifying files, inspect the existing implementation and reuse what is already available.

### Learning-Friendly Code
- Prefer straightforward implementations over clever or overly compact code.
- Use TypeScript types and interfaces appropriately.
- Avoid using `any` unless absolutely necessary.
- Use descriptive variable and function names.
- Keep components reasonably small and reusable when there is a real need.
- Explain important architectural decisions and unfamiliar React Native concepts in the final summary.
- Do not create unnecessary files just to separate a small amount of code.

### UI and Design Guidelines
Follow HabitFlow's minimalist visual identity:

- Background: #FFFFFF
- Surface: #F3F7F3
- Primary: #77A98A
- Main text: #263B30
- Secondary text: #829187
- Rounded cards and subtle borders.
- Consistent spacing and typography.
- Clean layouts with generous whitespace.
- Avoid excessive gradients, shadows and decorative elements.

All screens must maintain a consistent design language.

### State Management and Data
- Use React state and Context for simple shared application state.
- Do not introduce Redux, Zustand or other state management libraries unless explicitly requested.
- Keep business logic separate from UI when it improves clarity.
- Avoid duplicating the same state across different screens.
- Do not add a backend unless explicitly requested.

### Dependencies
- Before installing a new dependency, check whether the functionality can be implemented with existing tools or Expo modules.
- Prefer Expo-compatible packages.
- Do not install dependencies without explaining why they are needed.
- Preserve compatibility with Expo Go whenever possible.
- If a feature requires a development build, explain this before implementing it.

### File Organization
- Routes and screens belong in `src/app/`.
- Reusable components belong in `src/components/`.
- Context providers and hooks belong outside `src/app/`.
- Shared types belong in `src/types/`.
- Constants and theme configuration belong in `src/constants/`.
- Database and persistence logic belong in `src/database/` or `src/services/`, depending on their responsibility.

Do not create these folders until they are actually needed.

### Validation
Before declaring a task complete:
- Run `npx expo lint`.
- Run `npx tsc --noEmit`.
- Fix errors introduced by the changes.
- Report any existing errors that could not be resolved.
- Explain how to test the feature in Expo Go.

### Git
- Do not create commits, push changes or modify Git remotes unless explicitly requested.
- Keep changes focused so they can be reviewed and committed independently.

Before writing any code that touches an Expo, EAS, or React Native API, consult the documentation matching the installed SDK version.