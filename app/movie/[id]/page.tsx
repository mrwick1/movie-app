"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: { id: number; name: string }[];
  runtime: number;
  vote_average: number;
}

interface Credits {
  cast: {
    cast_id: number;
    character: string;
    name: string;
    profile_path: string | null;
  }[];
}

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const [movieRes, creditsRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`
          ),
        ]);

        if (!movieRes.ok) {
          throw new Error("Failed to fetch movie details.");
        }

        if (!creditsRes.ok) {
          throw new Error("Failed to fetch credits.");
        }

        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();

        setMovie(movieData);
        setCredits(creditsData);
      } catch (err: unknown) {
        console.error("Error fetching movie details:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <motion.div
          className="h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <Head>
          <title>Error - Movie Details</title>
        </Head>
        <p className="mb-4 text-lg text-red-500">{error}</p>
        <button
          onClick={() => router.back()}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:translate-y-0"
        >
          Go Back
        </button>
      </main>
    );
  }

  if (!movie) {
    return null;
  }

  return (
    <main className="relative bg-gray-100 text-gray-900">
      <Head>
        <title>{movie.title} - Movie Details</title>
        <meta name="description" content={movie.overview} />
        {/* Open Graph Meta Tags */}
        {movie.backdrop_path && (
          <meta
            property="og:image"
            content={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          />
        )}
      </Head>

      {/* Hero Section with Backdrop */}
      {movie.backdrop_path && (
        <div
          className="absolute inset-0 -z-10 h-full w-full bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        />
      )}

      <div className="mx-auto max-w-screen-xl px-4 py-16">
        <Link
          href="/"
          className="mb-6 inline-block text-blue-600 hover:underline"
        >
          &larr; Back to Search
        </Link>

        <div className="flex flex-col items-start gap-8 md:flex-row">
          {/* Movie Poster */}
          {movie.poster_path ? (
            <motion.div
              className="relative w-full max-w-sm rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
                layout="responsive"
                width={500}
                height={750}
                className="object-cover"
              />
            </motion.div>
          ) : (
            <div className="flex h-96 w-full max-w-sm items-center justify-center rounded-lg bg-gray-200 text-gray-500">
              No Image Available
            </div>
          )}

          {/* Movie Details */}
          <div className="flex-1">
            <motion.h1
              className="mb-4 text-4xl font-bold text-gray-800"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {movie.title}
            </motion.h1>
            <motion.p
              className="mb-6 text-lg text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {movie.overview || "No description available."}
            </motion.p>

            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <span className="font-semibold">Release Date:</span>{" "}
              <span className="text-gray-600">
                {movie.release_date || "N/A"}
              </span>
            </motion.div>

            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <span className="font-semibold">Runtime:</span>{" "}
              <span className="text-gray-600">
                {movie.runtime ? `${movie.runtime} minutes` : "N/A"}
              </span>
            </motion.div>

            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <span className="font-semibold">Genres:</span>{" "}
              {movie.genres.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <motion.span
                      key={genre.id}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                      whileHover={{ scale: 1.05, backgroundColor: "#93c5fd" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {genre.name}
                    </motion.span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-600">N/A</span>
              )}
            </motion.div>

            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <span className="font-semibold">Rating:</span>{" "}
              <span className="text-gray-600">
                {movie.vote_average ? `${movie.vote_average}/10` : "N/A"}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Cast Section */}
        {credits && credits.cast.length > 0 && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Cast</h2>
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {credits.cast.slice(0, 10).map((member) => (
                <motion.div
                  key={member.cast_id}
                  className="flex-shrink-0 w-40"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {member.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                      alt={member.name}
                      width={200}
                      height={300}
                      className="rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="flex h-60 w-40 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
                      No Image
                    </div>
                  )}
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-800">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      as {member.character}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
