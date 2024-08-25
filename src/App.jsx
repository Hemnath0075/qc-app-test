import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login";
import { useEffect, useState } from "react";
import Sidenav from "./Components/Sidenav";
import Home from "./Pages/Home";
import NewSession from "./Pages/NewSession";
import Monitor from "./Pages/Monitor";
import Dashboard from "./Pages/Dashboard";
import VideoStream from "./Pages/video";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
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
          <Route path="/home" element={<Home isCollapsed={isCollapsed}/>} />
          <Route path="/create-session" element={<NewSession isCollapsed={isCollapsed}/>} />
          <Route path="/session/:sessionId" element={<Monitor isCollapsed={isCollapsed}/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/video" element={<VideoStream/>} />
        </Routes>
      </div>
    </>
  );
};

export default App;
