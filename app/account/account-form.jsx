'use client'
import { createClient } from '../../utils/supabase/client'

export default function AccountForm({ user }) {
  const supabase = createClient()

  // Function to handle the account deletion
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const { error } = await supabase.auth.deleteUser()
      
      if (error) {
        console.error("Error deleting account:", error)
        alert("There was an error deleting your account. Please try again later.")
      } else {
        alert("Your account has been deleted successfully.")
        // Optionally, redirect the user after account deletion
        window.location.href = '/'; // Redirect to the homepage or login page
      }
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#000000', // Black background
      fontFamily: 'Roboto, sans-serif',
      padding: '20px',
      boxSizing: 'border-box',
      color: '#fff'  // White text for better contrast on black background
    }}>
      <h1 style={{
        fontSize: '28px', 
        fontWeight: '600',
        color: '#fff', // White heading text
        textAlign: 'center', 
        marginBottom: '30px'
      }}>
        Welcome, {user?.email || 'User'}!
      </h1>

      <div style={{
        marginBottom: '20px',
        textAlign: 'center',
        width: '100%',
        maxWidth: '400px'
      }}>
        <label htmlFor="email" style={{
          fontSize: '16px', 
          color: '#ddd',
          marginBottom: '5px', 
          display: 'block'
        }}>
          Email Address:
        </label>
        <input 
          id="email" 
          type="text" 
          value={user?.email} 
          disabled 
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #444', // Darker border for contrast
            borderRadius: '8px',
            backgroundColor: '#333', // Dark background for input
            color: '#fff', // White text inside input
            fontSize: '14px',
            boxSizing: 'border-box'
          }} 
        />
      </div>
      <div style={{ width: '100%', maxWidth: '400px' }}>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/information" 
          >
            Go to profile
          </a>
          </div>
          <br></br>

          <div style={{ width: '100%', maxWidth: '400px' }}>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/todo" 
          >
            To do list
          </a>
          </div>
          <br></br>

          <div style={{ width: '100%', maxWidth: '400px' }}>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/food" 
          >
            Food Review App
          </a>
          </div>
          <br></br>

          <div style={{ width: '100%', maxWidth: '400px' }}>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/pokemon" 
          >
            Pokemon Review App
          </a>
          </div>
          <br></br>

          <div style={{ width: '100%', maxWidth: '400px' }}>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/markdown" 
          >
            Markdown notes
          </a>
          </div>
          <br></br>

          <div style={{ width: '100%', maxWidth: '400px' }}>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/gdrive" 
          >
            Google Drive "Lite"
          </a>
          </div>
          <br></br>



      <div style={{ width: '100%', maxWidth: '400px' }}>
        <form action="/auth/signout" method="post">
          <button 
            type="submit" 
            style={{
              backgroundColor: '#ff5722',
              color: '#fff',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e64a19'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ff5722'}
          >
            Sign Out
          </button>
        </form>
      </div>

      {/* Delete Account button */}
      <div style={{
        marginTop: '20px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <button 
          onClick={handleDelete} 
          style={{
            backgroundColor: '#d32f2f', 
            color: '#fff',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#c62828'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#d32f2f'}
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}
