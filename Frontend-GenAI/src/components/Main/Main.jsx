import { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, themeColor } = useContext(Context);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSent(input);
        }
    };
    return (
        <div className='flex-1 min-h-screen pb-[15vh] relative' style={{ backgroundColor: themeColor }}>
            <div className="flex flex-col md:flex-row items-center justify-between text-[30px] md:text-[45px] p-5 text-[#004d40] bg-gradient-to-r from-[#00897b] to-[#004d40] bg-clip-text text-transparent">
                <p style={{ fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',color:'black' }}>AI-Powered Student Assistance</p>
                <img src={assets.user_icon} alt="User" className="w-10 rounded-full mt-4 md:mt-0" />
            </div>
            <div className="max-w-[900px] mx-auto">
                {!showResult
                    ? <>
                        <div className="my-12 text-[40px] md:text-[56px] text-[#00796b] font-medium p-5">
                            <p><span className="bg-gradient-to-r from-[#004d40] to-[#00796b] bg-clip-text text-transparent">How can I assist your admission process today?</span></p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                            {[
                                { icon: assets.compass_icon, text: "Explore top NIRF/NAAC-ranked colleges." },
                                { icon: assets.bulb_icon, text: "Best Colleges for Computer Science Engineering." },
                                { icon: assets.message_icon, text: " Know about Colleges with High placements and better Academic Performance." },
                            ].map((item, index) => (
                                <div key={index} className="h-[200px] p-4 bg-[#ffffff] rounded-lg shadow-lg relative cursor-pointer hover:bg-[#f1f1f1]">
                                    <p className="text-[#004d40] text-[17px]">{item.text}</p>
                                    <img src={item.icon} alt={item.text} className="w-9 p-1 absolute bg-[#00796b] text-white rounded-full bottom-2.5 right-2.5" />
                                </div>
                            ))}
                        </div>
                    </>
                    : <div className='px-[5%] max-h-[70vh] overflow-y-scroll'>
                        <div className="my-10 flex items-center gap-5">
                            <img src={assets.user_icon} alt="User" className="w-10 rounded-full" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="flex items-start gap-5">
                            <img src={assets.bulb_icon} alt="GenAI" className="w-10 rounded-full" />
                            {loading
                                ? <div className='w-full flex flex-col gap-2.5'>
                                    <hr className="rounded bg-gradient-to-r from-[#4db6ac] to-[#00796b] h-5 animate-[loader_3s_infinite_linear]" />
                                    <hr className="rounded bg-gradient-to-r from-[#4db6ac] to-[#00796b] h-5 animate-[loader_3s_infinite_linear]" />
                                    <hr className="rounded bg-gradient-to-r from-[#4db6ac] to-[#00796b] h-5 animate-[loader_3s_infinite_linear]" />
                                </div>
                                : <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            }
                        </div>
                    </div>
                }
                <div className="absolute bottom-0 w-full max-w-[900px] p-5 mx-auto">
                    <div className="flex items-center justify-between gap-5 bg-[#ffffff] p-2.5 rounded-full shadow-lg">
                        <input 
                            onChange={(e) => setInput(e.target.value)} 
                            value={input} 
                            type="text" 
                            placeholder='Enter your query here' 
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent border-none outline-none p-2 text-[18px] text-[#004d40]"
                        />
                        <div className="flex items-center gap-3.5">
                            <img src={assets.gallery_icon} alt="Gallery" className="w-6 cursor-pointer" />
                            <img src={assets.mic_icon} alt="Mic" className="w-6 cursor-pointer" />
                            {input ? <img onClick={() => onSent(input)} src={assets.send_icon} alt="Send" className="w-6 cursor-pointer" /> : <img src={assets.send_icon} alt="Send" className="w-6 cursor-pointer opacity-50" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
