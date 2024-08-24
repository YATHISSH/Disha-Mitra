import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import Login from './components/Login/Login'; 
import Signup from './components/Signup/Signup';
import UserData from './components/UserData/UserData'; 
import UserProfile from './components/UserProfile/UserProfile';
import ChatHistory from './components/ChatHistory/ChatHistory';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/userdata" element={<UserData/>}/>
        <Route path="/userprofile" element={<UserProfile/>}/>
        <Route path="/chathistory" element={<ChatHistory/>}/>
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
