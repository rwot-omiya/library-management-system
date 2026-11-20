import { useCallback, useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import BookGrid from '../components/BookGrid';
import { apiFetch } from '../api';

function HomePage() {
  const [search, setSearch] = useState('');
  const [genreId, setGenreId] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [genres, setGenres] = useState([]);
  const [genresError, setGenresError] = useState('');

  const loadGenres = useCallback(async () => {
    try {
      const response = await apiFetch('/genres');
      setGenres(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      setGenresError(error.message || 'Genre filters are unavailable.');
    }
  }, []);

  useEffect(() => {
    loadGenres();
  }, [loadGenres]);

  return (
    <div>
      <section className="hero-section">
        <div>
          <p className="hero-kicker">THE NORTHSTAR COLLECTION</p>
          <h1>Find a story<br /><em>worth keeping.</em></h1>
          <p className="hero-copy">Search our shelves by title, author, or genre. Your next thoughtful read is closer than you think.</p>
        </div>
        <div className="hero-stamp" aria-label="Library collection note">
          <span>16</span>
          <small>curated<br />titles</small>
        </div>
      </section>

      <section className="catalog-toolbar" aria-label="Catalog filters">
        <SearchBar value={search} onSearch={setSearch} />
        <div className="filter-row">
          <label className="select-field">
            <span className="sr-only">Filter by genre</span>
            <select value={genreId} onChange={(event) => setGenreId(event.target.value)}>
              <option value="">All genres</option>
              {genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
            </select>
          </label>
          <label className="select-field sort-field">
            <span className="sr-only">Sort books</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="title">Sort: title</option>
              <option value="author">Sort: author</option>
            </select>
          </label>
        </div>
      </section>
      {genresError && <p className="inline-notice">{genresError}</p>}

      <section className="catalog-heading">
        <div>
          <p className="section-kicker">THE CATALOG</p>
          <h2>On the shelves</h2>
        </div>
        <span className="catalog-rule" />
      </section>
      <BookGrid genreId={genreId} search={search} sortBy={sortBy} />
    </div>
  );
}

export default HomePage;
