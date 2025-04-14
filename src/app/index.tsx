import './styles.css'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { Router } from './router'
import store from '@/store/redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
