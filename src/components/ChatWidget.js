import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css'; // Import your CSS file

const ChatWidget = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isWidgetVisible, setIsWidgetVisible] = useState(false);
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const chatBoxRef = useRef(null);

    useEffect(() => {
        // Initialize chat with a greeting message
        setMessages([{ text: "Hi, what's on your mind today?", isBot: true }]);
    }, []);

    const extractName = (message) => {
        // Implement extractName logic here
        return ''; // Placeholder return value
    };

    const extractGenre = (message) => {
        const genres = ['action', 'comedy', 'drama', 'horror', 'romance', 'sci-fi']; // List of possible genres
        const words = message.toLowerCase().split(' '); // Split message into words and convert to lowercase
        
        // Check if any of the words in the message match the predefined genres
        const matchedGenre = words.find(word => genres.includes(word));
        
        // Return the matched genre if found, otherwise return an empty string
        return matchedGenre ? matchedGenre : '';
    };
    
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
                    IMDB Rating: ${movie.imdbRating}
                `;
            } else {
                return 'Sorry, I could not find any information about that movie.';
            }
        } catch (error) {
            return 'There was an error retrieving movie details. Please try again later.';
        }
    };
    
    const recommendMoviesByGenre = (genre) => {
        // Sample movie recommendations for each genre
        const recommendations = {
            action: ["The Dark Knight", "Inception", "Die Hard", "Mad Max: Fury Road"],
            comedy: ["The Hangover", "Superbad", "Anchorman", "Bridesmaids"],
            drama: ["The Shawshank Redemption", "Forrest Gump", "Schindler's List", "The Godfather"],
            horror: ["The Exorcist", "Get Out", "A Nightmare on Elm Street", "Psycho"],
            romance: ["Titanic", "The Notebook", "Pride & Prejudice", "La La Land"],
            sci_fi: ["Blade Runner 2049", "The Matrix", "Interstellar", "Star Wars: A New Hope"]
        };
    
        // Check if the provided genre exists in the recommendations object
        if (recommendations.hasOwnProperty(genre)) {
            // Return movie recommendations for the specified genre
            return recommendations[genre].join(', ');
        } else {
            // If the genre is not found, return a default message
            return "Sorry, we don't have recommendations for that genre.";
        }
    };
    

    const sendMessage = async () => {
        if (userInput.trim() === '') return;
    
        // Add the user's message to the message history
        const userMessage = { text: userInput, isBot: false };
        setMessages([...messages, userMessage]);
        setUserInput('');
    
        let reply = '';
        let userName = ''; // Declare userName variable
        const genre = extractGenre(userInput); // Extract genre from user input
    
        if (userName) {
            userName = extractName(userInput);
            reply = `Nice to meet you, ${userName}! What's on your mind today?`;
        } else if (genre) {
            reply = recommendMoviesByGenre(genre);
        } else if (
            userInput.toLowerCase().includes('recommend movies') ||
            userInput.toLowerCase().includes('recommend a movie') ||
            userInput.toLowerCase().includes('suggest a movie') ||
            userInput.toLowerCase().includes('suggest movies') ||
            userInput.toLowerCase().includes('what to watch') ||
            userInput.toLowerCase().includes('what should i watch') ||
            userInput.toLowerCase().includes('can you recommend a movie') ||
            userInput.toLowerCase().includes('can you suggest a movie') ||
            userInput.toLowerCase().includes('what movies do you recommend') ||
            userInput.toLowerCase().includes('what should i watch next') ||
            userInput.toLowerCase().includes('show me some movies') ||
            userInput.toLowerCase().includes('give me movie suggestions') ||
            userInput.toLowerCase().includes('movie recommendations') ||
            userInput.toLowerCase().includes('suggest a good movie') ||
            userInput.toLowerCase().includes('what\'s a good movie to watch')
        ) {
            reply = "Sure! What genre are you interested in?";
        } else if (userInput.toLowerCase().includes('favorite movie') || userInput.toLowerCase().includes('favorite movies')) {
            reply = "That's a tough one. But I'd say 'The Shawshank Redemption'.";
        } else if (
            userInput.toLowerCase().includes('you like') ||
            userInput.toLowerCase().includes('what movies do you like')
        ) {
            reply = "Your Name, Taxi Driver, The Dark Knight, The Pianist, to name a few.";
        } else {
            try {
                // Call the getMovieDetails function to retrieve details about the movie mentioned by the user
                const movieDetails = await getMovieDetails(userInput);
    
                // Construct a reply with details about the movie
                reply = `Here are some details about ${userInput}: ${movieDetails}`;
            } catch (error) {
                // If an error occurs while fetching movie details, provide a generic apology message
                reply = "Sorry, I couldn't retrieve information about that movie. Please try again later.";
            }
        }
    
        // Add a delay to simulate bot processing time (optional)
        await new Promise(resolve => setTimeout(resolve, 1000));
    
        // Add the bot's response to the message history
        const botMessage = { text: reply, isBot: true };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        
        console.log(chatBoxRef.current);
        // Scroll to the bottom of the chat box after sending the message
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    };
    const toggleWidgetVisibility = () => {
        setIsWidgetVisible(!isWidgetVisible);
    };

    const handleMouseDown = (event) => {
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
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div>
            <div className="chat-widget-container" style={{ top: position.y, left: position.x }}>
                <div className="widget-circle" onMouseDown={handleMouseDown}>
                    <div className="circle" onClick={toggleWidgetVisibility}>☻</div>
                </div>
                <div className={`chat-widget ${isWidgetVisible ? 'show' : 'hide'}`}>
                    <div className="widget-header">
                        <div className="close-btn" onClick={toggleWidgetVisibility}>×</div>
                    </div>
                    <div className="chat-container">
                        <div className="chat-box">
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
                            />
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWidget;
