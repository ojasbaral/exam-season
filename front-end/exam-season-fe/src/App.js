import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Seasons from './pages/seasons'

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/seasons/:id" element={<Seasons />}></Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
