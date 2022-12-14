import { RouterProvider } from 'react-router-dom';
import { createRoutesFromElements } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout';
import Cart from './pages/Cart';
import Home from "./pages/Home";
import Login from './pages/Login';

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="/" element={<Layout/>}>
    <Route index element={<Home />} />
    <Route path="/cart" index element= {<Cart />} />
    <Route path="/login" index element={<Login />} />
  </Route>)
);

function App() {
  

  return (
    <RouterProvider router={router}/>
  )
}

export default App;