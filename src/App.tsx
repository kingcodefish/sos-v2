import { useState } from 'react';
import { ThemeProvider } from './ThemeProvider';
import Lesson from './pages/Lesson';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Routes, Route } from "react-router";

type Page = 'dashboard' | 'lesson';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="lesson" element={<Lesson />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;