import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookDetail from './pages/BookDetail';

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="Library catalog home">
            <span className="brand-mark">L</span>
            <span>Northstar Library</span>
          </Link>
          <span className="header-note">A calmer way to find your next read</span>
        </div>
      </header>
      <main className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </main>
      <footer className="site-footer">Browse thoughtfully · Read widely · Return often</footer>
    </div>
  );
}

export default App;
