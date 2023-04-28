import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { MainPage } from './components/MainPage';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
        </Routes>
      </div>
    </Router>  
  );
}

export default App;
