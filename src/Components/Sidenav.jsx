import React, { useEffect, useState } from "react";
import Logo from "../Assets/unilevertext.svg";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AddIcon from "../Assets/Add.svg";
import EditAnalysis from "../Assets/Chart--custom.svg";
import RecentLogs from "../Assets/recent_logs.svg";
import SVG from "react-inlinesvg";
import CollapsibleImage from "../Assets/collapsible.svg";
import CollapsedImage from "../Assets/collapsedLogo.png";
import LogoutIcon from "../Assets/logout.svg";

// import { apiService } from "../../Services/api_service";

function Sidenav({ isCollapsed, toggleCollapsed }) {
  const navigate = useNavigate();
  const [showCollapsibleBtn,setShowCollapsibleBtn] = useState(false);
  const location = useLocation();
  const isActive = (match, location) => {
    // Check if the current location matches the NavLink's path
    return location.pathname.startsWith(match.url);
  };
  console.log(location.pathname === "/create/session");
  const [sideMenu, setSideMenu] = useState([
    {
      path: "/home",
      name: "Recent QC Sessions",
      icon: <SVG src={RecentLogs} />,
    },
    {
      path: "/dashboard",
      name: "Detailed Analysis",
      icon: <SVG src={EditAnalysis} />,
    },
  ]);

  return (
    <div
      className={`transition-all flex flex-col justify-start items-center border-r-[1px] border-[#E3E8EF] relative  ${
        isCollapsed ? "w-[5vw]" : "w-[25vw]"
      }  h-[100vh] bg-white `}
      onMouseEnter={()=>setShowCollapsibleBtn(true)}
      onMouseLeave={()=>setShowCollapsibleBtn(false)}
    >
      {showCollapsibleBtn && <div className="w-[50px] absolute right-[-25px] top-[40%] z-[1000]">
        <img
          src={CollapsibleImage}
          alt=""
          className={`w-[35px] mt-4 bg-white rounded-[50%] transition-all cursor-pointer ${isCollapsed ? 'rotate-180':'rotate-0'}`}
          onClick={toggleCollapsed}
        />
      </div>}
      {!isCollapsed && <img src={Logo} alt="" className="w-[12vw] mt-6 " />}
      {isCollapsed && (
        <img src={CollapsedImage} alt="" className="w-[12vw] mt-4 p-2" />
      )}
      <div className="flex flex-col justify-between h-full items-start w-full mt-4">
        {!isCollapsed && (
          <div className="flex flex-col gap-4 mt-5 w-[100%] px-3 font-sans justify-start items-start">
            {/* <div className="flex create-qc-menu flex-row justify-start gap-4  items-center px-4 py-3 w-[100%] text-black rounded-[50px]" onClick={()=>navigate('/create-session')}>
            <SVG src={AddIcon} />
            <div className="text-md">New QC Session</div>
          </div> */}
            {sideMenu.map((item, index) => {
              return (
                <>
                  <NavLink
                    to={item.path}
                    key={index}
                    className={`flex flex-row justify-start gap-4 border-2 items-center px-4 py-4 w-[100%] text-black rounded-[50px] `}
                    activeClassName="active"
                    isActive={true}
                  >
                    {item.icon}
                    <div className="text-md">{item.name}</div>
                  </NavLink>
                  {item.submenu && (
                    <div className="pl-8">
                      {item.submenu.map((subItem, subIndex) => (
                        <div className="flex flex-row justify-start gap-2 items-center px-4 py-3 w-[100%] text-white rounded-[50px] ml-2 active cursor-pointer">
                          {subItem.name}
                        </div>
                        // </NavLink>
                      ))}
                    </div>
                  )}
                </>
              );
            })}
          </div>
        )}
        <div className=""></div>
        <div className="flex w-[100%] justify-center items-center mb-4">
          <div
            className={`w-[90%] ${isCollapsed ? 'border-0':'border-2'} rounded-md py-2 text-center cursor-pointer flex justify-center items-center`}
            onClick={() => {
              navigate("/");
              localStorage.removeItem("token");
            }}
          >
            {!isCollapsed && <p>Logout</p>}
            {isCollapsed && (
              <img
                src={LogoutIcon}
                alt=""
                className="w-[40px] bg-white cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidenav;
