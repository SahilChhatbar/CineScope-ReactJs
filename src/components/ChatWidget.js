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
        const OMDB_API_KEY = '63daf7aa';
        const url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            const movie = await response.json();

            if (movie.Response === 'True') {
                return `
Title: ${movie.Title}

Year: ${movie.Year}

Genre: ${movie.Genre}

Director: ${movie.Director}

Actors: ${movie.Actors}

Plot: ${movie.Plot}

IMDB Rating: ${movie.imdbRating}`;
            } else {
                return 'Sorry, I could not find any information about that movie.';
            }
        } catch (error) {
            return 'There was an error retrieving movie details. Please try again later.';
        }
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
