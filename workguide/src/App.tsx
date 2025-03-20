import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App flex h-screen">
      {/* Left Side - Background Image */}
      <div className="hidden md:flex bg-image">
      <div className="center-image" >
      <h1>Welcome to AirPhoton WorkGuide</h1>
      <div className="sub-heading">
                  AirPhoton WorkGuide is a smart content management system <br />
                   designed to streamline
                   work instructions, enhance documentation <br />
                  accuracy, and improve efficiency.
                </div>
      </div>
      </div>

    </div>
  );
}

export default App;
