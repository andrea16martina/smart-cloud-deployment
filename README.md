# ☁️ Smart Cloud Deployment UI

**Interactive drag-and-drop interface for designing cloud-edge service workflows.**  
Built with React and [React Flow Renderer](https://reactflow.dev/), this project enables users to visually organize and deploy composite services using a graph-based model.

---

## 🚀 Overview

This project provides a graphical user interface to create and manage service workflows.  
Users can drag and drop services into a canvas, connect them to define data flow, and set logic through conditional switch nodes.

All functionalities are accessible via a sidebar panel, while the central canvas area offers a dynamic and interactive experience.

> 🧩 Designed as part of my university internship, this tool demonstrates a visual approach to service orchestration across cloud and edge environments.

---

## ✨ Features

- 🧱 **Drag & Drop Workflow Creation** — intuitive UI for composing services
- 🔁 **Conditional Nodes** — define logic with switch-type decision flows
- ⚙️ **Custom Node Details** — user-editable metadata per node
- 🎛️ **Sidebar Configuration Panel** — manage and edit node properties
- 🖥️ **Interactive Canvas** — rearrange and link services visually

---

## 📁 Project Structure

```plaintext
smart-cloud-deployment/
├── public/               # Static assets
├── src/                  # Main React source code
│   ├── components/       # UI components and custom nodes
│   ├── hooks/            # Custom React hooks
│   └── App.jsx           # Main app entry
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 🛠️ Tech Stack

- ⚛️ **React** — frontend library for building dynamic interfaces  
- 🌊 **React Flow Renderer** — for graph-based UI and node manipulation  
- 📦 **JavaScript (ES6+)** — modern scripting for component logic  
- 🎨 **CSS Modules / Tailwind** *(if used)* — styling solutions  
- 🔧 **Vite / Webpack** *(depending on setup)* — module bundlers for development

---

## 🔧 Setup

```bash
# Clone the repository
git clone https://github.com/andrea16martina/smart-cloud-deployment.git
cd smart-cloud-deployment

# Install dependencies
npm install

# Start the development server
npm start
# → App available at http://localhost:3000

# Build for production
npm run build
```
> ⚠️ Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed globally on your system.

---



