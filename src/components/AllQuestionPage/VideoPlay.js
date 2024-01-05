import React from 'react'
import PauseIcon from '@mui/icons-material/Pause';
import { useNavigate } from 'react-router-dom';
const VideoPlay = () => {
    const navigate = useNavigate()
    const handlePauseClick = () =>{
    navigate("/Allquestion")
}
  return (
      <div className='container justify-content-center align-items-center mt-5'>
          <h4 className=" w3-wide text-center">Creating Video Introduction for </h4>
          <video
            //   ref={videoRef}
              autoPlay
              playsInline
              className="video-container"
              width="887"
              height="462"
          ></video>
          <button
              className="btn btn-danger button_Ui mx-2 mt-3"
              id="play1"
              onClick={handlePauseClick}
            //   disabled={!isPlaybackEnabled}
          >
           <PauseIcon/>  Stop
          </button>
      </div>
  )
}

export default VideoPlay;