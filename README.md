# KAKILIMA TOPUP

A modern Next.js application with TypeScript, Tailwind CSS, Redux Toolkit, and React Hot Toast.

## Features

- ⚡ **Next.js 14** with App Router
- 🎨 **Tailwind CSS** for styling
- 🔄 **Redux Toolkit** for state management
- 🔔 **React Hot Toast** for notifications
- 📱 **TypeScript** for type safety
- 🚀 **ESLint** for code quality

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd kakilima-topup
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout with providers
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # Reusable components
│   ├── providers.tsx   # Redux Provider + Toaster
│   └── counter.tsx     # Example component
└── lib/               # Utility functions
    ├── store.ts       # Redux store configuration
    └── hooks.ts       # Custom Redux hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Redux Setup

The project includes a configured Redux store with TypeScript support:

- Store configuration in `src/lib/store.ts`
- Custom hooks in `src/lib/hooks.ts`
- Provider wrapper in `src/components/providers.tsx`

### Usage Example

```typescript
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

function MyComponent() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.someSlice.data);
  
  // Use dispatch and state as needed
}
```

## Toast Notifications

React Hot Toast is configured with custom styling and positioned at the top-right:

```typescript
import toast from 'react-hot-toast';

// Success toast
toast.success('Operation completed!');

// Error toast
toast.error('Something went wrong!');

// Custom toast
toast('Custom message', {
  icon: '🔄',
  duration: 5000,
});
```

## Styling

The project uses Tailwind CSS for styling. You can customize the design system in `tailwind.config.ts`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Hot Toast Documentation](https://react-hot-toast.com/)

## License

This project is licensed under the MIT License.
