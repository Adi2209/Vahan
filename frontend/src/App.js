// App.js
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import EntitiesList from './components/EntitiesList'; // Import the EntitiesList component

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* <Sidebar /> */}
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" exact component={EntitiesList} /> {/* Use the EntitiesList component */}
            {/* Define more routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
