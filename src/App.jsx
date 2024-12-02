import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import Home from "./Pages/Home";
import Sidenav from "./Components/Sidenav";
import Dashboard from "./Pages/Home";
import VideoAnalysis from "./Pages/VideoAnalysis";
import RecentAnalysis from "./Pages/RecentAnalysis";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/*" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const Main = () => {
  const navigate = useNavigate();
  const [isCollapsed,setIsCollapsed] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  useEffect(() => {
    checkUser();
  }, []);

  const toggleCollapsed = () =>[
    setIsCollapsed(!isCollapsed)
  ]
  // const checkUser = async () => {
  //   const isLoggedIn = await apiService.isLoggedIn();
  //   console.log(isLoggedIn);
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //   }
  //   setIsUserLoggedIn(true)
  // };
  const checkUser = () => {
    setIsUserLoggedIn(true);
  };
  return (
    <>
      <div className="homepages w-full">
        <Sidenav isCollapsed={isCollapsed} toggleCollapsed={toggleCollapsed} />
        <Routes>
          <Route path="/recent" element={<RecentAnalysis isCollapsed={isCollapsed}/>} />
          <Route path="/dashboard" element={<Dashboard isCollapsed={isCollapsed}/>} />
          <Route path="/1" element={<VideoAnalysis isCollapsed={isCollapsed}/>} />
        </Routes>
      </div>
    </>
  );
};

export default App;
