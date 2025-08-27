import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainCont from './maincont.jsx';
import Sidebar from './sidebar.jsx';
import Dashboard from './dashboard.jsx';
import SuperOver from './Superover.jsx';
import { GameStatsProvider } from './GameStatsContext';
import ErrorBoundary from './ErrorBoundary';
import './App.css';
import Superover from './Superover.jsx';

function App() {
  return (
    <GameStatsProvider>
      <ErrorBoundary>
        <Router>
          <div className="app">
            <div className="container-fluid min-vh-100 p-0 m-0">
              <div className="row m-0">
                <Sidebar />
                <div className="main col-12 col-sm-12 col-md-10 p-0">
                  <Routes>
                    <Route path="/" element={<MainCont />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/super-over" element={<Superover />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </Router>
      </ErrorBoundary>
    </GameStatsProvider>
  );
}

export default App;