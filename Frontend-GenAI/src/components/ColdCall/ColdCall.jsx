import { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';

const CallInterface = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0); // in seconds
  const [isCalling, setIsCalling] = useState(false); // New state for the "Call" button
  const [bbqIconAnimating, setBbqIconAnimating] = useState(false); // State for BBQ icon animation

  useEffect(() => {
    let timer;
    if (isActive || isCalling) {
      timer = setInterval(() => {
        setCallDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    } else if (!isActive && callDuration !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isActive, isCalling]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleButtonClick = () => {
    if (isActive) {
      setIsActive(false);
      setCallDuration(0); // Reset call duration when stopping the call
    } else {
      setIsActive(true);
    }
  };

  const handleCallClick = () => {
    if (isCalling) {
      setIsCalling(false);
      setCallDuration(0); // Reset call duration when stopping the call
      setBbqIconAnimating(false); // Stop the animation when the call ends
    } else {
      setIsCalling(true);
      setBbqIconAnimating(true); // Start the animation when the call starts
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleHold = () => {
    setIsOnHold(!isOnHold);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
  };

  const handleEndCall = () => {
    setIsActive(false);
    setIsCalling(false); // Reset both isActive and isCalling
    setCallDuration(0);
    setBbqIconAnimating(false); // Stop the animation when the call ends
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#111112] to-[#0f0b0b]  flex flex-col justify-between items-center p-4 text-white crt font-verdana">
      <div className="flex-grow flex flex-col justify-center items-center">
        <button
          onClick={handleButtonClick}
          className={`relative w-[25vw] h-[25vw] max-w-[180px] max-h-[180px] rounded-full flex items-center justify-center
            ${isActive ? 'bg-[#1b7474]' : 'bg-gray-800'}
            transition-transform duration-500 ease-in-out
          `}
          style={{
            boxShadow: isActive
              ? '0 0 30px rgba(27, 116, 116, 0.7), inset 0 0 30px rgba(27, 116, 116, 0.7)'
              : '0 0 15px rgba(27, 116, 116, 0.5)',
          }}
        >
          {/* Disco Vibrating Effect */}
          <div
            className={`absolute inset-0 w-full h-full rounded-full flex items-center justify-center ${
              isActive ? 'disco-vibrate' : ''
            }`}
          >
            <div className="disco-circle"></div>
            <div className="disco-circle delay-1"></div>
            <div className="disco-circle delay-2"></div>
          </div>
          <img
            src={assets.bbq_icon}
            alt="Call Icon"
            className={`w-24 h-24 rounded-full object-contain z-10 ${
              bbqIconAnimating ? 'animate-bbq' : ''
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#176060]  to-[#065c52] shadow-lg w-full fixed bottom-0 left-0 border-t border-gray-800 transition-all duration-300 ease-in-out transform">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={assets.user_icon}
              alt="User"
              className="w-12 h-12 rounded-full bg-black text-white font-bold border-2 border-black"
            />
            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-3 h-3"></div>
          </div>
          <div className="text-xs sm:text-base">
            <div className="font-bold text-white">User</div>
            <div className="text-xs text-gray-300">In Call - {formatTime(callDuration)}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
          <button
            onClick={handleCallClick}
            className={`flex flex-col items-center ${isCalling ? 'animate-pulse' : ''}`}
          >
            <span
              className={`material-symbols-outlined text-black text-2xl sm:text-4xl ${
                isCalling ? 'bg-[#2dd654]' : 'bg-green-500'
              } p-2 sm:p-3 rounded-full`}
            >
              call
            </span>
          </button>
          <button
            onClick={handleMute}
            className="flex flex-col items-center hover:scale-110 transition-transform duration-300"
          >
            <span
              className={`material-symbols-outlined text-black text-2xl sm:text-3xl ${
                isMuted ? 'text-red-500' : ''
              }`}
            >
              mic_off
            </span>
            <span className="text-xs sm:text-sm">Mute</span>
          </button>
          <button
            onClick={handleHold}
            className="flex flex-col items-center hover:scale-110 transition-transform duration-300"
          >
            <span
              className={`material-symbols-outlined text-black text-2xl sm:text-3xl ${
                isOnHold ? 'text-yellow-500' : ''
              }`}
            >
              pause
            </span>
            <span className="text-xs sm:text-sm">Hold</span>
          </button>
          <button
            onClick={handleRecord}
            className="flex flex-col items-center hover:scale-110 transition-transform duration-300"
          >
            <span
              className={`material-symbols-outlined text-black text-2xl sm:text-3xl ${
                isRecording ? 'text-red-500' : ''
              }`}
            >
              fiber_manual_record
            </span>
            <span className="text-xs sm:text-sm">Record</span>
          </button>
          <button
            onClick={handleEndCall}
            className="flex flex-col items-center hover:scale-110 transition-transform duration-300"
          >
            <span className="material-symbols-outlined text-black text-2xl sm:text-4xl bg-red-500 p-2 sm:p-3 rounded-full">
              call_end
            </span>
            <span className="text-xs sm:text-sm">End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
