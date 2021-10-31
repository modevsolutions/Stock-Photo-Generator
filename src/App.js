import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import Photo from './Photo';
const clientId = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;

const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const targeted = useRef(false);
  const [newImages, setNewImages] = useState(false);

  const fetchPhotos = async () => {
    try {
      setLoading(true);

      let url;
      const urlPage = `&page=${page}`;
      const queryUrl = `&query=${query}`;

      if (query) {
        url = `${searchUrl}${clientId}${urlPage}${queryUrl}`;
      } else {
        url = `${mainUrl}${clientId}${urlPage}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setPhoto((oldData) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...oldData, ...data.results];
        } else {
          return [...oldData, ...data];
        }
      });
      setNewImages(false);
      setLoading(false);
    } catch (error) {
      setNewImages(false);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!targeted.current) {
      targeted.current = true;
      return;
    }
    if (!newImages) return;
    if (loading) return;
    setPage((oldImages) => {
      return oldImages + 1;
    });
  }, [newImages]);

  const event = () => {
    if (
      window.scrollY + window.innerHeight >=
      window.document.body.scrollHeight - 2
    ) {
      setNewImages(true);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', event);
    return () => {
      window.removeEventListener('scroll', event);
    };
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    if (page === 1) {
      fetchPhotos();
      return;
    }
    setPage(1);
  };
  return (
    <main>
      <section className='search'>
        <form
          className='search-form'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        >
          <input type='text' placeholder='search' className='form-input' />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className='photos'>
        <div className='photos-center'>
          {photo.map((item, index) => {
            return <Photo key={index} {...item} />;
          })}
        </div>
      </section>
      <h2 className='loading'>{loading && 'Loading...'}</h2>
    </main>
  );
}

export default App;
