# 🚀 Github Profile Analyzer Project

Welcome to this project! This guide will help you set everything up and run it on your computer.

## 📦 Tech Stack

This project uses the following technologies:

- **React** – Frontend library
- **TypeScript** – Strongly typed JavaScript
- **Vite** – Fast development server and build tool
- **Tailwind CSS** – Utility-first CSS framework
- **Shadcn UI** - UI Library.

## 🛠️ Requirements

Before running the project, make sure you have:

- **Node.js** (v18 or above)  
  👉 [Download it from nodejs.org](https://nodejs.org)

When you install Node.js, `npm` (Node Package Manager) also gets installed automatically.

Sure! Here's the updated **📁 How to Run the Project Locally** section with HTTPS-based forking and setup steps:

## 📁 How to Run the Project Locally

Follow these step-by-step instructions to fork and run the project:

### 1) Fork the Repository

Click the **Fork** button in the top-right corner to create your own copy.

### 2) Clone Your Fork

Click the green **Code** button on your forked repo, copy the **HTTPS** URL under the **Local** tab, then run in your terminal:

```bash
git clone https://github.com/your-username/github-profile-analyzer.git
cd github-profile-analyzer
```

### 3) Install Dependencies

```bash
npm install
```

This installs everything the project needs (including React, Vite, Tailwind, etc.).

### 4) Start the Local Server

```bash
npm run dev
```

This starts start the local server

## 🧠 Additional Notes
This project includes Tailwind CSS and is already pre-configured.

You don’t need to install Tailwind manually — it’s included in the dependencies.

## ❓ Troubleshooting Tips

### Node.js Versions:
If you encounter errors, please verify that you are running Node.js v18 or above by checking:

```bash
node -v
npm -v
```

### Dependency Issues:
If there are problems during installation, try deleting the node_modules folder and package-lock.json file, then run npm install again:

```bash
rm -rf node_modules package-lock.json
npm install
```

