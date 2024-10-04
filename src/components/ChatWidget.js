import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css'; // Import your CSS file

const ChatWidget = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isWidgetVisible, setIsWidgetVisible] = useState(false);
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const chatBoxRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const greetingMessage = "Hi, I'm Andy🤖 I can suggest movies, provide movie info, and share my favorite films. How can I help?";
        setMessages([{ text: greetingMessage, isBot: true }]);
    }, []);

    useEffect(() => {
        if (isWidgetVisible && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isWidgetVisible]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const getMovieDetails = async (query) => {
        const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            const movieData = await response.json();

            // Check if there are results
            if (movieData.results && movieData.results.length > 0) {
                const movie = movieData.results[0]; // Get the first movie result

                // Map genre IDs to genre names
                const genreNames = movie.genre_ids.map(id => genreMapping[id] || 'Unknown').join(', ');

                return `

Title: ${movie.title}

Year: ${new Date(movie.release_date).getFullYear()}

Genre: ${genreNames}

Overview: ${movie.overview}

Rating: ${movie.vote_average} / 10`;
            } else {
                return 'Sorry, I could not find any information about that movie.';
            }
        } catch (error) {
            return 'There was an error retrieving movie details. Please try again later.';
        }
    };
    const genreMapping = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        14: 'Fantasy',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western',
    };    
    const recommendMoviesByGenre = (genre) => {
        const recommendations = {
            action: ["The Dark Knight", "Inception", "Die Hard", "Mad Max: Fury Road"],
            comedy: ["The Hangover", "Superbad", "Anchorman", "Bridesmaids"],
            drama: ["The Shawshank Redemption", "Forrest Gump", "Schindler's List", "The Godfather"],
            horror: ["The Exorcist", "Get Out", "A Nightmare on Elm Street", "Psycho"],
            romance: ["Titanic", "The Notebook", "Pride & Prejudice", "La La Land"],
            'sci-fi': ["Blade Runner 2049", "The Matrix", "Interstellar", "Star Wars: A New Hope"]
        };

        const movies = recommendations[genre];
        if (movies) {
            return `Sure, here are some movies based on ${genre} : ${movies.join(', ')}`;
        } else {
            return "Sorry, we don't have recommendations for that genre.";
        }
    };

    const sendMessage = async () => {
        if (userInput.trim() === '') return;
    
        const userMessage = { text: userInput, isBot: false };
        setMessages([...messages, userMessage]);
        setUserInput('');
    
        let reply = '';
    
        if (userInput.toLowerCase().includes('hello') ||
            userInput.toLowerCase().includes('hi') ||
            userInput.toLowerCase().includes('hey')) {
            reply = "Hi! How can I help you?";
        } else if (userInput.toLowerCase().includes('recommend a movie') ||
            userInput.toLowerCase().includes('suggest a movie')) {
            reply = "Sure! What genre are you interested in?";
        } else if (userInput.toLowerCase().includes('favorite movie') ||
            userInput.toLowerCase().includes('your favorite movie') ||
            userInput.toLowerCase().includes('your favourite movie')) {
            reply = "That's a tough one. But I'd say 'The Shawshank Redemption'.";
        } else if (userInput.toLowerCase().includes('you like')) {
            reply = "Your Name, Taxi Driver, Fight Club, The Pianist, to name a few.";
        } else {
            const genre = extractGenre(userInput);
            if (genre) {
                reply = recommendMoviesByGenre(genre);
            } else {
                try {
                    const movieDetails = await getMovieDetails(userInput);
                    reply = `Here are some details about ${userInput}: ${movieDetails}`;
                } catch (error) {
                    reply = "Sorry, I couldn't retrieve information about that movie. Please try again later.";
                }
            }
        }
    
        const botMessage = { text: reply, isBot: true };
        setMessages(prevMessages => [...prevMessages, botMessage]);
    };
    
    const extractGenre = (message) => {
        const words = message.toLowerCase().split(' ');
    
        const genreKeywords = {
            action: ['action', 'adventure', 'thriller', 'superhero', 'fight'],
            comedy: ['comedy', 'funny', 'laughs', 'humor', 'hilarious'],
            drama: ['drama', 'emotional', 'serious', 'intense', 'powerful'],
            horror: ['horror', 'scary', 'creepy', 'fear', 'spooky'],
            romance: ['romance', 'love', 'romantic', 'heartfelt', 'relationship'],
            'sci-fi': ['sci-fi', 'science fiction', 'futuristic', 'space']
        };
    
        for (const word of words) {
            for (const genre in genreKeywords) {
                if (genreKeywords[genre].some(keyword => word.includes(keyword))) {
                    return genre;
                }
            }
        }
    
        return null;
    };
    
    const toggleWidgetVisibility = () => {
        setIsWidgetVisible(!isWidgetVisible);
    };

    const handleMouseDown = (event) => {
        document.body.classList.add('no-select');
        const offsetX = event.clientX - position.x;
        const offsetY = event.clientY - position.y;
        setOffset({ x: offsetX, y: offsetY });
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event) => {
        setPosition({
            x: event.clientX - offset.x,
            y: event.clientY - offset.y
        });
    };

    const handleMouseUp = () => {
        document.body.classList.remove('no-select');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div>
            <div className="chat-widget-container" style={{ top: position.y, left: position.x }}>
                <div className="widget-circle" onMouseDown={handleMouseDown}>
                    <div className="circle" onClick={toggleWidgetVisibility}><div className='tooltip'>
                <img src='https://i.ibb.co/gWxs6H9/output-onlinepngtools-3.png' className='img' alt='Icon' />
                <div className="tooltiptext">Hey!</div>
            </div></div>
                </div>
                <div className={`chat-widget ${isWidgetVisible ? 'show' : 'hide'}`}>
                    <div className="widget-header">
                        <div className="close-btn" onClick={toggleWidgetVisibility}>×</div>
                    </div>
                    <div className="chat-container">
                        <div className="chat-box" ref={chatBoxRef}>
                            {messages.map((message, index) => (
                                <div key={index} className={`message ${message.isBot ? 'bot-message' : 'user-message'}`}>
                                    {message.text}
                                </div>
                            ))}
                        </div>
                        <div className="user-input">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Type your message here..."
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                ref={inputRef}
                            />
                            <button onClick={sendMessage}>Send</button>
                            <button onClick={clearChat}>Clear</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWidget;
