import React, { useEffect, useState } from "react";
import "./home.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from "react-router-dom";
import MovieList from "../../components/movieList/movieList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Home = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
            .then(res => res.json())
            .then(data => {
                setPopularMovies(data.results);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching popular movies:", error));
    }, []);

    return (
        <>
            <div className="poster">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <Carousel
                        showThumbs={false}
                        autoPlay={true}
                        interval={3000} // Adjust this value as needed
                        infiniteLoop={true}
                        showStatus={false}
                    >
                        {popularMovies.map(movie => (
                            <Link key={movie.id} style={{textDecoration:"none",color:"white"}} to={`/movie/${movie.id}`}>
                                <div className="posterImage">
                                    <img src={`https://image.tmdb.org/t/p/original${movie && movie.backdrop_path}`} alt={movie.original_title} />
                                </div>
                                <div className="posterImage__overlay">
                                    <div className="posterImage__title">{movie ? movie.original_title : ""}</div>
                                    <div className="posterImage__runtime">
                                        {movie ? movie.release_date : ""}
                                        <span className="posterImage__rating">
                                            <i className="fas fa-star" />
                                            {movie ? movie.vote_average : ""}

                                        </span>
                                    </div>
                                    <div className="posterImage__description">{movie ? movie.overview : ""}</div>
                                </div>
                            </Link>
                        ))}
                    </Carousel>
                )}
                <MovieList />
            </div>
        </>
    );
};

export default Home;
