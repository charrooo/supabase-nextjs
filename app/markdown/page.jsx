'use client'

import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import ReactMarkdown from 'react-markdown';  // For Markdown preview

const MarkdownNotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch notes from Supabase
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false }); // Fetch in descending order of creation date

      if (error) {
        console.error('Error fetching notes:', error.message);
        return;
      }

      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new note
  const createNote = async () => {
    if (!noteText || !noteTitle) {
      alert('Please provide both title and note content.');
      return;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .insert([{ title: noteTitle, content: noteText }]);

      if (error) {
        console.error('Error creating note:', error.message);
        return;
      }

      setNoteText('');
      setNoteTitle('');
      fetchNotes(); // Refresh the list of notes
    } catch (err) {
      console.error('Error creating note:', err.message);
    }
  };

  // Edit an existing note
  const editNote = async (id) => {
    const note = notes.find((note) => note.id === id);
    setNoteTitle(note.title);
    setNoteText(note.content);
    setIsEditing(true);
    setEditingNoteId(id);
  };

  // Update an existing note
  const updateNote = async () => {
    if (!noteText || !noteTitle) {
      alert('Please provide both title and note content.');
      return;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .update({ title: noteTitle, content: noteText })
        .eq('id', editingNoteId);

      if (error) {
        console.error('Error updating note:', error.message);
        return;
      }

      setIsEditing(false);
      setEditingNoteId(null);
      setNoteText('');
      setNoteTitle('');
      fetchNotes(); // Refresh the list of notes
    } catch (err) {
      console.error('Error updating note:', err.message);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting note:', error.message);
          return;
        }

        fetchNotes(); // Refresh the list of notes
      } catch (err) {
        console.error('Error deleting note:', err.message);
      }
    }
  };

  // On component mount, fetch notes
  useEffect(() => {
    fetchNotes();
  }, []);

  // Back button handler (navigate back to previous page)
  const handleGoBack = () => {
    window.history.back();  // Native browser back navigation
  };

  return (
    <div style={styles.container}>
      <h2>Markdown Notes App</h2>

      <div style={styles.inputGroup}>
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Enter note title"
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter note content in Markdown"
          style={styles.textarea}
        />
      </div>

      <div style={styles.buttonsContainer}>
        {isEditing ? (
          <button onClick={updateNote} style={styles.button}>
            Update Note
          </button>
        ) : (
          <button onClick={createNote} style={styles.button}>
            Create Note
          </button>
        )}
      </div>

      <div style={styles.previewContainer}>
        <h3>Markdown Preview</h3>
        <div style={styles.preview}>
          <ReactMarkdown>{noteText}</ReactMarkdown>
        </div>
      </div>

      <div style={styles.notesList}>
        <h3>Your Notes</h3>
        {loading ? (
          <p>Loading notes...</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} style={styles.noteItem}>
              <h4>{note.title}</h4>
              <div style={styles.actions}>
                <button onClick={() => editNote(note.id)} style={styles.editButton}>Edit</button>
                <button onClick={() => deleteNote(note.id)} style={styles.deleteButton}>Delete</button>
              </div>
              <p>{note.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Back Button */}
      <button onClick={handleGoBack} style={styles.backButton}>
        Go Back
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
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    height: '200px',
    resize: 'none',
  },
  buttonsContainer: {
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
  },
  previewContainer: {
    marginTop: '20px',
    width: '100%',
  },
  preview: {
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#f1f1f1',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  notesList: {
    marginTop: '30px',
    width: '100%',
  },
  noteItem: {
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    marginBottom: '15px',
    width: '100%',
  },
  actions: {
    marginBottom: '10px',
  },
  editButton: {
    padding: '5px 10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#FF6347',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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
  },
};

export default MarkdownNotesApp;
