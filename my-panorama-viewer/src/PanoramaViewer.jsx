import React from "react";
import ReactPannellum, { getConfig } from "react-pannellum";

const PanoramaViewer = () => {
  const handleClick = () => {
    console.log(getConfig());
  };

  const config = {
    autoRotate: -2,
  };

  return (
    <div>
      <ReactPannellum
        id="1"
        sceneId="firstScene"
        imageSource="https://i.postimg.cc/Wbqw1WWK/pano1.jpg"
        config={config}
      />
      <div onClick={handleClick}>Click me</div>
    </div>
  );
};

export default PanoramaViewer;
