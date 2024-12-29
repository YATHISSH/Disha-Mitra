
import { useParams } from "react-router-dom";
import ReactPannellum from "react-pannellum";

const scenes = {
  firstScene: {
    id: "firstScene",
    title: "Career Guidance Center",
    imageSource: "https://i.postimg.cc/Wbqw1WWK/pano1.jpg",
  },
  secondScene: {
    id: "secondScene",
    title: "Placement Training Hall",
    imageSource: "https://i.postimg.cc/j2vwNjKZ/ppic.jpg",
  },
  thirdScene: {
    id: "thirdScene",
    title: "Interview Preparation Lab",
    imageSource: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Interview_room.jpg",
  },
  fourthScene: {
    id: "fourthScene",
    title: "Research & Development Lab",
    imageSource: "https://upload.wikimedia.org/wikipedia/commons/9/95/Research_lab.jpg",
  },
  fifthScene: {
    id: "fifthScene",
    title: "Innovation Hub",
    imageSource: "https://i.postimg.cc/qv7kfZph/Whats-App-Image-2024-12-29-at-9-00-03-PM.jpg",
  },
  sixthScene: {
    id: "sixthScene",
    title: "Library",
    description: "A place for knowledge and study.",
    imageSource: "https://i.postimg.cc/qRN0ttNk/Whats-App-Image-2024-12-29-at-8-59-58-PM.jpg",
  },
  seventhScene: {
    id: "seventhScene",
    title: "Hostel Room",
    description: "Comfortable and spacious hostel rooms.",
    imageSource: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Hostel_room.jpg",
  },
  eighthScene: {
    id: "eighthScene",
    title: "Sports Complex",
    description: "A state-of-the-art sports facility.",
    imageSource: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Sports_complex.jpg",
  },
  ninthScene: {
    id: "ninthScene",
    title: "Cafeteria",
    description: "A place for food and social interaction.",
    imageSource: "https://upload.wikimedia.org/wikipedia/commons/0/04/Cafeteria_in_College.jpg",
  },
};


const ScenePage = () => {
  const { sceneId } = useParams();
  const scene = scenes[sceneId];

  if (!scene) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-2xl">Scene Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#004d40] via-[#00796b] to-[#23374D] text-white flex flex-col items-center justify-center py-6 px-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6">{scene.title}</h1>
        
        {/* Container for the panorama */}
        <div className="relative w-full max-w-[90vw] lg:max-w-[80vw] h-[60vh] max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex justify-center items-center">
          <ReactPannellum
            id={scene.id}
            sceneId={scene.id}
            imageSource={scene.imageSource}
            config={{ autoRotate: -3 }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description below the panoramic view */}
        <div className="mt-6 text-center max-w-prose">
          <p className="text-lg sm:text-xl font-medium text-gray-200">
            Explore this space in full 360° panoramic view. Use your mouse or touchpad to navigate around!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScenePage;
