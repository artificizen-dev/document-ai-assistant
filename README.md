# Document AI Assistant

Document AI Assistant is an advanced RAG application.

## Prerequisites

- Node.js (version 20 or above)
- npm

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/artificizen-dev/document-ai-assistant.git
   cd document-ai-assistant
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   we have a constants.ts file in /src/utils update the follow variable there:
   ```
   backendUrl=your_backend_url
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To create a production build:

```bash
npm run build
```

## Deployment

To deploy the application:

```bash
make deploy
```

## Project Structure

```
document-ai-assistant/
├── dist/               # Build output
├── node_modules/       # Dependencies
├── public/             # Static assets
├── src/                # Source code
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # React components
│   ├── data/           # Data files
│   ├── interfaces/     # TypeScript interfaces
│   ├── pages/          # Page components
│   ├── Providers/      # Context providers
│   ├── routes/         # Routing configuration
│   ├── utils/          # Utility functions
│   ├── App.css         # App styles
│   ├── App.tsx         # Main App component
│   ├── index.css       # Global styles
│   ├── main.tsx        # Entry point
│   └── vite-env.d.ts   # Vite type declarations
├── .gcloudignore       # Google Cloud ignore file
├── .gitignore          # Git ignore file
├── app.yaml            # App Engine configuration
├── eslint.config.js    # ESLint configuration
├── index.html          # HTML entry point
├── makefile            # Build scripts
├── package-lock.json   # Dependency versions
├── package.json        # Project metadata
├── README.md           # Project documentation
├── tsconfig.app.json   # TypeScript app config
├── tsconfig.json       # TypeScript base config
├── tsconfig.node.json  # TypeScript Node config
├── vercel.json         # Vercel configuration
└── vite.config.ts      # Vite configuration
```

## Technologies Used

- React.js with TypeScript
- Tailwind CSS
- Vite
