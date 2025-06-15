import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Signup from './Components/SignUp';
import Login from './Components/Login';
import BarraBusqueda from './Components/BarraBusqueda';
import CartaEvento from './Components/CartaEvento';
import Navbar from './Components/navbar';
import Footer from './Components/Footer';
import Informacion from './Components/Informacion';
import ListaEventos from './Components/ListaEventos';
import Evento from './Components/Evento';
import EspecificacioDeCompra from './Components/EspecificacionDeCompra';
import CompraBoleta from './Components/CompraBoleta';
import PaginaPrincipal from './Components/PaginaPrincipal';
import PaginaInformacion from './Components/PaginaInformacion';
import PaginaLogin from './Components/PaginaLogin';
import PaginaSignUp from './Components/PaginaSignUp';
import GenerarReporte from './Components/GenerarReportes';
import PanelDeControl from './Components/PanelDeControl';
import AgregarCategoria from './Components/AgregarCategoria';
import Loader from './Components/Loader';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { List } from 'lucide-react';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<PaginaLogin />} />
          <Route path="/PaginaPrincipal" element={<PaginaPrincipal />} />
          <Route path="/paginaAdmin" element={<PanelDeControl />} />
          <Route path="/signup" element={<PaginaSignUp />} />
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/informacion" element={<PaginaInformacion />} />
          <Route path="/evento" element={<CompraBoleta />} />
          <Route path="/especificacionCompra" element={<EspecificacioDeCompra />} />
      </Routes>
    </BrowserRouter>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
