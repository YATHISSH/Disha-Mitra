import { Link } from "react-router-dom";

const scenes = {
  firstScene: {
    id: "firstScene",
    title: "Career Guidance Center",
    description: "An insightful hub for shaping your future and making informed career decisions.",
    imageSource: "https://i.postimg.cc/Wbqw1WWK/pano1.jpg",
  },
  secondScene: {
    id: "secondScene",
    title: "College Entrance",
    description: "The welcoming gateway to an institution of learning and growth.",
    imageSource: "https://i.postimg.cc/J79P4R4j/Whats-App-Image-2024-12-30-at-12-07-27-AM.jpg",
  },
  thirdScene: {
    id: "thirdScene",
    title: "Lift Facilities",
    description: "Modern lift systems for easy and accessible campus navigation.",
    imageSource: "https://i.postimg.cc/KvPV61r1/Whats-App-Image-2024-12-30-at-12-07-28-AM.jpg",
  },
  fourthScene: {
    id: "fourthScene",
    title: "Reception",
    description: "A welcoming space for inquiries and assistance.",
    imageSource: "https://i.postimg.cc/d3bY4gYg/Whats-App-Image-2024-12-30-at-12-07-25-AM-1.jpg",
  },
  fifthScene: {
    id: "fifthScene",
    title: "Innovation Hub",
    description: "A creative space fostering innovation and entrepreneurship.",
    imageSource: "https://i.postimg.cc/qv7kfZph/Whats-App-Image-2024-12-29-at-9-00-03-PM.jpg",
  },
  sixthScene: {
    id: "sixthScene",
    title: "Library",
    description: "A tranquil place to dive into books and expand your knowledge.",
    imageSource: "https://i.postimg.cc/qRN0ttNk/Whats-App-Image-2024-12-29-at-8-59-58-PM.jpg",
  },
  seventhScene: {
    id: "seventhScene",
    title: "Hostel Room",
    description: "Comfortable and spacious rooms designed for student living.",
    imageSource: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Hostel_room.jpg",
  },
  eighthScene: {
    id: "eighthScene",
    title: "Sports Complex",
    description: "A state-of-the-art facility for fitness and sports enthusiasts.",
    imageSource: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Sports_complex.jpg",
  },
  ninthScene: {
    id: "ninthScene",
    title: "Cafeteria",
    description: "A vibrant space to enjoy delicious meals and socialize with peers.",
    imageSource: "https://upload.wikimedia.org/wikipedia/commons/0/04/Cafeteria_in_College.jpg",
  },
};

const PanoramaViewer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#004d40] via-[#00796b] to-[#23374D] text-white font-verdana py-6">
      {/* Navigation Bar */}
      <nav className="bg-[#004d40] p-4 shadow-md">
        <div className="max-w-screen-xl mx-auto flex justify-center items-center">
          <h1 className="text-3xl font-bold text-white">Sri Manakula Vinayagar Engineering College</h1>
        </div>
      </nav>
<br/>
      {/* Content */}
      <h2 className="text-4xl font-bold text-center text-white mb-8">Explore Our College Facilities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 max-w-screen-xl mx-auto">
        {Object.values(scenes).map((scene) => (
          <div
            key={scene.id}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={scene.imageSource}
              alt={scene.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-2">{scene.title}</h2>
              <p className="text-sm text-gray-300 mb-4">{scene.description}</p>
              <Link
                to={`/AR-view/${scene.id}`}
                className="inline-block px-6 py-3 bg-gradient-to-r from-[#FF8A00] to-[#FF4B2B] text-white rounded-full text-lg font-medium shadow-lg hover:from-[#FF4B2B] hover:to-[#FF8A00] transition-all duration-300"
              >
                View Panorama
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanoramaViewer;
