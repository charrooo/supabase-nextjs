import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 text-transparent bg-clip-text animate-gradient">
          Welcome to Our Website
        </h1>
        <p className="text-lg text-gray-300 mt-4">
          Your one-stop solution for everything amazing.
        </p>
      </header>

      <main className="flex flex-col items-center gap-8">
        <Image
          className="rounded-full"
          src="/logo.svg"  // Update with your actual logo
          alt="Website Logo"
          width={180}
          height={180}
          priority
        />

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {/* Keep the login button as it is */}
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/login" // This is your login page link
          >
            Start Here
          </a>
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-500">
        <p>&copy; 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}
