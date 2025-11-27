<div align="center">
  <img src="src/assets/images/Logo.png" alt="SMSHSEWA-TRUST Logo" width="120" height="120" />
  <h1>SMSHSEWA-TRUST Website</h1>
  <p>
    <b>A comprehensive platform for spiritual services, donations, and community engagement.</b>
  </p>
  
  [![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
  [![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
</div>

<br />

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Project Structure](#-project-structure)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

## 📖 Introduction

This project is a modern, responsive web application designed for **SMSHSEWA-TRUST**. It serves as a digital gateway for devotees and members to engage with the trust's activities. The platform facilitates online puja bookings, donations, membership management, and provides access to spiritual content like blogs and galleries.

Built with performance and user experience in mind, it leverages the power of React and Vite to deliver a seamless browsing experience.

## 🚀 Features

The application is packed with features catering to various user needs:

### 🔐 Authentication & User Management
- **Secure Login/Signup**: OTP-based and standard authentication flows.
- **Profile Management**: Users can manage their personal details and view their history.
- **Family Details**: Manage family member information for puja bookings.

### 🕉️ Spiritual Services
- **Puja Booking**: Browse and book various pujas online.
- **Prashad Ordering**: Order prashad for delivery.
- **Live Darshan**: (If applicable) View live feeds or scheduled darshan timings.

### 💰 Donations & Membership
- **Online Donations**: Secure gateway for making donations to various causes (Annadaan, Gau Seva, etc.).
- **Membership**: Sign up for membership and view membership history.
- **Donation History**: Track past donations and download receipts.

### 📚 Content & Engagement
- **Blogs**: Read articles and updates from the trust.
- **Gallery**: View photos and videos of events and deities.
- **Contact & Support**: Easy ways to reach out to the trust administration.

## 🛠 Tech Stack

- **Frontend Framework**: [React](https://reactjs.org/) (v18)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** or **pnpm**

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SMSHSEWA-TRUST/SMSHSEWA-TRUST-Latest-ADMIN.git
    cd website-1
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Project

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

A quick look at the top-level files and directories:

```
d:\website-1\

├── src/
│   ├── api/            # API integration modules
│   ├── assets/         # Static assets (images, icons)
│   ├── components/     # Reusable UI components
│   ├── data/           # Static data files
│   ├── layout/         # Layout components (Header, Footer)
│   ├── lib/            # Utility libraries and helpers
│   ├── pages/          # Page components (Route handlers)
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic services
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
├── public/             # Public static files
├── index.html          # HTML entry point
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Locally preview the production build.
- `npm run lint`: Runs the linter to check for code quality issues.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.