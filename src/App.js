import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StocksOverview from './pages/StocksOverview';
import StockDetail from './pages/StockDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StocksOverview />} />
        <Route path="/stocks/:ticker" element={<StockDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
