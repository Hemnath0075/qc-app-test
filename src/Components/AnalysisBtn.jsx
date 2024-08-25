import React from "react";
import Camera from "../Assets/Camera (1).svg";
import { Progress, Spin } from "antd";
import CompletedIcon from "../Assets/completed_icon.svg";
import ErrorAnalyse from "../Assets/error_analyse.svg";
import { LoadingOutlined } from "@ant-design/icons";

function AnalysisBtn({ startAnalyze, label, data, progress , material_code_type ,isReset }) {
  const status = progress === 100 ? "success" : "active";
  // console.log(progress)
  console.log(label,data,progress,material_code_type)
  return (
    <button
      className={`relative cursor-pointer flex flex-row gap-4 w-full py-4 rounded-[10px] text-white text-md justify-center items-center font-[500] ${progress===0 ? 'bg-[#1F36C7]':progress=== -1 ?'bg-[#E41111]':'bg-[#BCC8C4]'}`}
      disabled = {(progress!==0 && progress > 0)? true:false}
      onClick={() => startAnalyze(data,material_code_type)}
    >
      <div className="z-[1000]">
        {progress === 0 ? (
          <img src={Camera} alt="" />
        ) : (progress !== 100 && progress !== -1) ? (
          <Spin indicator={<LoadingOutlined spin style={{ fontSize: 24, color: '#ffffff' }}/>} />
        ) :progress === -1?  (
          <img src={ErrorAnalyse} alt="" width={25} height={25}/>
        ):(<img src={CompletedIcon} alt="" width={25} height={25}/>)}
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <Progress
          type="line"
          percent={progress}
          showInfo={false}
          status={status}
          strokeColor="#1F36C7"
          // strokeWidth={8} // Adjust stroke width to fit within the button
          style={{
            width: "100%",
            height: "100%",
            margin: "0 auto",
            backgroundColor: "transparent",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      </div>
      <p className="z-[1000]">{`${progress === 0 ? 'Analyse':(progress !== 100 && progress !== -1 )?'Analysing':progress === -1  ?'Error in Analysis, ':'Analysed'}  ${progress !== -1 ? label:''} ${progress === -1 ? 'Click here to Retry':''}`}</p>
    </button>
  );
}

export default AnalysisBtn;
