import React, { useEffect, useState } from "react";
import TopNav from "../Components/TopNav";
import { Modal, Spin, Table } from "antd";
import { data } from "../Mock/table";
import dayjs from "dayjs";
import { LoadingOutlined } from "@ant-design/icons";
import { Endpoint, apiService } from "../Services/apiService";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import ReactCardFlip from "react-card-flip";
import SVG from "react-inlinesvg";
import BackIcon from "../Assets/back.svg";
import AddIcon from "../Assets/Add.svg";

function Home({isCollapsed}) {
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [tableData, setTableData] = useState();
  const [open, setOpen] = useState(false);
  const [clickedSessionData, setClickedSessionData] = useState();
  const [singleUnitTableData, setSingleUnitTableData] = useState();
  const singleUnitTableColumns = [
    {
      title: <div className="text-[#000000] text-start ml-4">Line Items</div>,
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
            <p>{expected ? expected : '-'}</p>
          </div>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "7vw",
      render: (_, { name ,status }) => (
        <>
          <div className="w-full flex justify-center items-center">
            {(name !== "Raw" && name !== "Avg" && name !== "Min" && name !== "Max") && <div
              className={`w-[25px] h-[25px]  text-white rounded-[50px] flex justify-center items-center ${
                status ? "bg-[#167a48]" : "bg-[#b42318]"
              }`}
            ></div>}
            {(name === "Raw" || name === "Avg" || name === "Min" || name === "Max") && <div
              className={``}
            >-</div>}
          </div>
        </>
      ),
    },
    // {
    //   title: "User Input",
    //   dataIndex: "null",
    //   width: "10vw",
    //   render: (_, { user }) => (
    //     <>
    //       <div className="w-full flex justify-center items-center text-[#898D93]">
    //         <p>{user}</p>
    //       </div>
    //     </>
    //   ),
    // },
  ];
  const [sessionTable, setSessionTable] = useState([]);
  // const sessionTable = [
  //   {
  //     title: <div className="text-[#000000] text-start ml-4">Units</div>,
  //     dataIndex: "name",
  //     width: "12vw",
  //     key: "name",
  //     render: (_, { name }) => (
  //       <>
  //         <div className="w-full flex justify-start ml-4 items-center text-[#4B5565]">
  //           <p>{name}</p>
  //         </div>
  //       </>
  //     ),
  //   },
  //   {
  //     title: "Coding",
  //     dataIndex: "codingStatus",
  //     width: "7vw",
  //     render: (_, record, index) => {
  //       console.log(record);
  //       return (
  //         <>
  //           <div
  //             className="w-full flex justify-center items-center"
  //             onClick={() => showIndividualUnitData(index, 0)}
  //           >
  //             <div
  //               className={`w-[25px] h-[25px]  text-white rounded-[50px] flex justify-center items-center ${
  //                 record.codingStatus ? "bg-[#167a48]" : "bg-[#b42318]"
  //               }`}
  //             ></div>
  //           </div>
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     title: "Barcode",
  //     dataIndex: "barcodeStatus",
  //     width: "7vw",
  //     render: (_, record, index) => {
  //       console.log(record);
  //       return (
  //         <>
  //           <div
  //             className="w-full flex justify-center items-center"
  //             onClick={() => showIndividualUnitData(index, 1)}
  //           >
  //             <div
  //               className={`w-[25px] h-[25px]  text-white rounded-[50px] flex justify-center items-center ${
  //                 record.barcodeStatus ? "bg-[#167a48]" : "bg-[#b42318]"
  //               }`}
  //             ></div>
  //           </div>
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     title: "Material Code",
  //     dataIndex: "materialStatus",
  //     width: "7vw",
  //     render: (_, record, index) => {
  //       console.log(record);
  //       return (
  //         <>
  //           <div
  //             className="w-full flex justify-center items-center"
  //             onClick={() => showIndividualUnitData(index, 2)}
  //           >
  //             <div
  //               className={`w-[25px] h-[25px]  text-white rounded-[50px] flex justify-center items-center ${
  //                 record.materialStatus ? "bg-[#167a48]" : "bg-[#b42318]"
  //               }`}
  //             ></div>
  //           </div>
  //         </>
  //       );
  //     },
  //   },
  // ];
  // console.log(clickedSessionData)
  const showIndividualUnitData = (unitIndex, property, currentSession) => {
    setFlipped(!flipped);
    console.log(property);
    const data = [];
    console.log(currentSession);
    // allProperties.map((item) => {});
    // if (property === "barcode") {
    let filteredProperties;
    if (
      property === "others" ||
      property === "coding" ||
      property === "material_code" ||
      property === "perforation"
    ) {
      filteredProperties = currentSession.units[unitIndex].properties.filter(
        (prop) => prop.type === property
      );
    } else {
      filteredProperties = currentSession.units[unitIndex].properties.filter(
        (prop) => prop.label === property
      );
    }
    console.log(filteredProperties);
    filteredProperties.map((item) => {
      data.push({
        name: item.label,
        detected:
          item.detected_value === "1"
            ? "Yes"
            : item.detected_value === "0"
            ? "No"
            : item.detected_value,
        expected:
          item.value === "1"
            ? "Yes"
            : item.value === "0"
            ? "No"
            : item.value,
        status: item.verdict === 1 ? true : false,
        user: "10/10/2020",
      });
    });
    // }
    // if (property === "barcode") {
    //   data.push(
    //     {
    //       name: "Price",
    //       detected: clickedSessionData.units[index].det_out.price,
    //       expected: clickedSessionData.det_in.price,
    //       status:
    //         clickedSessionData.units[index].det_out.price ===
    //         clickedSessionData.det_in.price,
    //       user: "10/10/2020",
    //     },
    //     {
    //       name: "Manufactured Date",
    //       detected: clickedSessionData.units[index].det_out.md,
    //       expected: clickedSessionData.det_in.md,
    //       status:
    //         clickedSessionData.units[index].det_out.md ===
    //         clickedSessionData.det_in.md,
    //       user: "10/10/2024",
    //     },
    //     {
    //       name: "Expiry Date",
    //       detected: clickedSessionData.units[index].det_out.ed,
    //       expected: clickedSessionData.det_in.ed,
    //       status:
    //         clickedSessionData.units[index].det_out.ed ===
    //         clickedSessionData.det_in.ed,
    //       user: "10/10/2024",
    //     },
    //     {
    //       name: "Batch Code",
    //       detected: clickedSessionData.units[index].det_out.batch_code,
    //       expected: clickedSessionData.det_in.batch_code,
    //       status:
    //         clickedSessionData.units[index].det_out.batch_code ===
    //         clickedSessionData.det_in.batch_code,
    //       user: "10/10/2024",
    //     }
    //   );
    // } else if (seletedMode === 1) {
    //   data.push({
    //     name: "Barcode",
    //     detected: clickedSessionData.units[index].det_out.barcode,
    //     expected: clickedSessionData.det_in.barcode,
    //     status:
    //       clickedSessionData.units[index].det_out.barcode ===
    //       clickedSessionData.det_in.barcode,
    //     user: "10/10/2024",
    //   });
    // } else if (seletedMode === 2) {
    //   data.push(
    //     {
    //       name: "Front Code",
    //       detected: clickedSessionData.units[index].det_out.mc_front,
    //       expected: clickedSessionData.det_in.mc_front,
    //       status:
    //         clickedSessionData.units[index].det_out.mc_front ===
    //         clickedSessionData.det_in.mc_front,
    //       user: "10/10/2024",
    //     },
    //     {
    //       name: "Back Code",
    //       detected: clickedSessionData.units[index].det_out.mc_back,
    //       expected: clickedSessionData.det_in.mc_back,
    //       status:
    //         clickedSessionData.units[index].det_out.mc_back ===
    //         clickedSessionData.det_in.mc_back,
    //       user: "10/10/2024",
    //     }
    //   );
    // }
    setSingleUnitTableData(data);
    // setSingleUnitTableData(
    //   [
    //     {
    //       name: "Price",
    //       detected: clickedSessionData.units[index].det_out.price,
    //       expected: clickedSessionData.det_in.price,
    //       status: clickedSessionData.units[index].det_out.price === clickedSessionData.det_in.price,
    //       user: "10/10/2020",
    //     },
    //     {
    //       name: "Manufactured Date",
    //       detected: clickedSessionData.units[index].det_out.md,
    //       expected: clickedSessionData.det_in.md,
    //       status: clickedSessionData.units[index].det_out.md === clickedSessionData.det_in.md,
    //       user: "10/10/2024",
    //     },
    //     {
    //       name: "Expiry Date",
    //       detected: clickedSessionData.units[index].det_out.ed,
    //       expected: clickedSessionData.det_in.ed,
    //       status: clickedSessionData.units[index].det_out.ed === clickedSessionData.det_in.ed,
    //       user: "10/10/2024",
    //     },
    //     {
    //       name: "Batch Code",
    //       detected: clickedSessionData.units[index].det_out.batch_code,
    //       expected: clickedSessionData.det_in.batch_code,
    //       status: clickedSessionData.units[index].det_out.batch_code === clickedSessionData.det_in.batch_code,
    //       user: "10/10/2024",
    //     },
    //     {
    //       name: "Barcode",
    //       detected: clickedSessionData.units[index].det_out.barcode,
    //       expected: clickedSessionData.det_in.barcode,
    //       status: clickedSessionData.units[index].det_out.barcode === clickedSessionData.det_in.barcode,
    //       user: "10/10/2024",
    //     },
    //     {
    //       name: "Front Code",
    //       detected: clickedSessionData.units[index].det_out.mc_front,
    //       expected: clickedSessionData.det_in.mc_front,
    //       status: clickedSessionData.units[index].det_out.mc_front === clickedSessionData.det_in.mc_front,
    //       user: "10/10/2024",
    //     },
    //     {
    //       name: "Back Code",
    //       detected: clickedSessionData.units[index].det_out.mc_back,
    //       expected: clickedSessionData.det_in.mc_back,
    //       status: clickedSessionData.units[index].det_out.mc_back === clickedSessionData.det_in.mc_back,
    //       user: "10/10/2024",
    //     },
    //   ]
    // )
    // setSingleUnitTableData(singleUnit)
  };

  const handleOk = () => {
    // setModalText("The modal will be closed after two seconds");
    // setConfirmLoading(true);
    // setTimeout(() => {
    setOpen(false);
    navigate("/home");
    // setIsError(!isError);
    // setConfirmLoading(false);
    // }, 2000);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
    setFlipped(false);
    // setIsError(!isError);
  };

  const TABLE_COLUMNS = [
    {
      title: "Date",
      dataIndex: "timestring",
      width: "20%",
    },
    {
      title: "Product Name",
      dataIndex: "product",
      width: "20%",
      render: (_, { product }) => (
        <>
          <p>{product?.label}</p>
        </>
      ),
    },
    {
      title: "Variant Name",
      dataIndex: "variant",
      width: "20%",
      render: (_, { variant }) => (
        <>
          <p>{variant?.label}</p>
        </>
      ),
    },

    {
      title: "No of Units",
      dataIndex: "units",
      width: "20%",
    },
    {
      title: "User",
      dataIndex: "user",
      width: "20%",
      render: (_, { user }) => (
        <>
          <p>{user?.name}</p>
        </>
      ),
    },
  ];
  const [congratsTable, setCongratsTable] = useState();
  // const [sessionData, setSessionData] = useState();

  // console.log(congratsTable);
  // console.log(singleUnitTableData);
  const generateCongratsTable = (sessionData, propertyLabels) => {
    let congratsTable = [];
    console.log(sessionData);
    console.log(propertyLabels);
    sessionData?.units.map((item, index) => {
      let propertyItem = {
        sessionId: item.session_id,
        name: `Unit ${index + 1}`,
      };
      propertyLabels.map((label, index) => {
        // const filteredProperties = item.properties.filter(
        //   (prop) => prop.type === label
        // );
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
        // Check if all filtered properties have matching value and detected_value
        

        if(label === "perforation"){
          
          filteredProperties.map((item)=>{
            console.log(item)
            if(item.label === "Raw"){
              console.log(item.detected_value)
              if(item.detected_value == null || item.detected_value == undefined){
                propertyItem[`${label}Status`] = false;
              }
              else{
                propertyItem[`${label}Status`] = true;
              }
            }
          })
        }
        else{
          const result = filteredProperties.every(
            (prop) => prop.verdict === 1 ? true : false
          );
          propertyItem[`${label}Status`] = result;
        }
      });
      console.log(propertyItem);
      congratsTable.push(propertyItem);
    });
    console.log(congratsTable);
    setCongratsTable(congratsTable);
    setOpen(true);
  };
  console.log(sessionTable);
  const getAllUnitsSession = async (sessionId) => {
    let endpoint = Endpoint.GET_ALL_UNITS_SESSION.replace(
      "{session_id}",
      sessionId
    );
    const res = await apiService.get(endpoint);
    console.log(res);
    let data = [
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
    ];
    let labels = [];
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
    // console.log()
    const propertyLabels = [...new Set(labels)];
    console.log(propertyLabels);
    setClickedSessionData(res.data.data);
    console.log(propertyLabels);
    const correctLabels = (item) => {
      if (item.includes("_")) {
        // Remove the underscore and return the modified string
        item = item.replace(/_/g, "");
        return item.charAt(0).toUpperCase() + item.slice(1);
      } else {
        // Capitalize the first letter of the string
        return item.charAt(0).toUpperCase() + item.slice(1);
      }
    };
    propertyLabels.map((item, propertyIndex) => {
      data.push({
        title: correctLabels(item),
        dataIndex: `${item + "Status"}`,
        width: "7vw",
        render: (_, record, unitIndex) => {
          console.log(record);
          return (
            <>
              <div
                className="w-full flex justify-center items-center"
                onClick={() =>
                  showIndividualUnitData(unitIndex, item, res.data.data)
                }
              >
                <div
                  className={`w-[25px] h-[25px]  text-white rounded-[50px] flex justify-center items-center ${
                    record[`${item + "Status"}`]
                      ? "bg-[#167a48]"
                      : "bg-[#b42318]"
                  }`}
                ></div>
              </div>
            </>
          );
        },
      });
    });
    setSessionTable(data);
    // setClickedSessionData(res.data.data);
    // setSessionData(res.data.data);
    generateCongratsTable(res.data.data, propertyLabels);
    // generateTableData(res.data.data);
  };

  const fetchData = async () => {
    const res = await apiService.get(Endpoint.GET_ALL_SESSIONS);
    console.log(res);
    res.data.data.map((item) => {
      console.log(dayjs(item.end_ts).format("DD-MM-YYYY hh:mm:ss A"));
      item.timestring = dayjs(item.end_ts).format("DD-MM-YYYY hh:mm:ss A");
    });

    setTableData(res.data.data);
    setLoadingState(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={`flex  h-[100vh] flex-col w-full bg-[#f7f7f7] overflow-auto relative ${isCollapsed ? 'w-[95vw]':'w-[75vw]'}`}>
      {/* <TopNav /> */}
      <div className="p-8">
        <div className="flex flex-row justify-between items-center w-full">
          <h2 className="text-3xl">Recent QC Sessions</h2>
          <div
            className="flex cursor-pointer create-qc-menu flex-row justify-start gap-2  items-center px-6 py-3 w-auto text-black rounded-[50px]"
            onClick={() => navigate("/create-session")}
          >
            <SVG src={AddIcon} />
            <div className="text-md ">New QC Session</div>
          </div>
        </div>
        <div className="mt-8 flex flex-row  min-w-[70vw] h-[80vh]  border border-[#EEF2F6] rounded-md overflow-auto">
          {loadingState ? (
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
          ) : (
            <Table
              className="font-[inter] w-full"
              rowClassName={(record, index) =>
                index % 2 === 0
                  ? "table-row-light highlight-bottom-border"
                  : "table-row-dark highlight-top-border"
              }
              locale={{
                emptyText: (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "white",
                    }}
                  >
                    No Data Available
                  </div>
                ),
              }}
              columns={TABLE_COLUMNS}
              bordered={false}
              dataSource={tableData}
              pagination={false}
              scroll={{
                y: "80vh",
              }}
              onRow={(record, index) => {
                return {
                  onClick: (event) => {
                    getAllUnitsSession(record.id);
                    // console.log(column)
                  },
                };
              }}
            />
          )}
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
            {
              <div className="flex flex-col justify-center items-center gap-4 w-[60vw]">
                <div className="w-full flex flex-row justify-between items-center">
                  {/* <div className=""></div> */}
                  {flipped ? (
                    <img
                      src={BackIcon}
                      alt=""
                      width={20}
                      height={10}
                      className="cursor-pointer"
                      onClick={() => setFlipped(!flipped)}
                    />
                  ) : (
                    <div></div>
                  )}
                  <p className="text-2xl font-[500] text-center">
                    Session Results
                  </p>
                  <div className=""></div>
                </div>
                <p className="text-lg">
                  The Session has been already successfully submitted
                </p>
                <ReactCardFlip
                  isFlipped={flipped}
                  flipDirection="horizontal"
                  className="w-full"
                  // className={styles.top_div_flip}
                >
                  <div className="w-full flex justify-center items-center">
                    <Table
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
                    />
                  </div>
                  <div className="w-full flex justify-center items-center">
                    <Table
                      className="font-[inter] congrats border-2 rounded-[5px] custom-antd-table compare-table"
                      rowClassName={(record, index) =>
                        index % 2 === 0
                          ? "table-row-light highlight-bottom-border"
                          : "table-row-dark highlight-top-border"
                      }
                      columns={singleUnitTableColumns}
                      bordered={true}
                      dataSource={singleUnitTableData}
                      pagination={false}
                    />
                  </div>
                </ReactCardFlip>

              </div>
            }
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Home;
