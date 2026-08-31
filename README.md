# 🎨 Image Editor

A modern, responsive browser-based image editor built with **React, TypeScript, Fabric.js, and Tailwind CSS**.

The project provides a lightweight editing experience directly in the browser, allowing users to upload images, add shapes and text, apply image filters, manage objects, undo/redo changes, and export their final work as a PNG image.

🔗 **Live Demo:** https://image-editor-ivory-eta.vercel.app

## Preview
![Editor Screenshot](./screenshots/Screenshot-1.png)


---

## ✨ Features

### 🖼️ Image Editing

* Upload images from your device
* Add images using a URL
* Apply image filters
* Adjust brightness
* Adjust contrast
* Adjust saturation
* Apply blur
* Toggle additional image effects
* Reset image filters
* Change image shape using clipping paths

### 🔷 Shapes

Add and customize different shapes directly on the canvas:

* Square
* Circle
* Triangle
* Ellipse
* Line
* Star

Shapes support customization such as:

* Fill color
* Stroke color
* Stroke width
* Opacity
* Position and transformation

### ✏️ Text

* Add text
* Add text boxes
* Change font family
* Change font size
* Change font weight
* Italic text
* Text alignment
* Customize text appearance

### 🎛️ Object Controls

Selected objects can be:

* Duplicated
* Deleted
* Moved forward
* Moved backward
* Brought to front
* Sent to back
* Aligned left
* Aligned center
* Aligned right
* Aligned top
* Aligned middle
* Aligned bottom
* Flipped horizontally
* Flipped vertically
* Grouped
* Ungrouped

### ↩️ History

The editor includes an undo/redo system with canvas state history.

* Undo changes
* Redo changes
* Persist canvas state in `localStorage`
* Restore the previous canvas after refreshing the page

### ⌨️ Keyboard Shortcuts

Common editing actions can also be performed using keyboard shortcuts, including actions such as:

* Delete
* Undo
* Redo
* Copy
* Paste
* Duplicate
* Group
* Ungroup

### 🎨 Canvas

* Custom canvas background color
* Clear canvas
* Responsive canvas sizing
* PNG export
* High-quality canvas rendering

### 📱 Responsive UI

The editor is designed to work across different screen sizes.

On smaller screens, the properties panel changes into a mobile-friendly bottom sheet interface to make editing easier on touch devices.

---

## 🛠️ Tech Stack

| Technology           | Purpose                                  |
| -------------------- | ---------------------------------------- |
| **React**            | UI and component architecture            |
| **TypeScript**       | Static typing and safer development      |
| **Fabric.js**        | Canvas rendering and object manipulation |
| **Tailwind CSS**     | Styling and responsive UI                |
| **Vite**             | Development server and build tooling     |
| **Lucide React**     | Interface icons                          |
| **Vercel**           | Deployment                               |
| **Vercel Analytics** | Basic usage analytics                    |
| **oxlint**           | Code linting                             |

---

## 🏗️ Project Architecture

The project separates UI components, editor logic, reusable hooks, and utility functions.

```text
src/
├── components/
│   ├── CanvasEditor.tsx
│   ├── Header.tsx
│   ├── PropertiesPanel.tsx
│   └── Toolbar.tsx
│
├── hooks/
│   ├── useCanvasHistory.ts
│   ├── useCanvasSelection.ts
│   ├── useImageTools.ts
│   ├── useKeyboardShortcuts.ts
│   ├── useObjectActions.ts
│   ├── useResponsiveCanvas.ts
│   └── useShapeTools.ts
│
├── lib/
│   ├── canvas-constants.ts
│   ├── image-clip-paths.ts
│   └── image-filters.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

### Architecture Overview

```text
                ┌──────────────────┐
                │       UI         │
                │ Toolbar / Header │
                │ Properties Panel │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │  CanvasEditor    │
                │  Orchestration   │
                └────────┬─────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌───────────┐  ┌───────────┐  ┌───────────┐
    │   Hooks   │  │    Lib    │  │  Fabric   │
    │           │  │           │  │    JS     │
    └───────────┘  └───────────┘  └───────────┘
```

The editor logic is divided into focused hooks instead of keeping all canvas operations inside a single component.

For example:

* `useShapeTools` handles shape creation
* `useImageTools` handles image-related operations
* `useObjectActions` handles object manipulation
* `useCanvasHistory` manages undo/redo and persistence
* `useCanvasSelection` manages the currently selected object
* `useKeyboardShortcuts` handles keyboard interactions
* `useResponsiveCanvas` manages responsive canvas sizing

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Javadbn88/Image-Editor.git
```

### 2. Navigate to the project

```bash
cd Image-Editor
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at the local development URL provided by Vite.

---

## 📦 Available Scripts

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Production Build

```bash
npm run build
```

Runs TypeScript compilation and creates a production build.

### Lint

```bash
npm run lint
```

Runs the project's linting checks.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for previewing.

---

## 💾 Local Persistence

The editor stores the current canvas state in the browser's `localStorage`.

This allows the editor to restore the previous editing session after a page refresh.

The canvas state is serialized using Fabric.js and stored as JSON.

```text
Canvas
   ↓
Fabric.js JSON
   ↓
localStorage
   ↓
Page Refresh
   ↓
Canvas Restoration
```

---

## ↩️ Undo / Redo System

The editor maintains a history stack of canvas states.

When an editable action is committed:

```text
User Action
     ↓
Canvas State
     ↓
Serialize to JSON
     ↓
History Stack
```

Undo and redo operations restore previous serialized canvas states.

A history limit is used to prevent the history stack from growing indefinitely.

---

## 🧠 Technical Challenges

Building a browser-based image editor introduces several challenges compared with a typical React application.

### Canvas State Management

Fabric.js maintains its own internal canvas state, while React manages the application UI.

The project separates these responsibilities and uses React hooks to coordinate between the UI and Fabric.js.

### Undo / Redo

Undo and redo require complete canvas snapshots rather than simply changing React state.

The editor therefore serializes Fabric.js canvas state and maintains a history stack.

### Object Selection

Different Fabric.js object types require different controls.

For example:

```text
Image
Text
Shape
Line
Group
ActiveSelection
```

The properties panel adapts its available controls based on the selected object's type.

### Responsive Canvas

The canvas has a fixed logical editing area while its displayed dimensions can adapt to the available screen size.

This allows the editor to remain usable on both desktop and mobile screens.

---

## 🎯 Design Goals

The main goals of the project are:

* Keep the editing experience simple
* Provide useful image-editing functionality without a backend
* Maintain a clean component architecture
* Separate canvas logic from UI logic
* Support desktop and mobile layouts
* Keep the application lightweight
* Provide a foundation for future editing features

---

## 🔮 Future Improvements

Potential improvements for future versions include:

* [ ] Layer management panel
* [ ] Crop tool
* [ ] Image rotation controls
* [ ] Canvas zoom controls
* [ ] Image resizing
* [ ] JPEG export
* [ ] WebP export
* [ ] Export quality controls
* [ ] Transparent background export
* [ ] More advanced text controls
* [ ] More image filters
* [ ] Improved accessibility
* [ ] Automated unit and component tests
* [ ] GitHub Actions CI pipeline

---

## 📁 Repository

**GitHub:**
https://github.com/Javadbn88/Image-Editor

**Live Demo:**
https://image-editor-ivory-eta.vercel.app

---

## 📄 License

This project is currently available for personal and educational use.

If you plan to reuse or distribute the project, please check the repository for the latest licensing information.

---

## 👨‍💻 Author

Built by **Javad**

If you find the project interesting, feel free to ⭐ the repository or share your feedback.
