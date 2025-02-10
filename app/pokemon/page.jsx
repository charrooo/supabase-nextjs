'use client';

import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const PokemonReviewApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pokemonData, setPokemonData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(false);

  // Fetch Pokémon list from an external API (Pokémon API)
  const fetchPokemon = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
      const data = await response.json();
      setPokemonData(data.results);
    } catch (err) {
      console.error('Error fetching Pokémon:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews for Pokémon from Supabase
  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('pokemon_reviews')
        .select('*');

      if (error) {
        console.error('Error fetching reviews:', error.message);
        return;
      }
      setReviews(data);
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  // Add review for a Pokémon
  const addReview = async (pokemonId) => {
    if (!reviewText) {
      alert('Please provide a review.');
      return;
    }

    try {
      const { error } = await supabase
        .from('pokemon_reviews')
        .insert([{ pokemon_id: pokemonId, review: reviewText }]);

      if (error) {
        console.error('Error adding review:', error.message);
        return;
      }

      setReviewText('');
      fetchReviews(); // Refresh the reviews list
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  // Delete a review
  const deleteReview = async (id) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        const { error: deleteError } = await supabase
          .from('pokemon_reviews')
          .delete()
          .match({ id });

        if (deleteError) {
          console.error('Delete error:', deleteError.message);
          return;
        }

        fetchReviews(); // Refresh the reviews list
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  // Handle search query input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle sorting change (by name or upload date)
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Filter Pokémon data by search query
  const filteredPokemon = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort Pokémon data by selected criteria
  const sortedPokemon = [...filteredPokemon].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    // Assuming you have upload date in the Pokémon data
    return new Date(a.created_at) - new Date(b.created_at);
  });

  // On component mount, fetch Pokémon data and reviews
  useEffect(() => {
    fetchPokemon();
    fetchReviews();
  }, [sortBy]);

  return (
    <div style={styles.container}>
      <h2>Pokemon Review App</h2>

      <div style={styles.inputGroup}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search Pokémon by name"
          style={styles.input}
        />
      </div>

      <select onChange={handleSortChange} style={styles.select}>
        <option value="name">Sort by Name</option>
        <option value="created_at">Sort by Upload Date</option>
      </select>

      {loading ? (
        <p>Loading Pokémon...</p>
      ) : (
        <div style={styles.pokemonList}>
          {sortedPokemon.map((pokemon) => (
            <div key={pokemon.name} style={styles.pokemonItem}>
              <h3>{pokemon.name}</h3>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.name}.png`}
                alt={pokemon.name}
                style={styles.pokemonImage}
              />

              {/* Add review section */}
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write a review..."
                style={styles.reviewInput}
              />
              <button
                onClick={() => addReview(pokemon.name)}
                style={styles.button}
              >
                Add Review
              </button>

              {/* Display reviews for this Pokémon */}
              <div style={styles.reviews}>
                {reviews
                  .filter((review) => review.pokemon_id === pokemon.name)
                  .map((review) => (
                    <div key={review.id} style={styles.reviewItem}>
                      <p>{review.review}</p>
                      <button
                        onClick={() => deleteReview(review.id)}
                        style={styles.deleteButton}
                      >
                        Delete Review
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => window.history.back()} style={styles.backButton}>
        Back
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8f8f8',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  inputGroup: {
    marginBottom: '15px',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  select: {
    padding: '10px',
    width: '100%',
    marginBottom: '15px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
    width: '100%',
    marginBottom: '10px',
  },
  pokemonList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: '20px',
  },
  pokemonItem: {
    width: '200px',
    textAlign: 'center',
  },
  pokemonImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  reviewInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    marginBottom: '10px',
  },
  reviews: {
    marginTop: '15px',
  },
  reviewItem: {
    padding: '10px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    borderRadius: '8px',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#FF6347',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  backButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
    textAlign: 'center',
  },
};

export default PokemonReviewApp;
