import React, { useEffect, useRef, useState } from "react";
import TopNav from "../Components/TopNav";
import CloseIconBtn from "../Assets/Close (1).svg";
import NextArrow from "../Assets/Arrow--right.svg";
import Select from "react-select";

import WeighingImage from "../Assets/weighing_machine.jpeg";
import PerforationImage from "../Assets/perforation.jpeg";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Image from "../Assets/Frame 9267.svg";
// import analyzed from "../Assets/Frame 9267.svg";
import CloseIcon from "@mui/icons-material/Close";
import Camera from "../Assets/Camera (1).svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Jam from '../Assets/jam.mp4';

import ErrorImage from "../Assets/error.svg";
import RefreshIcon from "../Assets/refresh.svg";
import { Modal, Radio, Spin, Table } from "antd";

import { useNavigate, useParams } from "react-router-dom";
import { Endpoint, apiService } from "../Services/apiService";
import { LoadingOutlined } from "@ant-design/icons";
import useWebSocket from "react-use-websocket";
import AnalysisBtn from "../Components/AnalysisBtn";
import Tag from "../Components/Tag";
import TagChip from "../Components/Tag";
import { CleaningServices } from "@mui/icons-material";


const Placeholder = (props) => {
  return (
    <div
      className="flex flex-row basis-[33.3%] gap-1 justify-center items-center"
      onClick={(event) => {
        event.stopPropagation(); // Stop click event from bubbling up
        // restartSession(item);
      }}
    >
      <img src={RefreshIcon} alt="" />
      <p className="text-md">Reset</p>
    </div>
  );
};

