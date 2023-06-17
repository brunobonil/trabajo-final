import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import './App.css';
import MainPage from './components/MainPage';
import Carrito from './components/Carrito';
import PaginaPago from './components/PaginaPago';
import ResumenCompra from './components/ResumenCompra'
import 'bootstrap/dist/css/bootstrap.min.css';
import Backoffice from './components/Backoffice';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/:idSuper" element={<MainPage/>}/>
          <Route path="/:idSuper/carrito/:id" element={<Carrito/>}/>
          <Route path="/:idSuper/carrito/:id/pagar/" element={<PaginaPago/>}/>
          <Route path="/:idSuper/carrito/:id/resumen/" element={<ResumenCompra/>}/>
          <Route path=":idSuper/backoffice/" element={<Backoffice/>}/>
        </Routes>
      </div>
    </Router>  
  );
}

export default App;
