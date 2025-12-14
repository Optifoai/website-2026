import React, { useEffect, useState } from 'react';

const WebRotate360Viewer = ({ images, carID, car360ImageRes }) => {

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Determine image base
  const imageUrl = `https://optifo-dev.s3.eu-west-2.amazonaws.com/${carID}/magic360/frame-01-01.jpg`;
  // const imageUrl = `/magic360/output/frame-01-01.jpg`;

  const imageCount = car360ImageRes?.magic360?.frameCount || 38;

  const exteriorImages = images || [];

  // Dynamically load scripts and stylesheets
  useEffect(() => {
    const magic360Script = document.createElement('script');
    magic360Script.src = '/magic360/magic360-lincense.js';
    magic360Script.async = true;
    magic360Script.onload = () => setIsScriptLoaded(true);

    const magic360Css = document.createElement('link');
    magic360Css.rel = 'stylesheet';
    magic360Css.href = '/magic360/magic360.css';

    document.head.appendChild(magic360Css);
    document.body.appendChild(magic360Script);

    // Cleanup function to remove the script and stylesheet when the component unmounts
    return () => {
      document.head.removeChild(magic360Css);
      document.body.removeChild(magic360Script);
    };
  }, []);

  // Handle script ready + initialize viewer
  useEffect(() => {
    if (!isScriptLoaded) return;

    if (window.Magic360) {
      window.Magic360.stop('spin-1');
      window.Magic360.start('spin-1');
    }

  }, [isScriptLoaded, images]);

  if (!exteriorImages || exteriorImages.length === 0) {
    return <div className="text-center p-5">No exterior images available for 360° view.</div>;
  }

  return (
    <div className="preview col">
        <div className="app-figure" id="zoom-fig">
          <a
            id="spin-1"
            className="Magic360"
            data-options={`rows: 1; columns:${imageCount}`}
            href={imageUrl}
          >
            <img
              style={{ width: "100%", height: "100%" }}
              src={imageUrl}
              alt="360 Car View"
            />
          </a>
        </div>
    </div>
  );
};

export default WebRotate360Viewer;
