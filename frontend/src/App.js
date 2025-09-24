
import React from 'react';
import PingClient from './components/PingClient';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>gRPC Full-Stack Demo</h1>
        <p>PHP 7.3 Backend ↔ React Frontend</p>
      </header>
      <main>
        <PingClient />
      </main>
      <footer style={{
        marginTop: '40px',
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        borderTop: '1px solid #eee'
      }}>
        <p>Built with PHP 7.3, Spiral gRPC, React, and Docker</p>
      </footer>
    </div>
  );
}

export default App;