import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../api';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    apiFetch(`/books/${id}`)
      .then((response) => {
        if (!active) return;
        setBook(response);
        setStatus('success');
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.message || 'We could not load this book.');
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (status === 'loading') {
    return <div className="detail-state"><div className="detail-skeleton shimmer" /></div>;
  }

  if (status === 'error') {
    return (
      <section className="state-panel error-panel detail-state">
        <span className="state-kicker">Book unavailable</span>
        <h2>We could not find that title.</h2>
        <p>{error}</p>
        <Link className="primary-button" to="/">Return to catalog</Link>
      </section>
    );
  }

  return (
    <article className="detail-page">
      <Link className="back-link" to="/">← Back to catalog</Link>
      <div className="detail-layout">
        <div className="detail-cover" aria-hidden="true"><span>{book.title.slice(0, 1).toUpperCase()}</span></div>
        <div className="detail-copy">
          <p className="hero-kicker">{book.genre?.name || 'THE COLLECTION'}</p>
          <h1>{book.title}</h1>
          <p className="detail-author">by {book.author}</p>
          <p className="detail-description">A carefully cataloged edition from the Northstar Library shelves. Explore this title, note its place in the collection, and keep following the thread to your next read.</p>
          <dl className="book-facts">
            <div><dt>ISBN</dt><dd>{book.isbn}</dd></div>
            <div><dt>Availability</dt><dd>{book.available ? `${book.totalCopies} copies available` : 'Currently unavailable'}</dd></div>
            {book.publishedAt && <div><dt>Published</dt><dd>{new Date(book.publishedAt).getFullYear()}</dd></div>}
          </dl>
        </div>
      </div>
    </article>
  );
}

export default BookDetail;
