import logo from './logo.svg';
import './App.css';
import UploadView from './components/UploadView';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path='/' element={<UploadView />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/plagiarism_check' element={<UploadView />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
