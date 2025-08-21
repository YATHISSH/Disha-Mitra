import  { useState, useEffect } from 'react';
import axios from 'axios';

const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(60 * 30); // 30 minutes timer
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState('');

  // Fetch quiz questions from FastAPI
  const fetchQuiz = async () => {
    try {
      const response = await axios.post('http://localhost:8000/generate-quiz');
      if (response.status === 200 && response.data.botResponse) {
        setQuestions(response.data.botResponse); // Update state with quiz questions
      } else {
        console.error('Failed to fetch quiz questions.');
      }
    } catch (error) {
      console.error('Error fetching quiz questions:', error);  // Log any error in the console
    }
  };

  // Handle user's answer
  const handleAnswerChange = (answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: answer,
    }));
  };

  // Submit answers to backend (or just display results)
  const submitTest = async () => {
    try {
      console.log('User Answers:', userAnswers);
      setIsTestFinished(true); // Set the test to finished
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  // Countdown Timer logic
  useEffect(() => {
    if (timer <= 0) {
      setIsTestFinished(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    fetchQuiz();
  }, []);

  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Next Question Handler
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Previous Question Handler
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Open/Close Confirmation Modal
  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };
  
  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 font-sans">
      <h1 className="text-4xl font-bold text-center text-indigo-500 mb-6">Online Assessment</h1>

      {/* Timer Display */}
      <div className="text-center mb-8 text-xl">
        <h2 className="font-semibold text-yellow-300">Time Remaining: {formatTime(timer)}</h2>
      </div>

      {/* Display Current Question */}
      <form onSubmit={(e) => e.preventDefault()}>
        {questions.length === 0 ? (
          <p className="text-center text-gray-400">Loading quiz questions...</p>
        ) : (
          <div className="mb-6 p-6 bg-gray-800 rounded-lg shadow-xl">
            <h3 className="text-2xl font-semibold text-indigo-400 mb-6">{questions[currentQuestionIndex].question}</h3>
            <div className="space-y-4">
              {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center space-x-4 cursor-pointer">
                  <input
                    type="radio"
                    name={`question_${currentQuestionIndex}`}
                    value={option}
                    checked={userAnswers[currentQuestionIndex] === option}
                    onChange={() => handleAnswerChange(option)}
                    className="form-radio text-indigo-600 h-5 w-5 transition duration-300 ease-in-out"
                  />
                  <span className="text-lg text-white">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Navigation and Submit Buttons */}
      <div className="text-center mt-8 space-x-6">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-8 py-3 bg-gray-700 text-white text-lg font-semibold rounded-full hover:bg-gray-600 transition duration-300 transform hover:scale-105 disabled:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={nextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-500 transition duration-300 transform hover:scale-105 disabled:bg-gray-400"
        >
          Next
        </button>
      </div>

      {/* Submit Button with Confirmation */}
      <div className="text-center mt-8">
        <button
          onClick={openConfirmationModal}
          className="px-10 py-4 bg-green-600 text-white text-lg font-semibold rounded-full hover:bg-green-500 transition duration-300 transform hover:scale-105"
        >
          Submit Test
        </button>
      </div>

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 animate__animated animate__fadeIn">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Confirm Submission</h3>
            <p className="text-gray-700 mb-6">To submit your test, type "confirm" below:</p>
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              className="w-full p-3 bg-gray-200 rounded-lg text-lg mb-6"
              placeholder="Type 'confirm' to submit"
            />
            <div className="flex justify-between">
              <button
                onClick={submitTest}
                disabled={confirmationInput.toLowerCase() !== 'confirm'}
                className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-full hover:bg-green-500 transition duration-300"
              >
                Yes, Submit
              </button>
              <button
                onClick={closeConfirmationModal}
                className="px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-full hover:bg-red-500 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Finished Modal */}
      {isTestFinished && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 animate__animated animate__fadeIn">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Test Submitted Successfully!</h3>
            <p className="text-gray-600">Thank you for completing the assessment. Your responses have been recorded.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;
