import {useState, useEffect} from "react";

const Key = "76d1137e";

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(
        function () {
            const controller = new AbortController();

            async function fetchMovies() {
                try {
                    setError("");
                    setIsLoading(true);
                    const res = await fetch(
                        `http://www.omdbapi.com/?apikey=${Key}&s=${query}`,
                        {signal: controller.signal}
                    );

                    if (!res.ok)
                        throw new Error(
                            "Something went wrong with fetching movies"
                        );

                    const data = await res.json();
                    if (data.Response === "False") {
                        throw new Error("Movie not found");
                    }
                    setMovies(data.Search);
                    setError("");
                } catch (err) {
                    if (err.name !== "AbortError") {
                        console.log(err.message);
                        setError(err.message);
                    }
                } finally {
                    setIsLoading(false);
                }
            }
            if (!query.length) {
                setMovies([]);
                setError("");
                return;
            }

            // handleCloseMovie();
            fetchMovies();

            return function () {
                controller.abort();
            };
        },
        [query]
    );

    return {movies, isLoading, error};
}
