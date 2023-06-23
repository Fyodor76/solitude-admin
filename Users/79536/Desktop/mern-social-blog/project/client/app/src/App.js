import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/login';
import { HomePage } from './pages/home';
import { ProfilePage } from './pages/profile';
import { useSelector } from 'react-redux';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { themeSettings } from './theme';

function App() {
  const mode = useSelector((state) => state.mode);
  const isAuth = Boolean(useSelector((state) => state.token));
  const navigate = useNavigate();
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  useEffect(() => {
    if (!isAuth) {
      navigate('/');
    } else {
      navigate('/home');
    }
  }, [isAuth]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Routes>
          <Route path="/" element={isAuth ?  <Navigate to="/home" /> : <LoginPage/>  }/>
          <Route path="/home" element={<HomePage/> }/>
          <Route path="/profile/:userId" element={<ProfilePage/> }/>
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
