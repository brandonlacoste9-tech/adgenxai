// App.tsx
// Main BeeSwarm application component

import { useState } from 'react';
import StudioHome from './pages/StudioHome';

export default function App() {
  return (
    <div className="min-h-screen bg-hiveDark">
      <StudioHome />
    </div>
  );
}
