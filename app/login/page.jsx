import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>

    <form>
      <label htmlFor="email" className="block text-md font-medium text-gray-700">Email:</label>
      <input id="email" name="email" type="email" required />
      <br></br>
      <label htmlFor="password" className="block text-md font-medium text-gray-700">Password:</label>
      <input id="password" name="password" type="password" required />
      <br></br>
      <br></br>
      <button 
        type="submit" 
        formAction={login} 
         className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
  Log In
</button>
<br></br>
<br></br>
      <button 
      type="submit" 
      formAction={signup}
      className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
        Sign up</button>
    </form>
    </div>
    </div>
  )
}