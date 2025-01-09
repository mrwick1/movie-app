"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
// 1. Import from Framer Motion
import { motion, AnimatePresence } from "framer-motion";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setMovies([]); // Clear previous results on new search

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Error searching movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-screen-xl px-4 py-8 bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Movie Search</h1>
        <p className="text-sm text-gray-600">
          Find your favorite movies and discover new ones!
        </p>
      </header>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="mx-auto mb-8 flex max-w-md items-center gap-2"
      >
        <input
          type="text"
          placeholder="Search a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:translate-y-0"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Loading Spinner + Skeleton */}
      {loading && (
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <motion.div
            className="mb-4 h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          {/* Skeleton grid */}
          <div className="grid w-full max-w-screen-lg gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg bg-white shadow-sm"
              >
                <div className="h-72 w-full animate-pulse bg-gray-200" />
                <div className="p-4">
                  <div className="mb-2 h-4 w-3/4 animate-pulse bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Movie Results */}
      {!loading && movies.length > 0 && (
        <AnimatePresence>
          <motion.div
            className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            // 2. Parent container animation
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.1 },
              },
            }}
          >
            {movies.map((movie) => (
              // 3. Child item animation
              <motion.div
                key={movie.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ type: "spring", stiffness: 80 }}
              >
                <Link
                  href={`/movie/${movie.id}`}
                  className="group block overflow-hidden rounded-lg bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  {movie.poster_path ? (
                    <motion.img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                      className="h-72 w-full object-cover"
                      whileHover={{ scale: 1.05 }}
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center bg-gray-200 text-gray-500">
                      No Image
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="mb-1 text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                      {movie.title}
                    </h2>
                    {movie.release_date && (
                      <p className="text-sm text-gray-500">
                        {movie.release_date.slice(0, 4)}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* No results */}
      {!loading && query && movies.length === 0 && (
        <motion.p
          className="mt-10 text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No movies found.
        </motion.p>
      )}
    </main>
  );
}
