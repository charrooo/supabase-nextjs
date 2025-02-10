'use client';

import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const FoodReviewApp = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle name input
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Handle review text input
  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
  };

  // Fetch food photos
  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order(sortBy, { ascending: true });

      if (error) {
        console.error(error.message);
        return;
      }
      setPhotos(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews for each photo
  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*');

      if (error) {
        console.error(error.message);
        return;
      }
      setReviews(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Upload a food photo
  const uploadPhoto = async () => {
    if (!file || !name) {
      alert('Please provide both a name and a photo.');
      return;
    }

    const button = document.getElementById('uploadButton');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    button.disabled = true;
    successMessage.textContent = '';
    errorMessage.textContent = '';

    try {
      const bucketName = 'photos';
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(`food_photos/${file.name}`, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError.message);
        throw new Error('Error uploading file');
      }

      const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/food_photos/${data.path}`;
      const { error: dbError } = await supabase
        .from('photos')
        .insert([{ name, url: fileUrl }]);

      if (dbError) {
        console.error('Database insert error:', dbError.message);
        throw new Error('Error saving to the database');
      }

      successMessage.textContent = 'Food photo uploaded successfully!';
      fetchPhotos(); // Refresh the photo list
    } catch (err) {
      errorMessage.textContent = `Error: ${err.message}`;
    } finally {
      button.disabled = false;
    }
  };

  // Add review for a photo
  const addReview = async (photoId) => {
    if (!reviewText) {
      alert('Please provide a review.');
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{ photo_id: photoId, review: reviewText }]);

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

  // Delete a food photo
  const deletePhoto = async (id) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        const { error: deleteError } = await supabase.from('photos').delete().match({ id });
        if (deleteError) {
          console.error('Delete error:', deleteError.message);
          return;
        }
        fetchPhotos(); // Refresh the photo list
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  // Delete a review
  const deleteReview = async (id) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        const { error: deleteError } = await supabase.from('reviews').delete().match({ id });
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

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter and sort photos
  const filteredPhotos = photos.filter(photo =>
    photo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle sorting by name or upload date
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // On page load, fetch photos and reviews
  useEffect(() => {
    fetchPhotos();
    fetchReviews();
  }, [sortBy]);

  return (
    <div style={styles.container}>
      <h2>Food Review App</h2>

      <div id="successMessage" style={styles.success}></div>
      <div id="errorMessage" style={styles.error}></div>

      <div style={styles.inputGroup}>
        <input
          type="text"
          onChange={handleNameChange}
          placeholder="Enter food name"
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <input
          type="file"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
      </div>

      <div style={styles.preview}>
        <img id="previewImage" alt="Preview" style={styles.previewImage} />
      </div>

      <button id="uploadButton" onClick={uploadPhoto} style={styles.button}>
        Upload Food Photo
      </button>

      <input
        type="text"
        placeholder="Search photos"
        value={searchQuery}
        onChange={handleSearchChange}
        style={styles.searchInput}
      />

      <select onChange={handleSortChange} style={styles.select}>
        <option value="name">Sort by Name</option>
        <option value="created_at">Sort by Upload Date</option>
      </select>

      {loading ? (
        <p>Loading photos...</p>
      ) : (
        <div style={styles.photoList}>
          {filteredPhotos.map((photo) => (
            <div key={photo.id} style={styles.photoItem}>
              <img src={photo.url} alt={photo.name} style={styles.photo} />
              <div>{photo.name}</div>
              <div>{new Date(photo.created_at).toLocaleDateString()}</div>

              {/* Add review section */}
              <textarea
                value={reviewText}
                onChange={handleReviewChange}
                placeholder="Write a review..."
                style={styles.reviewInput}
              />
              <button onClick={() => addReview(photo.id)} style={styles.button}>
                Add Review
              </button>

              {/* Display reviews for this photo */}
              <div style={styles.reviews}>
                {reviews
                  .filter((review) => review.photo_id === photo.id)
                  .map((review) => (
                    <div key={review.id} style={styles.reviewItem}>
                      <p>{review.review}</p>
                      <button onClick={() => deleteReview(review.id)} style={styles.deleteButton}>Delete Review</button>
                    </div>
                  ))}
              </div>

              <button onClick={() => deletePhoto(photo.id)} style={styles.deleteButton}>
                Delete Photo
              </button>
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
  fileInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
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
  searchInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    marginBottom: '15px',
  },
  select: {
    padding: '10px',
    width: '100%',
    marginBottom: '15px',
  },
  photoList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: '20px',
  },
  photoItem: {
    width: '200px',
    textAlign: 'center',
  },
  photo: {
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
  preview: {
    marginTop: '20px',
    marginBottom: '10px',
    width: '100%',
    textAlign: 'center',
  },
  previewImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    textAlign: 'center',
  },
  success: {
    color: 'green',
    marginBottom: '15px',
    textAlign: 'center',
  },
};

export default FoodReviewApp;
