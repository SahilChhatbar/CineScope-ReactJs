import React, { useEffect, useState } from "react";
import "./movieList.css";
import { useParams } from "react-router-dom";
import Cards from "../card/card";

const MovieList = () => {
    const [movieList, setMovieList] = useState([]);
    const { type } = useParams();
    const apiKey = process.env.REACT_APP_SECRET_KEY1;
    useEffect(() => {
        getData();
    }, [type]); // Dependency array includes 'type'

    const getData = () => {
        fetch(`https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
            .then(res => res.json())
            .then(data => setMovieList(data.results))
            .catch(error => console.error("Error fetching data:", error));
    };

    const getTitle = (type) => {
        if (!type) {
            return "POPULAR";
        }
        return type.replace("_", "  ").toUpperCase();
    };

    return (
        <div className="movie__list__container">
            <div className="overlay"></div>
            <div className="movie__list">
                <h2 className="list__title">{getTitle(type)}</h2>
                <div className="list__cards">
                    {movieList.map(movie => (
                        <Cards key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieList;
