import { useEffect, useRef, useState } from 'react';


function VideoThumbnail({ videoUrl }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

//   console.log("videoUrl", videoUrl);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous'; // Required for drawing on canvas
    video.currentTime = 1;

    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL();
      setThumbnailUrl(dataUrl);
    });
  }, [videoUrl]);

  return (
    <>
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt="Video cover" className="w-full h-full object-cover" />
      ) : (
        <div className='bg-red-400'>
            {thumbnailUrl}
        </div>
      )}
    </>
  );
}

export default VideoThumbnail;
