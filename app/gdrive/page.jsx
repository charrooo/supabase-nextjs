'use client';

import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const PhotoGallery = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [photos, setPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

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
        .upload(`photos/${file.name}`, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError.message);
        throw new Error('Error uploading file');
      }

      const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${data.path}`;
      const { error: dbError } = await supabase
        .from('photos')
        .insert([{ name, url: fileUrl }]);

      if (dbError) {
        console.error('Database insert error:', dbError.message);
        throw new Error('Error saving to the database');
      }

      successMessage.textContent = 'Photo uploaded successfully!';
      fetchPhotos(); // Refresh the photo list
    } catch (err) {
      errorMessage.textContent = `Error: ${err.message}`;
    } finally {
      button.disabled = false;
    }
  };

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPhotos = photos.filter(photo =>
    photo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  useEffect(() => {
    fetchPhotos();
  }, [sortBy]);

  const handleGoBack = () => {
    window.history.back(); // Native browser back navigation
  };

  return (
    <div style={styles.container}>
      <h2>Upload & Manage Photos</h2>

      <div id="successMessage" style={styles.success}></div>
      <div id="errorMessage" style={styles.error}></div>

      <div style={styles.inputGroup}>
        <input
          type="text"
          onChange={handleNameChange}
          placeholder="Enter photo name"
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
        Upload
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
              <button onClick={() => deletePhoto(photo.id)} style={styles.deleteButton}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleGoBack} style={styles.backButton}>
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
    width: '150px',
    textAlign: 'center',
  },
  photo: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  deleteButton: {
    marginTop: '10px',
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

export default PhotoGallery;
