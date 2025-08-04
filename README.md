# Solar DG Platform

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). The project aims to replicate the core functionalities and UI of the Wattio platform, focusing on distributed solar energy management.

## Project Structure

The project is built with Next.js using the App Router and leverages shadcn/ui for its component library.

- `app/`: Contains the main application routes and pages.
  - `auth/`: Authentication related pages (e.g., login).
  - `consumer-units/`: Pages for managing consumer units.
  - `contracts/`: Pages for managing contracts.
  - `crm/`: Customer Relationship Management pages.
  - `dashboard/`: The main dashboard overview.
  - `energy-vault/`: Pages for energy data management, including upload and testing.
  - `financial/`: Financial overview and reporting.
  - `invoices/`: Invoice management.
  - `power-plants/`: Pages for managing power plants, including forms.
  - `reports/`: Various reports and analytics.
  - `settings/`: Application settings.
- `components/`: Reusable React components.
  - `layout/`: Layout components like `main-layout.tsx`, `sidebar.tsx`, `header.tsx`.
  - `power-plants/`: Components specific to power plant management.
  - `ui/`: Shadcn/ui components (accordion, alert, avatar, button, card, etc.).
- `hooks/`: Custom React hooks (e.g., `use-mobile.ts`, `use-toast.ts`).
- `lib/`: Utility functions and configurations (e.g., `utils.ts`, `supabase.ts`, `supabase-types.ts`).
- `scripts/`: SQL scripts for database schema creation and data seeding.
- `public/`: Static assets like images.
- `styles/`: Global CSS.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `next.config.mjs`: Next.js configuration.
- `package.json`: Project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration.

## Features

- **Dashboard**: Overview of active power plants, total production, generated savings, recent alerts, and quick actions.
- **Energy Vault**: Manage energy data, including upload and testing functionalities.
- **Financials**: Track financial performance.
- **Invoices**: Manage and view invoices.
- **Reports**: Generate various reports.
- **Settings**: Configure application settings.
- **Consumer Units**: Manage individual consumer units.
- **Contracts**: Handle contract details.
- **CRM**: Customer relationship management.
- **Authentication**: Login page.
- **Responsive Design**: Adapts to different screen sizes.
- **Theming**: Configurable theme using CSS variables.
- **Database Integration**: Placeholder for Supabase integration with SQL scripts for schema management.

## Getting Started

### Local Development

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deploy to Vercel

This project is configured for easy deployment on Vercel:

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Connect to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js
3. **Environment Variables** (Optional):
   - Add `NEXT_PUBLIC_DEMO_MODE=true` for demo mode
   - Add Supabase credentials if you want to connect to a database
4. **Deploy**: Click deploy and your app will be live!

**Demo Mode**: The app works with mock data by default. Set `NEXT_PUBLIC_DEMO_MODE=true` to ensure it runs without database connection.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

To run this project locally, follow these steps:

1.  **Clone the repository:**
    \`\`\`bash
    git clone [repository-url]
    cd wattio-clone-project
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    \`\`\`

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your environment variables. For Supabase integration, you would typically add:
    \`\`\`
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    \`\`\`
    (Note: The current project uses mock data and does not fully implement Supabase integration, but the structure is in place.)

4.  **Run database scripts (Optional, for Supabase integration):**
    If you are setting up a Supabase database, you can use the provided SQL scripts.
    For example, to create the initial schema:
    \`\`\`bash
    # You would typically run these via a Supabase CLI or dashboard
    # Example: psql -h [your-db-host] -U postgres -f scripts/create-complete-database-schema.sql
    \`\`\`

## Customization

-   **Theming**: Adjust the CSS variables in `app/globals.css` and `tailwind.config.ts` to customize the application's theme.
-   **Components**: Modify existing shadcn/ui components or create new ones in the `components/ui` directory.
-   **Layout**: Adjust `components/layout/main-layout.tsx`, `components/layout/sidebar.tsx`, and `components/layout/header.tsx` to change the overall application layout.
-   **Data**: The project currently uses mock data. You can integrate with a backend (e.g., Supabase) by modifying the data fetching logic in the respective pages and components.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
