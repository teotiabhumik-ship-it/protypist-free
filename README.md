# TypePulse ⚡

> **A Comprehensive Modern Typing Experience & Strict SSC CGL DEST (TCS iON) Exam Simulator.**

TypePulse is a dual-purpose typing application built with React, Vite, Tailwind CSS, TypeScript, and packaged into a standalone Windows desktop app via Electron.

---

## 🚀 Key Features

### 1. Modern Typing Experience (ProType Engine)
* **Real-time Engine:** Fluid caret animations with bounding-box coordinate tracking (`smooth`, `block`, and `underline` styles).
* **Multiple Game Modes:**
  * **Time Mode:** 15s, 30s, 60s, 120s endurance tests.
  * **Word Count Mode:** 10, 25, 50, 100, 250, and 500 words.
  * **Quote Mode:** Inspiring quotes from historical figures.
  * **Long Paragraph Mode:** Deep literary, scientific, philosophical, and tech passages (Carl Sagan's *Pale Blue Dot*, Arthur Conan Doyle's *Sherlock Holmes*, Mary Shelley's *Frankenstein*, and Marcus Aurelius' *Meditations*).
* **Structured Touch Typing Curriculum (14 Lessons across 7 Modules):**
  * Module 1: Home Row Foundation
  * Module 2: Top Row Reach
  * Module 3: Bottom Row Shift
  * Module 4: Shift & Capitalization
  * Module 5: Numbers & Code Symbols
  * Module 6: High-Frequency N-Grams & Suffixes
  * Module 7: Speed Mastery & Pangrams
* **Interactive Virtual Keyboard:** Theme-synchronized 60% layout with real-time active keypress illumination, next-target key glow, and shift guidance.
* **Analytics & Performance Tracking:**
  * Real-time Net WPM, Raw WPM, and Accuracy.
  * Interactive Recharts time-series velocity graph.
  * SVG keyboard error heatmap tracking frequent mistypes.
* **Centralized Theme Engine:** 5 color palettes with runtime CSS transitions:
  * 🌌 **Dark Magic**
  * ☀️ **Light Minimal**
  * 🤖 **Cyberpunk**
  * 📟 **Terminal Green**
  * 🧛 **Dracula**

---

### 2. SSC CGL DEST "Exam Mode" (TCS iON Simulation)
Faithfully replicates the real Indian Staff Selection Commission (SSC CGL Tier-II) Data Entry Speed Test environment:
* **TCS iON Interface:** Header with candidate roll number, system node ID (`LAB-02 | C-108`), category selector, and live 15:00 countdown timer with threshold alerts.
* **Strict Security Lockdown:**
  * Disabled right-click context menu.
  * Disabled clipboard operations (`Ctrl+C`, `Ctrl+V`, `Ctrl+X`).
  * Disabled text selection in master passage.
  * Live keystroke progress meter against the 2000-stroke target.
* **Official Error Evaluation Algorithm:**
  * **Full Mistakes (×1.0):** Omission of words, addition of extraneous words, word substitutions, and spelling errors.
  * **Half Mistakes (×0.5):** Spacing errors, capitalization errors, punctuation errors, and word transpositions.
  * **Mathematical Sequence Alignment:** Dynamic Programming Longest Common Subsequence (LCS) diffing eliminates cascade desynchronization.
  * **Category-wise Cutoffs:**
    * **UR:** Max 20.0% Error
    * **OBC / EWS:** Max 25.0% Error
    * **SC / ST / PwD:** Max 30.0% Error
  * Complete audit log table with penalty classification.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
* **Charts:** Recharts
* **Desktop Packaging:** Electron, electron-builder (Portable single-file Windows executable)
* **Algorithms:** Dynamic Programming Token-level LCS Diffing, Levenshtein Distance

---

## 💻 Getting Started

### Prerequisites
* Node.js (v18+)
* npm (v9+)

### Installation
```bash
# Clone the repository
git clone https://github.com/teotiabhumik-ship-it/TypePulse.git
cd TypePulse

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build web distribution
npm run build

# Run Electron desktop app in development
npm run electron:dev

# Package standalone portable .exe
npm run electron:build
```

---

## 📄 License

MIT License. Designed and engineered for typing enthusiasts and civil service aspirants.
