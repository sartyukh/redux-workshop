import './styles.css'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { Router } from './router'
import store from '@/store/redux'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Provider>
  )
}

export default App
