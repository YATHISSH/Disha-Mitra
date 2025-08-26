import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
// import UserData from "./components/UserData/UserData";
import UserProfile from "./components/UserProfile/UserProfile";
import ChatHistory from "./components/ChatHistory/ChatHistory";
import AdminPortal from "./components/Admin/Admin";
import CallInterface from "./components/ColdCall/ColdCall";

import PanoramaViewer from "./components/PanoramaViewer";
import ScenePage from "./components/ScenePage";

// New Enterprise Components
import DocumentLibrary from "./components/Sidebar/DocumentLibrary";
import AnalyticsHub from "./components/Sidebar/AnalyticsHub";
import TeamWorkspace from "./components/Sidebar/TeamWorkspace";
import KnowledgeBase from "./components/Sidebar/KnowledgeBase";
import IntegrationHub from "./components/Sidebar/IntegrationHub";
import SecurityCenter from "./components/Sidebar/SecurityCenter";
import APIManagement from "./components/Sidebar/APIManagement";
import UserManagement from "./components/Sidebar/UserManagement";
import SystemSettings from "./components/Sidebar/Settings"; // Renamed from Settings
import AuditLogs from "./components/Sidebar/AuditLogs";

// import Assessment from "./Assesment";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/userdata" element={<UserData />} /> */}
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/chathistory" element={<ChatHistory />} />
        <Route path="/admin-portal" element={<AdminPortal />} />
        <Route path="/cold-call" element={<CallInterface />} />
      
        
        {/* Legacy AR Routes - keeping for backward compatibility */}
        <Route path="/AR-view" element={<PanoramaViewer />} />
        <Route path="/AR-view/:sceneId" element={<ScenePage />} />
        {/* <Route path="/assesment" element={<Assessment />} /> */}

        {/* Main Chatbot Route with Sidebar */}
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

        {/* Enterprise Feature Routes with Sidebar */}
        <Route
          path="/document-library"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                <DocumentLibrary />
              </div>
            </div>
          }
        />

        <Route
          path="/analytics"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                <AnalyticsHub />
              </div>
            </div>
          }
        />

        <Route
          path="/team-workspace"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                <TeamWorkspace />
              </div>
            </div>
          }
        />

        <Route
          path="/knowledge-base"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                <KnowledgeBase />
              </div>
            </div>
          }
        />

        <Route
          path="/integrations"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                <IntegrationHub />
              </div>
            </div>
          }
        />

        <Route
          path="/security"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                <SecurityCenter />
              </div>
            </div>
          }
        />

        <Route
          path="/api-management"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                <APIManagement />
              </div>
            </div>
          }
        />

        <Route
          path="/user-management"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                <UserManagement />
              </div>
            </div>
          }
        />

        <Route
          path="/settings"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                <SystemSettings />
              </div>
            </div>
          }
        />

        <Route
          path="/audit-logs"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                <AuditLogs />
              </div>
            </div>
          }
        />

        {/* Backward compatibility routes for existing components with sidebar */}
        <Route
          path="/elite-colleges"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-y-auto">
                <DocumentLibrary /> {/* Redirect to Document Library */}
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
