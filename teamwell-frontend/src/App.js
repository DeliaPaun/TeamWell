import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';   
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import QuestionnaireList from './pages/QuestionnaireList';
import Questionnaire from './pages/Questionnaire';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/protectedRoute';
import Logout from './pages/Logout';
import PerformanceForm   from './pages/PerformanceForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1) Landing la / */}
        <Route path="/" element={<LandingPage />} />

        {/* 2) Rute publice */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 3) Rute protejate */}
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
              <PerformanceForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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

        {/* 4) Orice altceva → la landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