function Monitor({ isCollapsed }) {
  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState();
  const [tablesData, setTablesData] = useState();
  const [analyzeBtnId, setAnalyzeBtnId] = useState();
  const [sessionTypeIndex, setSessionTypeIndex] = useState(0);
  const [colorValue, setColorValue] = useState();
  const [perfumeValue, setPerfumeValue] = useState();

  const [productType, setProductType] = useState("Sachet");
  const navigate = useNavigate();
  const [video, setVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isImage, setIsImage] = useState(false);
  const { sessionId } = useParams();
  const [individualPerforationTable, setIndividualPerforationTable] =
    useState();
  // const [perforationTable, setPerforationTable] = useState();
  const perforationRefTable = [
    {
      title: <div className="text-[#000000] text-start ml-4">Line Items</div>,
      dataIndex: "name",
      width: "10vw",
      key: "name",
      render: (_, { name }) => (
        <>
          <div className="w-full flex justify-start ml-4 items-center text-[#4B5565]">
            <p>{name}</p>
          </div>
        </>
      ),
    },
    {
      title: <div className="text-[#000000]">Inference</div>,
      dataIndex: "detected",
      width: "10vw",
      render: (_, { detected }) => (
        <>
          <div className="w-full flex justify-center items-center text-[#898D93]">
            <p>{detected.slice(0, 4)}</p>
          </div>
        </>
      ),
    },
    {
      title: <div className="text-[#000000]">Reference</div>,
      dataIndex: "expected",
      width: "10vw",
      render: (_, { expected }) => (
        <>
          <div className="w-full flex justify-center items-center text-[#898D93]">
            <p>{expected}</p>
          </div>
        </>
      ),
    },
  ];
  const IndividualPerforationRefTable = [
    {
      title: <div className="text-[#000000] text-start ml-4">Items</div>,
      dataIndex: "name",
      width: "5vw",
      key: "name",
      render: (_, { name }) => (
        <>
          <div className="w-full flex justify-start ml-4 items-center text-[#4B5565]">
            <p>{name}</p>
          </div>
        </>
      ),
    },
    {
      title: <div className="text-[#000000]">Detected</div>,
      dataIndex: "detected",
      width: "5vw",
      render: (_, { detected }) => (
        <>
          <div className="w-full flex justify-center items-center text-[#898D93]">
            <p>{detected}</p>
          </div>
        </>
      ),
    },
  ];
  const sessionTable = [
    {
      title: <div className="text-[#000000] text-start ml-4">Units</div>,
      dataIndex: "name",
      width: "12vw",
      key: "name",
      render: (_, { name }) => (
        <>
          <div className="w-full flex justify-start ml-4 items-center text-[#4B5565]">
            <p>{name}</p>
          </div>
        </>
      ),
    },
    {
      title: "Coding",
      dataIndex: "codingStatus",
      width: "7vw",
      render: (_, { codingStatus }) => (
        <>
          <div className="w-full flex justify-center items-center">
            <div
              className={`w-[25px] h-[25px]  text-white rounded-[50px] flex justify-center items-center ${
                codingStatus ? "bg-[#167a48]" : "bg-[#b42318]"
              }`}
            ></div>
          </div>
        </>
      ),
    },
    {
      title: "Barcode",
      dataIndex: "barcodeStatus",
      width: "7vw",
      render: (_, { barcodeStatus }) => (
        <>
          <div className="w-full flex justify-center items-center">
            <div
              className={`w-[25px] h-[25px]  text-white rounded-[50px] flex justify-center items-center ${
                barcodeStatus ? "bg-[#167a48]" : "bg-[#b42318]"
              }`}
            ></div>
          </div>
        </>
      ),
    },
    {
      title: "Material Code",
      dataIndex: "materialStatus",
      width: "7vw",
      render: (_, { materialStatus }) => (
        <>
          <div className="w-full flex justify-center items-center">
            <div
              className={`w-[25px] h-[25px]  text-white rounded-[50px] flex justify-center items-center ${
                materialStatus ? "bg-[#167a48]" : "bg-[#b42318]"
              }`}
            ></div>
          </div>
        </>
      ),
    },
  ];
  const columns = [
    {
      title: <div className="text-[#000000] text-start ml-4">Line Items</div>,
      dataIndex: "name",
      width: "10vw",
      key: "name",
      render: (_, { name }) => (
        <>
          <div className="w-full flex justify-start ml-4 items-center text-[#4B5565]">
            <p>{name}</p>
          </div>
        </>
      ),
    },
    {
      title: <div className="text-[#000000]">Detected</div>,
      dataIndex: "detected",
      width: "10vw",
      render: (_, { detected }) => (
        <>
          <div className="w-full flex justify-center items-center text-[#898D93]">
            <p>{detected === null ? "-" : detected}</p>
          </div>
        </>
      ),
    },
    {
      title: <div className="text-[#000000]">Reference</div>,
      dataIndex: "expected",
      width: "10vw",
      render: (_, { expected }) => (
        <>
          <div className="w-full flex justify-center items-center text-[#898D93]">
            <p>{expected}</p>
          </div>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "7vw",
      render: (_, { status }) => (
        <>
          <div className="w-full flex justify-center items-center">
            <div
              className={`w-[25px] h-[25px]  text-white rounded-[50px] flex justify-center items-center ${
                status ? "bg-[#167a48]" : "bg-[#b42318]"
              }`}
            ></div>
          </div>
        </>
      ),
    },
  ];
  const othersColumns = [
    {
      title: <div className="text-[#000000] text-start ml-4">Line Items</div>,
      dataIndex: "name",
      width: "10vw",
      key: "name",
      render: (_, { name }) => (
        <>
          <div className="w-full flex justify-start ml-4 items-center text-[#4B5565]">
            <p>{name}</p>
          </div>
        </>
      ),
    },
    {
      title: "Enter Status",
      dataIndex: "status",
      width: "10vw",
      render: (_, { id, unitIndex }, index) => (
        <>
          <div className="w-full flex flex-row justify-center items-center">
            <Radio.Group
              onChange={(e) => onChange(id, e, unitIndex, index)}
              value={tablesData[unitIndex][sessionTypeIndex][0][index].detected}
              className="flex flex-row"
            >
              <Radio value={"1"}>Yes</Radio>
              <Radio value={"0"}>No</Radio>
            </Radio.Group>
          </div>
        </>
      ),
    },
    {
      title: <div className="text-[#000000]">Reference</div>,
      dataIndex: "expected",
      width: "10vw",
      render: (_, { expected }) => (
        <>
          <div className="w-full flex justify-center items-center text-[#898D93]">
            <p>{expected === "1" ? "Yes" : "No"}</p>
          </div>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "7vw",
      render: (_, { status }) => (
        <>
          <div className="w-full flex justify-center items-center">
            <div
              className={`w-[25px] h-[25px]  text-white rounded-[50px] flex justify-center items-center ${
                status ? "bg-[#167a48]" : "bg-[#b42318]"
              }`}
            ></div>
          </div>
        </>
      ),
    },
  ];
  const [sessionData, setSessionData] = useState();
  console.log(sessionData);

  const [image, setImage] = useState(null);
  const { lastMessage } = useWebSocket(`ws://localhost:8000/frame/1/get`, {
    onOpen: () => console.log("connected"),
    onMessage: handleEvent,
  });
  function handleEvent(e) {
    // console.log(e);
    setImage(e.data);
  }

  const correctLabels = (item) => {
    if (item.includes("_")) {
      // Remove the underscore and return the modified string
      item = item.replace(/_/g, " ");
      return item.charAt(0).toUpperCase() + item.slice(1);
    } else {
      // Capitalize the first letter of the string
      return item.charAt(0).toUpperCase() + item.slice(1);
    }
  };

  const generateTableData = (sessionData, propertyLabels) => {
    let tablesData = [];

    sessionData?.units.map((item, unitIndex) => {
      console.log(item.properties);
      tablesData[unitIndex] = [];
      console.log(propertyLabels);
      propertyLabels.map((label, index) => {
        let filteredProperties;
        if (
          label === "others" ||
          label === "coding" ||
          label === "material_code" ||
          label === "perforation"
        ) {
          filteredProperties = item.properties.filter(
            (prop) => prop.type === label
          );
        } else {
          filteredProperties = item.properties.filter(
            (prop) => prop.label === label
          );
        }
        console.log(filteredProperties);
        // Check if all filtered properties have matching value and detected_value
        let propertyData = [];
        let individualPerforation = [];
        filteredProperties.map((propertyItem) => {
          if (propertyItem.type === "others") {
            propertyData.push({
              id: propertyItem.id,
              name: propertyItem.label,
              value: propertyItem.value,
              unitIndex: unitIndex,
              detected: propertyItem.detected_value,
              expected: propertyItem.value,
              status: propertyItem.verdict ? true : false,
              analyzeStatus: propertyItem.status,
            });
          } else {
            console.log(propertyItem.label);
            console.log(propertyItem.label);
            if (propertyItem.label !== "Raw") {
              propertyData.push({
                name: propertyItem.label,
                detected: propertyItem.detected_value
                  ? propertyItem.detected_value
                  : "-",
                expected: propertyItem.value ? propertyItem.value : "-",
                status: propertyItem.verdict ? true : false,
                analyzeStatus: propertyItem.status,
              });
            } else {
              console.log("the label raw is ", propertyItem.detected_value);
              console.log("splitted", propertyItem?.detected_value?.split(","));
              propertyItem?.detected_value?.split(",").map((item, index) => {
                console.log("individual raw", item);
                individualPerforation.push({
                  name: (index + 1).toString(),
                  detected: item,
                  // expected: propertyItem.value,
                  // status: propertyItem.verdict ? true : false,
                  // analyzeStatus: propertyItem.status,
                });
              });
            }
          }
        });
        console.log("perforation", individualPerforation);
        if (individualPerforation.length > 0) {
          setIndividualPerforationTable(individualPerforation);
        }
        // setIndividualPerforationTable(individualPerforation);
        tablesData[unitIndex][index] = [];
        tablesData[unitIndex][index].push(propertyData);
      });
      // console.log(propertyItem);
      // congratsTable.push(propertyItem);
    });
    console.log(tablesData);
    // console.log(tablesData[0][3][0][0].detected);
    setTablesData(tablesData);
    // let codingTable = [];
    // let barcodeTable = [];
    // let materialTable = [];
    // let weightTable = [];

    // let perforationTable = [];
    // sessionData?.units.map((item) => {
    //   codingTable.push([
    //     {
    //       name: "Price",
    //       detected: item.det_out.price,
    //       expected: sessionData.det_in.price,
    //       status: item.det_out.price === sessionData.det_in.price,
    //       user: "10/10/2020",
    //     },
    //     {
    //       name: "Manufactured Date",
    //       detected: item.det_out.md,
    //       expected: sessionData.det_in.md,
    //       status: item.det_out.md === sessionData.det_in.md,
    //       user: "10/10/2024",
    //     },
    //     {
    //       name: "Expiry Date",
    //       detected: item.det_out.ed,
    //       expected: sessionData.det_in.ed,
    //       status: item.det_out.ed === sessionData.det_in.ed,
    //       user: "10/10/2024",
    //     },
    //     {
    //       name: "Batch Code",
    //       detected: item.det_out.batch_code,
    //       expected: sessionData.det_in.batch_code,
    //       status: item.det_out.batch_code === sessionData.det_in.batch_code,
    //       user: "10/10/2024",
    //     },
    //   ]);
    //   barcodeTable.push([
    //     {
    //       name: "Barcode",
    //       detected: item.det_out.barcode,
    //       expected: sessionData.det_in.barcode,
    //       status: item.det_out.barcode === sessionData.det_in.barcode,
    //       user: "10/10/2024",
    //     },
    //   ]);
    //   weightTable.push([
    //     {
    //       name: "Weight",
    //       detected: "1.12",
    //       expected: "1.10-1.15",
    //       status: item.det_out.barcode === sessionData.det_in.barcode,
    //       user: "10/10/2024",
    //     },
    //   ]);
    //   perforationTable.push([
    //     {
    //       name: "Perforation",
    //       detected: item.det_out.barcode,
    //       expected: sessionData.det_in.barcode,
    //       status: item.det_out.barcode === sessionData.det_in.barcode,
    //       user: "10/10/2024",
    //     },
    //   ]);

    //   materialTable.push([
    //     {
    //       name: "Front Code",
    //       detected: item.det_out.mc_front,
    //       expected: sessionData.det_in.mc_front,
    //       status: item.det_out.mc_front === sessionData.det_in.mc_front,
    //       user: "10/10/2024",
    //     },
    //     {
    //       name: "Back Code",
    //       detected: item.det_out.mc_back,
    //       expected: sessionData.det_in.mc_back,
    //       status: item.det_out.mc_back === sessionData.det_in.mc_back,
    //       user: "10/10/2024",
    //     },
    //   ]);
    // });
    // console.log(codingTable);
    // setCodingTableData(codingTable);
    // setBarcodeTableData(barcodeTable);
    // setMaterialCodeTableData(materialTable);
    // // setOthersTableData(othersTable);
    // setWeightTableData(weightTable);
    // setPerforationTableData(perforationTable);
  };

  // TODO: REMOVE THIS STATE

  const [isError, setIsError] = useState(null);

  const [sessionType, setSessionType] = useState();

  const [othersTableData, setOthersTableData] = useState();

  const [congratsTable, setCongratsTable] = useState();

  const onChange = async (id, e, unitIndex, index) => {
    // console.log(othersTableData[index][0].value)
    // console.log("radio checked", e.target.value);
    console.log(index, unitIndex);
    console.log(e.target.value);
    let endpoint = Endpoint.UPDATE_MANUAL_ANALYSIS.replace("{unit_id}", id);
    const res = await apiService.patch(endpoint, {
      detection_value: e.target.value,
    });

    console.log(res);
    if (res.status === 205) {
      // toast.success(`Adding to QC Session`);
      let data = tablesData.map((item, index1) => {
        if (index1 === unitIndex) {
          // item[sessionTypeIndex][0][index].detected = e.target.value
          console.log(item);
          item[sessionTypeIndex][0][index].detected = e.target.value;
          return item;
        } else {
          return item;
        }
      });
      // console.log(data)
      // tablesData[unitIndex][sessionTypeIndex][0][index].detected = e.target.value
      setTablesData(data);
      // console.log("updated")
    }
    // setColorValue(e.target.value);
  };
  console.log(othersTableData);
  const [open, setOpen] = useState(false);
  const handleOk = () => {
    // setModalText("The modal will be closed after two seconds");
    // setConfirmLoading(true);
    // setTimeout(() => {
    setOpen(false);
    // navigate("/home");
    // setIsError(!isError);
    // setConfirmLoading(false);
    // }, 2000);
  };
  const handleSuccessSubmit = () => {
    setOpen(false);
    navigate("/home");
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
    // setIsError(!isError);
  };

  const restartSession = async (unit) => {
    const updatedSessionData = {
      ...sessionData,
      units: sessionData.units.map((eachUnit) => {
        // Check if eachUnit matches the item you want to update
        if (eachUnit === unit) {
          return {
            ...eachUnit,
            properties: eachUnit.properties.map((propertyItem) => {
              if (
                sessionType === propertyItem.label ||
                sessionType === propertyItem.type
              ) {
                return {
                  ...propertyItem,
                  progress_percentage: 0,
                };
                // }
              }
              return propertyItem;
            }),
          };
        }
        // Return eachUnit unchanged if it does not match item
        return eachUnit;
      }),
    };
    setSessionData(updatedSessionData);
  };

  const getAllUnitsSession = async () => {
    let endpoint = Endpoint.GET_ALL_UNITS_SESSION.replace(
      "{session_id}",
      sessionId
    );
    const res = await apiService.get(endpoint);
    console.log(res);
    let labels = [];
    let properties = [];
    res.data.data?.properties.map((item, index) => {
      if (
        item.type === "others" ||
        item.type === "coding" ||
        item.type === "material_code" ||
        item.type === "perforation"
      ) {
        labels.push(item.type);
      } else {
        labels.push(item.label);
      }
    });
    setSessionType(labels[0]);
    const propertyLabels = [...new Set(labels)];
    console.log(propertyLabels);
    propertyLabels.forEach((label) => {
      const item = res.data?.data?.properties.find(
        (item) => label === item.type || label === item.label
      );
      if (item) {
        properties.push({ label: label, type: item.type });
      }
    });
    console.log(properties);
    setSessionType(properties[0].type);
    setProperties(properties);

    res?.data?.data?.units.map((eachUnit) => {
      eachUnit.properties.map((item) => {
        item.progress_percentage = getProgressPercentage(item.status);
      });
    });
    console.log(res.data.data);
    setSessionData(res.data.data);
    generateTableData(res.data.data, propertyLabels);
    // sessionData?.units.map((item, index) => {
    //   othersTable.push([
    //     {
    //       name: "Is the color matched ?",
    //       id: "Color",
    //       value: null,
    //       unitIndex: index,
    //       detected: item.det_out.barcode,
    //       expected: "Blue",
    //       status: item.det_out.barcode === sessionData.det_in.barcode,
    //       user: "10/10/2024",
    //     },
    //     {
    //       name: "Is the perfume/flavour correct ?",
    //       id: "Perfume",
    //       value: null,
    //       unitIndex: index,
    //       detected: item.det_out.barcode,
    //       expected: "Blue",
    //       status: item.det_out.barcode === sessionData.det_in.barcode,
    //       user: "10/10/2024",
    //     },
    //   ]);
    // });
    // setOthersTableData(othersTable);
    setIsLoading(false);
    getAllUnitsSessionLoop();
  };

  const getAllUnitsSessionLoop = async () => {
    setInterval(async () => {
      let endpoint = Endpoint.GET_ALL_UNITS_SESSION.replace(
        "{session_id}",
        sessionId
      );
      const res = await apiService.get(endpoint);
      console.log(res);
      console.log(res);
      let labels = [];
      // let properties = [];
      res.data.data?.properties.map((item, index) => {
        if (
          item.type === "others" ||
          item.type === "coding" ||
          item.type === "material_code" ||
          item.type === "perforation"
        ) {
          labels.push(item.type);
        } else {
          labels.push(item.label);
        }
      });
      // setSessionType(labels[0]);
      const propertyLabels = [...new Set(labels)];
      console.log(propertyLabels);
      res?.data?.data?.units.map((eachUnit) => {
        eachUnit.properties.map((item) => {
          item.progress_percentage = getProgressPercentage(item.status);
        });
      });
      setSessionData(res.data.data);
      generateTableData(res.data.data, propertyLabels);
    }, 1000);
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case "idle":
        return 0;
      case "success":
        return 100;
      case "analysing":
        return 90;
      case "error":
        return -1;
      case "ready":
        return 10;
      default:
        return 1;
    }
  };

  const generateCongratsTable = () => {
    let congratsTable = [];
    console.log(sessionData);
    sessionData?.units.map((item) => {
      congratsTable.push({
        name: `Unit ${item.id}`,
        codingStatus:
          item.det_out.price === sessionData.det_in.price &&
          item.det_out.md === sessionData.det_in.md &&
          item.det_out.ed === sessionData.det_in.ed &&
          item.det_out.batch_code === sessionData.det_in.batch_code,
        barcodeStatus: item.det_out.barcode === sessionData.det_in.barcode,
        materialStatus:
          item.det_out.mc_front === sessionData.det_in.mc_front &&
          item.det_out.mc_back === sessionData.det_in.mc_back,
      });
    });
    console.log(congratsTable);
    setCongratsTable(congratsTable);
  };

  const endSession = async () => {
    // generateCongratsTable();
    // setOpen(true);

    let endpoint = Endpoint.END_SESSION.replace("{qc_session_id}", sessionId);
    const res = await apiService.patch(endpoint);
    console.log(res);
    if (res.status === 205) {
      toast.success("QC Session Submitted Succesfully");
      setTimeout(() => {
        navigate("/home");
      }, 3000);
      setOpen(true);
    } else if (res.response.status === 412) {
      setIsError(true);
      setOpen(true);
    }
  };

  const startAnalyze = async (unit, material_code_type) => {
    console.log("start analyze for id ", unit);
    console.log(sessionType);
    let property_unit_id;
    unit.properties.forEach((item) => {
      console.log(item);
      if (material_code_type === "Front" || material_code_type === "Back") {
        console.log(material_code_type);
        if (
          item.label.toUpperCase().includes("FRONT") &&
          material_code_type === "Front"
        ) {
          property_unit_id = item.id;
        } else if (
          item.label.toUpperCase().includes("BACK") &&
          material_code_type === "Back"
        ) {
          property_unit_id = item.id;
        }
      } else if (item.type === sessionType || item.label === sessionType) {
        console.log(item);
        property_unit_id = item.id;
      }
    });
    console.log(property_unit_id);
    // sessionData.units.map((eachUnit)=>{
    //   eachUnit.properties.map((propertyItem)=>{
    //     if(sessionType === propertyItem.label || sessionType === propertyItem.type){
    //       console.log(propertyItem)
    //       propertyItem.progress_percentage = 90
    //     }
    //   })
    // })
    // const intervalId = setInterval(() => {

    // }, 2000);
    let endpoint = Endpoint.START_ANALYZE_SESSION.replace(
      "{session_id}",
      property_unit_id
    );
    const res = await apiService.patch(endpoint);
    console.log(res);
    if (res.status === 205) {
      const updatedSessionData = {
        ...sessionData,
        units: sessionData.units.map((eachUnit) => {
          // Check if eachUnit matches the item you want to update
          if (eachUnit === unit) {
            return {
              ...eachUnit,
              properties: eachUnit.properties.map((propertyItem) => {
                if (
                  sessionType === propertyItem.label ||
                  sessionType === propertyItem.type
                ) {
                  // if(propertyItem.progress_percentage >= 90){
                  //   clearInterval(intervalId)
                  //   return {
                  //     ...propertyItem,
                  //   };
                  // }
                  // else{
                  if (material_code_type) {
                    if (propertyItem.label === material_code_type) {
                      return {
                        ...propertyItem,
                        progress_percentage: 90,
                      };
                    }
                  } else {
                    return {
                      ...propertyItem,
                      progress_percentage: 90,
                    };
                  }
                  // }
                }
                return propertyItem;
              }),
            };
          }
          // Return eachUnit unchanged if it does not match item
          return eachUnit;
        }),
      };
      console.log(updatedSessionData);
      setSessionData(updatedSessionData);
      // toast.success(`Started Analyzing`);
    }
  };

  console.log(tablesData);

  // const getProgress = (unit) =>{
  //   // unit.properties.forEach((item) => {
  //   //   console.log(item)
  //   //   if (item.type === sessionType || item.label === sessionType) {
  //   //     switch()

  //   //   }
  //   // });
  //   return 10
  // }

  const getPropertyProgress = (unit, material_code_type) => {
    if (material_code_type === "Front" || material_code_type === "Back") {
      const item = unit.properties.find(
        (item) =>
          (sessionType === item.type || sessionType === item.label) &&
          item.label === material_code_type
      );
      if (item) {
        return item.progress_percentage;
      }
    } else {
      const item = unit.properties.find(
        (item) => sessionType === item.type || sessionType === item.label
      );
      if (item) {
        return item.progress_percentage;
      }
    }
  };

  const [materialCodeRetry, setMaterialCodeRetry] = useState();

  useEffect(() => {
    getAllUnitsSession();
  }, []);
  // useEffect(()=>{
  //   console.log("refresh")
  // },[tablesData])

  return (
    <div
      className={`flex  h-[100vh] flex-col w-full bg-[#f7f7f7] overflow-auto relative ${
        isCollapsed ? "w-[95vw]" : "w-[75vw]"
      }`}
    >
      {/* <TopNav /> */}
      {isLoading && (
        <Spin
          // spinning={isLoading}
          size="large"
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 34,
              }}
              spin
            />
          }
          className="spinning_indicator"
        />
      )}
      <div className="p-8">
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row justify-between items-center w-full">
            <div
              className="flex flex-row gap-4 bg-white px-4 py-2 rounded-[10px] border-2 border-[#CDD5DF] cursor-pointer"
              onClick={() => navigate("/home")}
            >
              <p>Close Session</p>
              <img src={CloseIconBtn} alt="" width={20} height={20} />
            </div>
            <div className="flex flex-row justify-between items-center p-1 rounded-[20px] bg-white border-2 border-[#CDD5DF]">
              {properties?.map((item, index) => {
                return (
                  <div
                    className={`rounded-[20px] ${
                      sessionType === item.type
                        ? "bg-[#1F36C7] text-white"
                        : "bg-white text-black"
                    } px-3 text-center py-[10px] w-36 cursor-pointer capitalize`}
                    onClick={() => {
                      setSessionType(item.type);
                      setSessionTypeIndex(index);
                    }}
                  >
                    {correctLabels(item.label)}
                  </div>
                );
              })}
              {/* <div
                className={`rounded-[20px] ${
                  sessionType === "Barcode"
                    ? "bg-[#1F36C7] text-white"
                    : "bg-white text-black"
                } px-3 text-center py-[10px] w-36 cursor-pointer`}
                onClick={() => {
                  setSessionType("Barcode");
                }}
              >
                Barcode
              </div>
              {productType !== "Sachet" && (
                <div
                  className={`rounded-[20px] ${
                    sessionType === "MaterialCode"
                      ? "bg-[#1F36C7] text-white"
                      : "bg-white text-black"
                  } px-3 text-center py-[10px] w-36 cursor-pointer`}
                  onClick={() => {
                    setSessionType("MaterialCode");
                  }}
                >
                  Material Code
                </div>
              )}
              {productType !== "Sachet" && (
                <div
                  className={`rounded-[20px] ${
                    sessionType === "Coding"
                      ? "bg-[#1F36C7] text-white"
                      : "bg-white text-black"
                  } px-3 text-center py-[10px] w-36 cursor-pointer`}
                  onClick={() => {
                    setSessionType("Coding");
                  }}
                >
                  Coding
                </div>
              )}
              {productType === "Sachet" && (
                <div
                  className={`rounded-[20px] ${
                    sessionType === "Perforation"
                      ? "bg-[#1F36C7] text-white"
                      : "bg-white text-black"
                  } px-3 text-center py-[10px] w-36 cursor-pointer`}
                  onClick={() => {
                    setSessionType("Perforation");
                  }}
                >
                  Perforation
                </div>
              )}
              <div
                className={`rounded-[20px] ${
                  sessionType === "Weight"
                    ? "bg-[#1F36C7] text-white"
                    : "bg-white text-black"
                } px-3 text-center py-[10px] w-36 cursor-pointer`}
                onClick={() => {
                  setSessionType("Weight");
                }}
              >
                Weight
              </div>
              <div
                className={`rounded-[20px] ${
                  sessionType === "Others"
                    ? "bg-[#1F36C7] text-white"
                    : "bg-white text-black"
                } px-3 text-center py-[10px] w-36 cursor-pointer`}
                onClick={() => {
                  setSessionType("Others");
                }}
              >
                Others
              </div> */}
            </div>
            <div
              className="flex flex-row gap-4 bg-[#1F36C7] cursor-pointer text-white px-4 py-3 rounded-[10px]"
              onClick={() => endSession()}
            >
              <p>Submit</p>
              <img src={NextArrow} alt="" />
            </div>
          </div>
          <div className="flex flex-col w-full mt-4 gap-4">
            {sessionData?.units.map((item, index) => {
              console.log(item);
              return (
                <div key={item.id}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={
                        <AddCircleIcon
                          style={{ color: "#1F36C7" }}
                          fontSize="large"
                        />
                      }
                      aria-controls="panel1-content"
                      id="panel1-header"
                      onClick={() => setVideo(true)}
                    >
                      <div className="flex flex-row justify-between w-[100%]">
                        <p className="text-[20px] font-[500] basis-[33.3%]">
                          Unit {index + 1}
                        </p>
                        <div className="text-md basis-[33.3%] flex capitalize flex-row justify-center items-center gap-4">
                          <p>
                            Status:{" "}
                            {/* {tablesData &&
                              tablesData[index][sessionTypeIndex][0][0]
                                .analyzeStatus} */}
                          </p>
                          {tablesData && (
                            <TagChip
                              status={
                                tablesData[index][sessionTypeIndex][0][0]
                                  .analyzeStatus
                              }
                            />
                          )}
                        </div>
                        {sessionType !== "material_code" && (
                          <div
                            className="flex flex-row basis-[33.3%] gap-1 justify-center items-center"
                            onClick={(event) => {
                              event.stopPropagation();
                              startAnalyze(item);
                            }}
                          >
                            <img src={RefreshIcon} alt="" />
                            <p className="text-md">Retry</p>
                          </div>
                        )}
                        {sessionType === "material_code" &&  (
                          <>
                          {tablesData[index][sessionTypeIndex][0].length === 1 && <div
                          className="flex flex-row basis-[33.3%] gap-1 justify-center items-center"
                          onClick={(event) => {
                            event.stopPropagation();
                            startAnalyze(item);
                          }}
                        >
                          <img src={RefreshIcon} alt="" />
                          <p className="text-md">Retry</p>
                        </div>}
                          {tablesData[index][sessionTypeIndex][0].length > 1 && <div
                            className="flex flex-row basis-[33.3%] gap-1 justify-center items-center"
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                          >
                            <Select
                              key={index}
                              closeMenuOnSelect={true}
                              components={{ Placeholder }}
                              hideSelectedOptions={false}
                              placeholder={"Retry"}
                              styles={{
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  backgroundColor: "#ffffff",
                                  borderColor: "#2F3339",
                                  flexBasis: "30%",
                                }),
                                option: (styles, { isDisabled, isFocused }) => {
                                  return {
                                    ...styles,
                                    backgroundColor: isFocused
                                      ? "#ffffff"
                                      : "transparent",
                                    color: "black",
                                    cursor: isDisabled
                                      ? "not-allowed"
                                      : "default",
                                  };
                                },
                              }}
                              options={[
                                { label: "Front", value: "Front" },
                                { label: "Back", value: "Back" },
                              ]}
                              value={materialCodeRetry}
                              onChange={(selectedOption) => {
                                setMaterialCodeRetry(selectedOption);
                                startAnalyze(item, selectedOption.value);
                              }}
                            />
                          </div>}
                          </>
                        )}
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="w-full flex flex-row gap-4 h-auto">
                        <div
                          className={`${
                            sessionType === "others"
                              ? "basis-[100%]"
                              : sessionType === "perforation"
                              ? "basis-[80%]"
                              : "basis-[60%]"
                          }`}
                        >
                          <div className="flex flex-col w-full h-full justify-center items-center">
                            {sessionType !== "perforation" && (
                              <Table
                                className="font-[inter] w-full border-2 border-[#CDD5DF] rounded-[5px] custom-antd-table compare-table"
                                rowClassName={(record, index) =>
                                  index % 2 === 0
                                    ? "table-row-light highlight-bottom-border"
                                    : "table-row-dark highlight-top-border"
                                }
                                columns={
                                  sessionType === "others"
                                    ? othersColumns
                                    : columns
                                }
                                bordered={true}
                                dataSource={
                                  // properties.map((item,propertyIndex)=>{
                                  //   if(sessionType === item){

                                  //   }
                                  // })
                                  tablesData[index][sessionTypeIndex][0]
                                }
                                pagination={false}
                              />
                            )}
                            {sessionType === "perforation" && (
                              <div className="flex flex-row h-full gap-4">
                                <div className="">
                                  <Table
                                    className="font-[inter] w-full border-2 border-[#CDD5DF] rounded-[5px] custom-antd-table compare-table"
                                    rowClassName={(record, index) =>
                                      index % 2 === 0
                                        ? "table-row-light highlight-bottom-border"
                                        : "table-row-dark highlight-top-border"
                                    }
                                    columns={perforationRefTable}
                                    bordered={true}
                                    dataSource={
                                      // properties.map((item,propertyIndex)=>{
                                      //   if(sessionType === item){

                                      //   }
                                      // })
                                      tablesData[index][sessionTypeIndex][0]
                                    }
                                    pagination={false}
                                  />
                                </div>
                                <div className="basis-[40%]">
                                  <Table
                                    className="font-[inter] w-full border-2 border-[#CDD5DF] rounded-[5px] custom-antd-table compare-table"
                                    rowClassName={(record, index) =>
                                      index % 2 === 0
                                        ? "table-row-light highlight-bottom-border"
                                        : "table-row-dark highlight-top-border"
                                    }
                                    columns={IndividualPerforationRefTable}
                                    bordered={true}
                                    dataSource={individualPerforationTable}
                                    scroll={{
                                      y: "40vh",
                                    }}
                                    pagination={false}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className={`${
                            sessionType === "others"
                              ? "basis-[0%]"
                              : sessionType === "perforation"
                              ? "basis-[20%]"
                              : "basis-[40%]"
                          } flex flex-col justify-center items-center`}
                        >
                          {!(sessionType === "others") && (
                            <div className="">
                              {/* <img
                              src={Image}
                              alt=""
                              className="object-fill w-full h-full"
                            /> */}
                              {/* {item.det_out.id !== null && <img
                              src={"/analyzed.png"}
                              alt=""
                              className="object-fill w-full h-full"
                            />} */}
                              {image &&
                                sessionType !== "others" &&
                                sessionType !== "perforation" &&
                                sessionType !== "target_weight" && (
                                  <img
                                    src={`data:image/png;base64,${image}`}
                                    alt=""
                                    className="w-[834px] h-[373px]"
                                  />
                                )}
                              {(sessionType === "perforation" ||
                                sessionType === "target_weight") && (
                                <div className="w-[434px] h-[373px] flex flex-row justify-center items-center ">
                                  <img
                                    src={
                                      sessionType === "perforation"
                                        ? PerforationImage
                                        : WeighingImage
                                    }
                                    alt=""
                                    className="w-[334px] h-[273px]"
                                  />
                                  {/* <p>No Image Available</p> */}
                                </div>
                              )}
                              {!image &&
                                sessionType !== "perforation" &&
                                sessionType !== "target_weight" && (
                                  <div className="w-[834px] h-[373px] flex flex-row justify-center items-center ">
                                    <p>No Image Available</p>
                                  </div>
                                )}
                              {/* {item.det_out.id == null && <video src={"/jam.mp4"} key={item} height="70vh" controls className="z-[100000]" loop muted autoPlay />} */}
                            </div>
                          )}
                          {!(
                            sessionType === "others" ||
                            sessionType === "material_code"
                          ) && (
                            <AnalysisBtn
                              key={item}
                              startAnalyze={startAnalyze}
                              label={correctLabels(sessionType)}
                              data={item}
                              progress={getPropertyProgress(item)}
                            />
                            // <div
                            //   className="cursor-pointer flex flex-row gap-4 w-full py-4 rounded-[10px] bg-[#1F36C7] text-white text-md justify-center items-center font-[500]"
                            //   onClick={() => startAnalyze(item)}
                            // >
                            //   {(sessionType !== "perforation" ||
                            //     sessionType !== "target_weight") && (
                            //     <img src={Camera} alt="" />
                            //   )}
                            //   <p className="capitalize">
                            //     Analyze {correctLabels(sessionType)}
                            //   </p>
                            // </div>
                            // <AnalysisBtn key={item} startAnalyze={startAnalyze} label={correctLabels(sessionType)} data={null} progress={getProgress}/>
                          )}
                          {sessionType === "material_code" && (
                            <div className="flex flex-row gap-2 w-full">
                              {tablesData[index][sessionTypeIndex][0].length === 1 && (
                                <AnalysisBtn
                                key={index}
                                startAnalyze={startAnalyze}
                                material_code_type={
                                  tablesData[index][sessionTypeIndex][0][0].name === "Front"
                                    ? "Front"
                                    : "Back"
                                }
                                label={"Material Code"}
                                data={item}
                                progress={getPropertyProgress(
                                  item,
                                  tablesData[index][sessionTypeIndex][0][0].name
                                )}
                              />
                              )}
                              {tablesData[index][sessionTypeIndex][0].length > 1 && tablesData[index][sessionTypeIndex][0]?.map(
                                (material_code_type, index) => {
                                  return (
                                    <AnalysisBtn
                                      key={index}
                                      startAnalyze={startAnalyze}
                                      material_code_type={
                                        material_code_type.name === "Front"
                                          ? "Front"
                                          : "Back"
                                      }
                                      label={material_code_type.name}
                                      data={item}
                                      progress={getPropertyProgress(
                                        item,
                                        material_code_type.name
                                      )}
                                    />
                                  );
                                  // console.log(material_code_type.name)
                                }
                              )}
                            </div>
                            // <AnalysisBtn key={item} startAnalyze={startAnalyze} label={correctLabels(sessionType)} data={null} progress={getProgress}/>
                          )}
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Modal
        className="mt-[15vh] custom-antd-modal"
        open={open}
        onOk={handleOk}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        // confirmLoading={confirmLoading}
        onCancel={handleCancel}
        closeIcon={<CloseIcon color="#ffffff" fontSize={"2.5vmin"} />}
      >
        {isError && (
          <div className="w-[30vw] flex flex-col gap-4">
            <div className="flex flex-row justify-center items-center">
              <img src={ErrorImage} alt="" className="w-40 h-40" />
            </div>
            <p className="text-xl font-[500] text-center">
              Please resolve all pending errors before submitting
            </p>
            <div className="w-full flex flex-row justify-center items-center">
              <button
                onClick={handleOk}
                className="bg-[#1F36C7] text-white px-4 py-2 w-[30%] rounded-[10px]"
              >
                Okay
              </button>
            </div>
          </div>
        )}
        {!isError && (
          <div className="flex flex-col justify-center items-center gap-20 w-[60vw]">
            {/*<p className="text-2xl font-[500] text-center">Congratulations !</p>*/}
            <p className="text-lg">
              The Session has been successfully submitted
            </p>
            {/*<Table
              className="font-[inter] congrats border-2 border-[#CDD5DF] rounded-[5px] custom-antd-table compare-table"
              rowClassName={(record, index) =>
                index % 2 === 0
                  ? "table-row-light highlight-bottom-border"
                  : "table-row-dark highlight-top-border"
              }
              columns={sessionTable}
              bordered={true}
              dataSource={congratsTable}
              pagination={false}
            />*/}
            <div className="w-full flex flex-row justify-center items-center">
              <button
                onClick={handleSuccessSubmit}
                className="bg-[#1F36C7] text-white px-4 py-2 w-[30%] rounded-[10px]"
              >
                Okay
              </button>
            </div>
          </div>
        )}
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default Monitor;
