import { useContext, useState, useEffect, useRef } from 'react';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import { Link } from 'react-router-dom';
import Tesseract from 'tesseract.js';
// Function to shuffle the suggestions array
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

const Main = () => {
    const { onSent, showResult, loading, setInput, input, themeColor } = useContext(Context);
    const [shareOpen, setShareOpen] = useState(false);
    const inputRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [typingMessage, setTypingMessage] = useState('');  // For typing effect
    const [suggestionIndex, setSuggestionIndex] = useState(0); // Track the current suggestion index
    const [setShowSuggestions] = useState(true); // Track visibility of suggestions
    const chatContainerRef = useRef(null);
    const recognitionRef = useRef(null); 
    
    // Full list of short suggestions
    const allSuggestions = [
        "Top Engineering Colleges",
        "Scholarship info",
        "Admission deadlines",
        "Program details",
        "Entrance exams",
        "Eligibility criteria"
    ];
    const playMicSound = () => {
        const micSound = new Audio(assets.recognition_sound);
        micSound.play();
    }; 
    const fileToText = async (file) => {
        try {
            const text = await file.text();
            return text;
        } catch (error) {
            console.error('Error reading text file:', error);
            return 'Error reading file';
        }
    };
    const imageToText = async (file) => {
        try {
            const { data: { text } } = await Tesseract.recognize(file, 'eng');
            return text;
        } catch (error) {
            console.error('Error extracting text from image:', error);
            return '';
        }
    };
    useEffect(() => {
        if (loading) {
            setIsSending(true);
        } else {
            setIsSending(false);
        }
    }, [loading]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript); // Update the input state with the recognized text
                sendMessage(transcript); // Send the recognized text as a message
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
            };
        }
    }, []);

    useEffect(() => {
        if (!isSending) {
            // Shuffle and select a few suggestions to show
            const shuffledSuggestions = shuffleArray([...allSuggestions]);
            const randomSuggestions = shuffledSuggestions.slice(suggestionIndex, suggestionIndex + 2); // Display 2 suggestions
            setSuggestions(randomSuggestions);
        }
    }, [isSending, suggestionIndex]);

    useEffect(() => {
        if (chatContainerRef.current) {
            // Auto scroll to bottom when messages, typingMessage, or suggestions change
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, typingMessage, suggestions]);
    
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [messages, isSending]);
    
    
    

    const startVoiceInput = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start(); // Start speech recognition
        }
    };
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        let extractedText = '';
    
        if (file) {
            if (file.type.startsWith('image/')) {
                extractedText = await imageToText(file);
            } else if (file.type === 'text/plain') {
                extractedText = await fileToText(file);
            } else {
                console.error('Unsupported file type');
                return;
            }
    
            // Log the extracted text for debugging
            console.log('Extracted Text:', extractedText);
    
            // Send the extracted text to the chat system
            if (extractedText) {
                sendMessage(extractedText);
            } else {
                console.error('No text extracted from the file');
            }
        }
    };
    

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim() !== '') {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const sendMessage = (message) => {
        setMessages([...messages, { sender: 'user', text: message }]);
        onSent(message);
        
        setTimeout(() => {
            receiveAIResponse();
        }, 1000);
        setIsSending(true);
        setInput('');
        updateSuggestions(); // Update suggestions after sending a message
        setShowSuggestions(false); // Hide suggestions while generating response
    };

    const updateSuggestions = () => {
        setSuggestionIndex((prevIndex) => {
            const nextIndex = prevIndex + 2;
            return nextIndex >= allSuggestions.length ? 0 : nextIndex;
        });
    };

    const receiveAIResponse = () => {
        const aiResponse = "Thank you for reaching out! I’m here to help you with all your admission-related queries. Whether you need details about eligibility requirements, application deadlines, scholarship opportunities, or program specifics, just let me know. I can provide guidance on choosing the right course, understanding admission processes, and connecting you with resources to make your application process as smooth as possible. Feel free to ask any questions you have!";
        
        simulateTyping(aiResponse);
    };

    const simulateTyping = (text) => {
        let index = 0; 
        setTypingMessage(''); 
    
       
        const typingInterval = setInterval(() => {
            if (index < text.length) {

                setTypingMessage((prev) => prev + text.charAt(index));
                index++; 
            } else {
                clearInterval(typingInterval);
                setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text }]);
                setIsSending(false); // Stop any sending animation
                setTypingMessage(''); // Clear the typing message
                setShowSuggestions(true); // Show suggestions again after AI response
            }
        }, 13); 
    };
    
    
     
    const handleCardClick = (text) => {
        sendMessage(text);
    };

    const toggleShare = () => {
        setShareOpen(!shareOpen);
    };

    return (
        <div className='flex flex-col min-h-screen relative' style={{ backgroundColor: themeColor }}>
            {/* Navbar */}
            <nav className="flex items-center justify-between p-4 bg-gradient-to-br from-[#1c1e1f] to-[#1c2120] shadow-lg">
                <div className="flex items-center justify-center w-full text-center space-x-4">
                    <div className="text-[#80cbc4] font-bold text-2xl tracking-wide transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-[#80cbc4] bg-clip-text bg-gradient-to-r from-[#ff8a65] to-[#ff7043]">
                        <p style={{ fontFamily: 'Verdana, Geneva, Tahoma, sans-serif', letterSpacing: '2px', fontSize: '30px' }}>
                            DISHA MITRA
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 relative">
                    <span className="material-symbols-outlined text-white cursor-pointer transition-colors duration-300 hover:text-[#80cbc4]" onClick={toggleShare}>
                        ios_share
                    </span>
                    {shareOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-opacity-75 bg-[#000000] z-20">
                            <div className="bg-gradient-to-r from-[#004d40] to-[#00796b] w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-bold mb-4 text-center font-roboto text-white">Share this with others</h2>
                                <ul className="flex flex-col p-2 space-y-4">
                                    <li className="flex items-center space-x-4 cursor-pointer hover:bg-[#0e3630] p-2 rounded-lg">
                                        <img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png" alt="WhatsApp" className="w-8 h-8" />
                                        <p className="text-white font-roboto">WhatsApp</p>
                                    </li>
                                    <li className="flex items-center space-x-4 cursor-pointer hover:bg-[#0e3630] p-2 rounded-lg">
                                        <img src="https://img.icons8.com/ios-filled/50/ffffff/telegram-app.png" alt="Telegram" className="w-8 h-8" />
                                        <p className="text-white font-roboto">Telegram</p>
                                    </li>
                                    <li className="flex items-center space-x-4 cursor-pointer hover:bg-[#0e3630] p-2 rounded-lg">
                                        <img src="https://img.icons8.com/ios-filled/50/ffffff/gmail-new.png" alt="Gmail" className="w-8 h-8" />
                                        <p className="text-white font-roboto">Gmail</p>
                                    </li>
                                </ul>
                                <button className="text-lg w-full mt-4 p-2 bg-[#1a1818] text-white font-bold rounded-lg" onClick={toggleShare}>
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                    <Link to="/userprofile" className="cursor-pointer">
                        <img src={assets.user_icon} alt="User" className="w-10 rounded-full" />
                    </Link>
                </div>
            </nav>
    
            <div className="flex-1 max-w-[900px] mx-auto flex flex-col">
                {!showResult ? (
                    <>
                        <div className="my-12 text-[38px] md:text-[50px] text-[#00796b] font-medium p-1">
                            <p>
                                <span className="bg-gradient-to-r from-[#125151] via-[#187eb9] font-verdana font-bold to-[#0a6e62] bg-clip-text text-transparent">
                                     How can I assist your admission process today?
                                </span>
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                            {[
                                { icon: assets.compass_icon, text: "Explore top NIRF/NAAC-ranked colleges." },
                                { icon: assets.college_icon, text: "Best Colleges for Computer Science Engineering." },
                                { icon: assets.suitcase_icon, text: "Know about Colleges with High placements and better Academic Performance." },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="h-[200px] font-verdana font-bold p-3 bg-[#ffffff] rounded-lg shadow-lg relative cursor-pointer hover:bg-[#74cec3]  border-2 border-[#00796b] hover:shadow-xl transition-all duration-300 ease-in-out"
                                    onClick={() => handleCardClick(item.text)}
                                    style={{ borderLeft: '5px solid #004d40' }} // Adding a left border for a highlight effect
                                >
                                    <p className="text-[#004d40] text-[17px] font-semibold">{item.text}</p>
                                    <img
                                        src={item.icon}
                                        alt={item.text}
                                        className="w-9 p-1 absolute bg-[#00796b] text-white rounded-full bottom-2.5 right-2.5 transition-transform duration-300 ease-in-out transform hover:scale-110" // Added hover effect
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div ref={chatContainerRef} className='flex-1 px-[1%] overflow-y-auto scroll-auto'>
                        {/* Render chat messages */}
                        <div className="my-10 flex flex-col gap-5">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`flex items-start gap-2 sm:gap-5 ${
        msg.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {/* User or AI Avatar */}
      <img
        src={msg.sender === "user" ? assets.user_icon : assets.bbq_icon}
        alt={msg.sender}
        className="w-8 sm:w-10 rounded-full" // Smaller image size for small screens
      />
      
      {/* Message Content */}
      <p
        className={`${
          msg.sender === "user"
            ? "bg-[#000000] text-white font-verdana text-base sm:text-xl font-bold p-2 sm:p-4 rounded-lg shadow-md"
            : "bg-[#1f628c] text-white font-verdana text-base sm:text-xl font-bold p-2 sm:p-4 rounded-lg shadow-md"
        } max-w-[85%] sm:max-w-[70%] break-words`}
      >
        {msg.text}
      </p>
    </div>
                            ))}
                            {/* Display typing effect */}
                            {typingMessage && (
                                <div className="flex items-start gap-5 justify-start">
                                    <img src={assets.bbq_icon} alt="AI" className="w-10 rounded-full" />
                                    <p className="bg-[#1f628c] text-white font-verdana  text-xl p-4 rounded-lg shadow-md max-w-[70%] break-words">
                                        {typingMessage}
                                    </p>
                                </div>
                            )}
                        </div>
                        {/* Response from AI */}
                        {isSending ? (
                            <div className='w-full flex flex-col gap-2.5'></div>
                        ) : (
                            <div>
                                <div className="mt-6 flex gap-4">
                                    {suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            className="bg-[#00796b] text-white font-verdana  text-l px-4 py-2 rounded-full shadow-md hover:bg-[#000000] transition-colors duration-300 text-sm md:text-base lg:text-lg"
                                            onClick={() => sendMessage(suggestion)}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <br></br>
                <br></br>
                <br></br><br></br><br></br><br></br>


 <div className="fixed bottom-1 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 py-2 flex items-center justify-between gap-4 bg-white border-2 border-black shadow-lg rounded-lg sm:rounded-xl">
  {/* Mic Icon */}
  <img
    src={assets.mic_icon}
    alt="Mic"
    className={`w-6 sm:w-7 cursor-pointer ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={() => {
      startVoiceInput();
      playMicSound(); // Function to play the recognition sound
    }}
    disabled={isSending} // Disable when sending
  />

  {/* File Upload */}
  <input
    type="file"
    accept="image/*,text/plain"
    onChange={handleFileUpload}
    className="hidden"
    id="fileUpload"
    disabled={isSending} // Disable when sending
  />
  <label htmlFor="fileUpload" className={`cursor-pointer ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <img src={assets.gallery_icon} alt="Upload" className="w-6 sm:w-7" />
  </label>

  {/* Input Field */}
  <input
    onChange={(e) => setInput(e.target.value)}
    value={input}
    type="text"
    placeholder={isSending ? 'Generating response...' : 'Enter your query here'}
    onKeyDown={handleKeyDown}
    className={`flex-1 bg-transparent border-none font-verdana outline-none p-2 text-sm sm:text-base md:text-lg lg:text-xl text-[#000000] break-words ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={isSending} // Disable input when sending
  />

  <div className="flex items-center gap-3.5">
    {/* Send Icon */}
    <img
      onClick={() => input && sendMessage(input)}
      src={assets.send_icon}
      alt="Send"
      className={`w-5 sm:w-6 cursor-pointer font-bold ${!input || isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={!input || isSending} // Disable button when no input or when sending
    />

    {/* Loader when sending */}
    {isSending && (
  <div className="relative flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
    {/* BBQ Logo with rounded shape and spinning animation */}
    <img 
      src={assets.bbq_icon}
      alt="BBQ Logo" 
      className="w-full h-full rounded-full object-contain animate-spin" 
    />
  </div>
)}        
            </div>
        </div>
            </div>
        </div>
    );
    
};

export default Main;
