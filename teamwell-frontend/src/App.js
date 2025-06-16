import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';   
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import QuestionnaireList from './pages/QuestionnaireList';
import Questionnaire from './pages/Questionnaire';
//import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/protectedRoute';
import Logout from './pages/Logout';
import DailyReport from './pages/DailyReport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/questionnaires"
          element={
            <ProtectedRoute>
              <QuestionnaireList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questionnaires/:id"
          element={
            <ProtectedRoute>
              <Questionnaire />
            </ProtectedRoute>
          }
        />
          <Route
          path="/activities"
          element={
            <ProtectedRoute>
              <DailyReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <Logout />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
