import { Link } from 'react-router-dom';

function BookCard({ book }) {
  return (
    <article className="book-card">
      <div className="book-cover" aria-hidden="true">
        <span>{book.title.slice(0, 1).toUpperCase()}</span>
      </div>
      <div className="book-card-body">
        <div className="eyebrow">{book.genre?.name || 'Uncategorized'}</div>
        <h3>{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <div className="book-card-footer">
          <span className={book.available ? 'status available' : 'status unavailable'}>
            {book.available ? `${book.totalCopies} copies` : 'Currently unavailable'}
          </span>
          <Link className="text-link" to={`/books/${book.id}`}>
            View book <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default BookCard;
