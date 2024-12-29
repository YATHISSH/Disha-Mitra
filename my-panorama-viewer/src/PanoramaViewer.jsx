import React from "react";
import ReactPannellum, { getConfig } from "react-pannellum";

class PanoramaViewer extends React.Component {
  click() {
    console.log(getConfig());
  }

  render() {
    const config = {
      autoRotate: -2,
    };
    return (
      <div>
        <ReactPannellum
          id="1"
          sceneId="firstScene"
          imageSource="https://i.postimg.cc/4NPJ7Hbt/pano1.jpg"
          config={config}
        />
        <div onClick={this.click}>Click me</div>
      </div>
    );
  } 
}

export default PanoramaViewer;