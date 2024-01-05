import AllQuestionPage from "./components/AllQuestionPage/AllQuestionPage";
import FinalPage from "./components/FinalPage/FinalPage";
import { ChakraProvider } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFinalVideo } from "./stores/Userslice";
import { useState, useEffect } from "react";
import { Routes, Route, HashRouter } from 'react-router-dom';
import LandingPage from "./components/LandingPage/LandingPage";
import PreviewPage from "./PreviewPage/Previewpage";
import Message from "./components/Message/Message";
import VideoPlay from "./components/AllQuestionPage/VideoPlay";
import { fetchVideoIntroduction } from "./stores/Userslice";
function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const finalVideoData = useSelector((state) => state.videoIntroduction.finalVideoData); // Access final video data from Redux store
  const { data, loading } = useSelector((state) => state.videoIntroduction);

  const dispatch = useDispatch(); // Get the dispatch function
  const [update, setUpdate] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Retrieve the access token from localStorage
    const storedAccessToken = localStorage.getItem('accessToken');

    // Set the accessToken state with the retrieved access token
    setAccessToken(storedAccessToken);

    // Dispatch the fetchFinalVideo action with the retrieved access token if needed
    if (storedAccessToken && !finalVideoData) {
      dispatch(fetchFinalVideo(storedAccessToken))
      dispatch(fetchVideoIntroduction(storedAccessToken))
        .unwrap()
        .then((result) => {
          setUserName(result?.username)
          // Handle success, e.g., show a success message or refresh the page
          console.log(result);
        })
        .catch((error) => {
          // Handle errors, e.g., show an error message
          console.error(error);
        });
    }
  }, [dispatch, finalVideoData]);
console.log(userName)
  return (
    
      <HashRouter>
        <ChakraProvider>
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage userName={userName} />
              }
            />
            <Route
              path="/Allquestion"
            element={finalVideoData ? (<FinalPage />
            ) :(<AllQuestionPage update={update} setUpdate={setUpdate} />)}
          />
          <Route
            path="/Videoplayer"
            element={
              <VideoPlay />
            }
          />
            <Route
              path="/Previewpage"
              element={<PreviewPage update={update} setUpdate={setUpdate} userName={userName} />}
          />
          <Route path="/Message" element={finalVideoData?<FinalPage/>:<Message userName={userName} />} />
          <Route path="/final" element={<FinalPage userName={userName} />} />
          </Routes>
        </ChakraProvider>
      </HashRouter>
  );
}

export default App;
