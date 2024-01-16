import React from 'react';
import './App.css';
import { DocenteProvider } from './context/DocenteContext';
import DocentesModule from './components/docentes/DocentesModule.jsx';

function App() {
  return (
    <DocenteProvider>
      <div className="App">
        <DocentesModule />
      </div>
    </DocenteProvider>
  );
}

export default App;"// Integraci¢n del m¢dulo de docentes con contexto" 
