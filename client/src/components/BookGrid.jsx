import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../api';
import BookCard from './BookCard';

function SkeletonCard() {
  return (
    <div className="book-card skeleton-card" aria-hidden="true">
      <div className="skeleton-cover shimmer" />
      <div className="book-card-body">
        <div className="skeleton-line short shimmer" />
        <div className="skeleton-line title shimmer" />
        <div className="skeleton-line medium shimmer" />
        <div className="skeleton-line footer shimmer" />
      </div>
    </div>
  );
}

function BookGrid({ genreId, search, sortBy }) {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const loadBooks = useCallback(async () => {
    setStatus('loading');
    setError('');
    const params = new URLSearchParams({ page: '1', limit: '100' });
    if (genreId) params.set('genreId', genreId);
    if (search.trim()) params.set('search', search.trim());

    try {
      const response = await apiFetch(`/books?${params.toString()}`);
      setBooks(Array.isArray(response) ? response : response.data || []);
      setStatus('success');
    } catch (requestError) {
      setError(requestError.message || 'We could not load the catalog.');
      setStatus('error');
    }
  }, [genreId, search]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const sortedBooks = [...books].sort((a, b) => {
    const first = (a[sortBy] || '').toLowerCase();
    const second = (b[sortBy] || '').toLowerCase();
    return first.localeCompare(second);
  });

  if (status === 'loading') {
    return (
      <div className="book-grid" aria-label="Loading books">
        {Array.from({ length: 8 }, (_, index) => <SkeletonCard key={index} />)}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <section className="state-panel error-panel">
        <span className="state-kicker">Connection interrupted</span>
        <h2>We could not reach the catalog.</h2>
        <p>{error}</p>
        <button className="primary-button" type="button" onClick={loadBooks}>Try again</button>
      </section>
    );
  }

  if (sortedBooks.length === 0) {
    return (
      <section className="state-panel empty-panel">
        <span className="state-kicker">A quiet shelf</span>
        <h2>No books match those filters.</h2>
        <p>Try a broader search or select every genre to see the full collection.</p>
      </section>
    );
  }

  return (
    <div className="book-grid">
      {sortedBooks.map((book) => <BookCard key={book.id} book={book} />)}
    </div>
  );
}

export default BookGrid;
