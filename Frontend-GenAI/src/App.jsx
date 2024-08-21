import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import Login from './Login/Login'; // Updated path
import Signup from './Signup/Signup'; // Assuming a similar path for Signup

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes (Sidebar only visible here) */}
        <Route
          path="/chatbot"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                <Main />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
