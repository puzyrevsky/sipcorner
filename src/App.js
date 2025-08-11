import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import Home from './pages/Home/Home';
import LoginPage from './pages/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AdminPage from './pages/AdminPage/AdminPage';


function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/admin' element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
