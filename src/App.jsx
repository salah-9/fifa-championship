import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChampionshipProvider } from './context/ChampionshipContext';
import Navbar from './components/Navbar';
import Cadastro from './pages/Cadastro';
import Sorteio from './pages/Sorteio';
import Chaveamento from './pages/Chaveamento';

export default function App() {
  return (
    <ChampionshipProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans">
          <Navbar />
          
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              {/* Redirecionamento Padrão */}
              <Route path="/" element={<Navigate to="/cadastro" replace />} />
              
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/sorteio" element={<Sorteio />} />
              <Route path="/chaveamento" element={<Chaveamento />} />
              
              {/* Fallback caso a rota não exista */}
              <Route path="*" element={<Navigate to="/cadastro" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ChampionshipProvider>
  );
}