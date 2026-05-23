import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Optional: disable refetch on window focus
      retry: 1, // Optional: retry failed requests once
      staleTime: 5 * 60 * 1000, // Optional: data stays fresh for 5 minutes
    },
  },
});
const rootElement = document.getElementById('app')

if (!rootElement) {
  throw new Error('Root element #app was not found.')
}

ReactDOM.createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </QueryClientProvider>
)
