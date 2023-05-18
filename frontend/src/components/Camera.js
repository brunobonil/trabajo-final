import React, { useRef, useEffect } from 'react';

const Camera = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const constraints = {
      audio: false,
      video: true
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <video autoPlay ref={videoRef} />
    </div>
  );
};

export default Camera;

//In this example, we create a videoRef using the useRef hook, which will be used to reference the video element. We then use the useEffect hook to request access to the user's camera using getUserMedia(), and set the srcObject of the video element to the camera stream.

//Finally, we render the video element, and pass the videoRef to the ref prop so that it can be accessed in the useEffect hook.
