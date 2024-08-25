import React from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";

function TagChip({ status }) {
  return (
    <div className="">
      {status === "success" && (
        <div
          className={`rounded-[20px] text-md bg-[#087817] text-white  text-xs w-20 text-center py-[4px] cursor-pointer capitalize`}
        >
          Success
        </div>
      )}
      {status === "analysing" && (
        <div
        className={`rounded-[20px] text-md bg-[#E46D11] text-white border-[1px] w-20 text-xs text-center py-[4px] cursor-pointer capitalize`}
      >
        Analysing
      </div>
      )}
      {status === "error" && (
        <div
        className={`rounded-[20px] text-md bg-[#E41111] text-white border-[1px] w-20 text-xs px-3 text-center py-[4px] cursor-pointer capitalize`}
      >
        Error
      </div>
      )}
      {status === "idle" && <div
          className={`rounded-[20px] text-md bg-[#BCC8C4] text-white border-[1px] w-20 text-xs px-3 text-center py-[4px] cursor-pointer capitalize`}
        >
          Idle
        </div>}
    </div>
  );
}

export default TagChip;
