import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import './App.css';
import { MainPage } from './components/MainPage';
import Carrito from './components/Carrito';
import 'bootstrap/dist/css/bootstrap.min.css';
import BarcodeScanner from './components/BarcodeScanner';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/carrito/:id" element={<Carrito/>}/>
          <Route path="/scanner" element={<BarcodeScanner/>}/>
        </Routes>
      </div>
    </Router>  
  );
}

export default App;
