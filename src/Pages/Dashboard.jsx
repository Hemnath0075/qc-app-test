import React, { useEffect, useState } from "react";
// import Header from "./Component/Header";
// import { FaCheckCircle } from "react-icons/fa";
import { DatePicker, Table, Spin } from "antd";
import Select, { components } from "react-select";
// import ColumnChart from "./Component/Charts/ColumnCharts/ColumnChart";
// import PieChart from "./Component/Charts/PieChart/PieChart";
// import { IoIosArrowDown } from "react-icons/io";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Passed from "../Assets/passed.svg";
import Logs from "../Assets/log.svg";
import csvDownload from "json-to-csv-export";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Endpoint, apiService } from "../Services/apiService";
import { GoDash } from "react-icons/go";
import { CiCalendar } from "react-icons/ci";
import { drop_down_config, tablesData, units } from "../Mock/dashboard";
import ColumnChart from "../Components/StackBarChart";
import StackBarChart from "../Components/StackBarChart";
import SingleBarChart from "../Components/SingleBarChart";
import CustomPieChart from "../Components/PieChart";
import { getAllSessions } from "../Mock/dashboard";
import CustomLineChart from "../Components/LineChart";

const MINUTE_MS = 60000;

const weightChart = [
  {
    name: "1",
    weight: 100,
  },
  {
    name: "2",
    weight: 200,
  },
  {
    name: "3",
    weight: 800,
  },
  {
    name: "4",
    weight: 200,
  },
  {
    name: "5",
    weight: 220,
  },
  {
    name: "6",
    weight: 200,
  },
  {
    name: "7",
    weight: 120,
  },
];

const perforationChart = [
  {
    name: "1",
    avg: 4000,
    min: 2400,
    max: 2400,
  },
  {
    name: "2",
    avg: 3000,
    min: 1398,
    max: 2210,
  },
  {
    name: "3",
    avg: 2000,
    min: 9800,
    max: 2290,
  },
  {
    name: "4",
    avg: 2780,
    min: 3908,
    max: 2000,
  },
  {
    name: "5",
    avg: 1890,
    min: 4800,
    max: 2181,
  },
  {
    name: "6",
    avg: 2390,
    min: 3800,
    max: 2500,
  },
  {
    name: "7",
    avg: 3490,
    min: 4300,
    max: 2100,
  },
];

const PieChartData = [
  { name: "Barcode", value: 400 },
  { name: "Material Code", value: 300 },
  { name: "Coding ", value: 300 },
  { name: "Weight ", value: 200 },
  { name: "Perforation ", value: 200 },
];

const DayWiseSession = [
  {
    name: "10/04/2024",
    sessions: 10,
  },
  {
    name: "11/04/2024",
    sessions: 2,
  },
  {
    name: "20/04/2024",
    sessions: 6,
  },
  {
    name: "21/04/2024",
    sessions: 7,
  },
  {
    name: "23/04/2024",
    sessions: 15,
  },
  {
    name: "26/04/2024",
    sessions: 23,
  },
  {
    name: "29/04/2024",
    sessions: 6,
  },
];

const BarchartSessions = [
  {
    name: "Sunsilk Sachet",
    passed: 10,
    failed: 2,
  },
  {
    name: "Tresseme",
    passed: 15,
    failed: 10,
  },
  {
    name: "Sunsilk",
    passed: 20,
    failed: 12,
  },
  {
    name: "Dove",
    passed: 14,
    failed: 8,
  },
];

function generateState(state = null, value = null) {
  if (state == 1) {
    return <span className="text-green-500">{value || "-"}%</span>;
  } else if (state == 0) {
    return <span className="text-red-500">{value || "-"}%</span>;
  } else {
    return <></>;
  }
}

const InputOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = "#e7e9eb";
  if (isFocused) bg = "#fdfdfd";
  if (isActive) bg = "#f4f5f6";

  const style = {
    alignItems: "center",
    backgroundColor: bg,
    color: "inherit",
    display: "flex ",
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style,
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
      className="flex flex-row gap-4 border-filter text-black"
    >
      <input type="checkbox" checked={isSelected} />
      {children}
    </components.Option>
  );
};

const MultiValue = ({ getValue, index, item, ...props }) => {
  console.log(item);
  return !index && `${item} (${getValue().length})`;
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
    title: "Result",
    dataIndex: "decision",
    width: "20%",
    render: (_, { decision }) => (
      <>
        <div className="w-full h-full flex flex-row items-center justify-center">
          <div
            className={`w-[60px] h-[30px]  text-white rounded-[50px] flex justify-center items-center ${
              decision ? "bg-[#167a48]" : "bg-[#b42318]"
            }`}
          >
            <p>{decision ? "Pass" : "Fail"}</p>
          </div>
        </div>
      </>
    ),
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

function Dashboard({ isCollapsed }) {
  // TODO: REPLACE WITH DUMMY DATA
  const [dropDownData, setDropDown] = useState(drop_down_config.data);
  const [tableData, setTableData] = useState();
  console.log(tableData)
  const [unitsData, setUnitsData] = useState(units.data);
  console.log(unitsData);
  const { RangePicker } = DatePicker;
  const [isLoading, setIsLoading] = useState(false);
  const [filterValues, setFilterValues] = useState({
    st: null,
    et: null,
    app: "",
    cam: "",
    decision: "",
    rfr: "",
  });

  const handleSelectChange = async (
    selectedOption,
    selectId,
    startTimestamp,
    endTimeStamp
  ) => {
    console.log(selectedOption, selectId);
    if (selectId === "Camera") {
      selectId = "cam";
    } else if (selectId === "Line") {
      selectId = "line";
    } else if (selectId === "Reason") {
      selectId = "rfr";
    }
    let currentFilteredParams = {
      ...filteredParameters,
      [selectId.toLowerCase()]: selectedOption,
    };
    console.log(currentFilteredParams);
    setFilteredParameters((prevValues) => ({
      ...prevValues,
      [selectId.toLowerCase()]: selectedOption,
    }));
    const values = {
      app: "",
      cam: "",
      // line: "",
      decision: "",
      rfr: "",
    };
    const keys = Object.keys(currentFilteredParams);
    keys.map((item) => {
      console.log(currentFilteredParams[item]);
      if (
        currentFilteredParams[item] !== null &&
        currentFilteredParams[item].length > 0
      ) {
        currentFilteredParams[item]?.map((arr) => {
          values[item] = values[item] + arr.value.toString() + ",";
        });
        values[item] = values[item].slice(0, -1);
      }
    });
    console.log(values);
    setFilterValues(values);
  };

  // //   const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  // const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([]);

  async function handleRangeChange(dates) {
    // dates is an array [startDate, endDate] or an empty array if cleared
    const startOfDay = dates[0].startOf("day");
    const endOfDay = dates[1].endOf("day");
    const timestamps = [startOfDay.unix() * 1000, endOfDay.unix() * 1000];
    console.log(timestamps);
    setDateRange([startOfDay, endOfDay]);
  }
  useEffect(() => {
    let date;
    if (process.env.REACT_APP_STATE !== "production") {
      setDateRange([
        dayjs("2024-02-21").startOf("day"),
        dayjs("2024-02-22").endOf("day"),
      ]);
      date = [
        dayjs("2024-02-21").startOf("day"),
        dayjs("2024-02-22").endOf("day"),
      ];
    } else {
      setDateRange([
        dayjs().subtract(3, "day"), //TODO: initial fetch for event logs should change to days or hours here
        dayjs(),
      ]);
      date = [dayjs().subtract(3, "day"), dayjs()];
    }
    // if (dateRange && dateRange[0]) {
    fetchInitialData(date);
    // }
  }, []);

  const fetchInitialData = () => {
    let date = [dayjs().subtract(3, "day"), dayjs()];
    const getUnitsData = async () => {
      const res = await apiService.get(`${Endpoint.UNITS_DATA}`, {
        st: date[0].unix() * 1000,
        et: date[1].unix() * 1000,
      });
      setUnitsData(res.data.data);
    };
    const getTableData = () => {
      // const res = await apiService.get(Endpoint.GET_ALL_SESSIONS);
      // console.log(res);
      let res = {
        data: {
          data: null,
        },
      };
      res.data.data = getAllSessions.data;
      res.data.data.map((item) => {
        console.log(dayjs(item.end_ts).format("DD-MM-YYYY hh:mm:ss A"));
        item.timestring = dayjs(item.end_ts).format("DD-MM-YYYY hh:mm:ss A");
      });
      console.log(res.data.data);
      setTableData(res.data.data);
      // setLoadingState(false);
    };

    // TODO:  CALL ALL API TO GET DASHBOARD DATA
    getTableData();
  };

  // const [loadingState, loadingDispatch] = useReducer(loadingReducer, {
  //   units: true,
  //   column: true,
  //   pie: true,
  //   table: true,
  //   download: false,
  // });
  // console.log(dateRange);

  // const [filteredString, setFilteredString] = useState();
  // const { RangePicker } = DatePicker;
  const [filteredParameters, setFilteredParameters] = useState({
    st: null,
    et: null,
    shifts: null,
    products: null,
    defect_reason: null,
    decision: null,
  });
  // async function fetchInitialData(date) {
  //   // getDropDownData(token).then((resp) => {
  //   console.log(dateRange);
  //   const Drop_down_data = await apiService.get(Endpoint.DROP_DOWN_CONFIG);
  //   const decodedFiter = Drop_down_data.data.data;
  //   console.log(decodedFiter);
  //   const drop_down_data = new DropDown(decodedFiter).toObjWithApp();
  //   console.log(drop_down_data);
  //   Object.keys(drop_down_data).map((item) => {
  //     if (item !== "decisions") {
  //       console.log(item);
  //       drop_down_data[item].map((item2) => {
  //         item2.value = item2.id;
  //       });
  //     }
  //   });
  //   console.log(drop_down_data.decisions);
  //   console.log(drop_down_data.cameras);
  //   setDropDownData(drop_down_data);

  //   const getModelOutput = async () => {
  //     const res = await apiService.get(`${Endpoint.ALL_EVENTLOGS}`, {
  //       st: date[0].unix() * 1000,
  //       et: date[1].unix() * 1000,
  //     });
  //     modifyTableData(res.data.data);
  //     loadingDispatch({
  //       type: "table",
  //       value: false,
  //     });
  //   };

  //   const filter = filteredString;
  //   const getUnitsData = async () => {
  //     const res = await apiService.get(`${Endpoint.UNITS_DATA}`, {
  //       st: date[0].unix() * 1000,
  //       et: date[1].unix() * 1000,
  //     });
  //     setUnitsData(res.data.data);
  //     loadingDispatch({
  //       type: "units",
  //       value: false,
  //     });
  //   };

  //   const getColumnChartData = async () => {
  //     const res = await apiService.get(`${Endpoint.COLUMN_CHART}`, {
  //       st: date[0].unix() * 1000,
  //       et: date[1].unix() * 1000,
  //     });
  //     if (res.data.data.length > 1) {
  //       const groupedData = res.data.data.reduce((result, currentItem) => {
  //         const existingItem = result.find(
  //           (item) => item.category === currentItem.category
  //         );

  //         if (existingItem) {
  //           // If item with the same name exists, add passed and rejected
  //           existingItem.passed += currentItem.passed;
  //           existingItem.rejected += currentItem.rejected;
  //         } else {
  //           // If item with the same name doesn't exist, add a new item
  //           result.push({
  //             category: currentItem.category,
  //             passed: currentItem.passed,
  //             rejected: currentItem.rejected,
  //           });
  //         }

  //         return result;
  //       }, []);
  //       console.log(groupedData);
  //       setColumnChartData(groupedData);
  //     } else {
  //       setColumnChartData(res.data.data);
  //     }

  //     loadingDispatch({
  //       type: "column",
  //       value: false,
  //     });
  //   };

  //   const getPieChartData = async () => {
  //     const res = await apiService.get(`${Endpoint.PI_CHART}`, {
  //       st: date[0].unix() * 1000,
  //       et: date[1].unix() * 1000,
  //     });
  //     console.log(res.data.data);
  //     if (res.data.data.length > 1) {
  //       const groupedData = res.data.data.reduce((result, currentItem) => {
  //         const existingItem = result.find(
  //           (item) => item.category === currentItem.category
  //         );

  //         if (existingItem) {
  //           // If item with the same name exists, add passed and rejected
  //           existingItem.value += currentItem.value;
  //         } else {
  //           // If item with the same name doesn't exist, add a new item
  //           result.push({
  //             category: currentItem.category,
  //             value: currentItem.value,
  //           });
  //         }

  //         return result;
  //       }, []);
  //       console.log(groupedData);
  //       setpieChartData(groupedData);
  //     } else {
  //       setpieChartData(res.data.data);
  //     }
  //     loadingDispatch({
  //       type: "pie",
  //       value: false,
  //     });
  //   };

  //   getModelOutput();
  //   getUnitsData();
  //   getColumnChartData();
  //   getPieChartData();
  // }
  // // fetch auth token and set into local storage
  // useEffect(() => {
  //   let date;
  //   if (process.env.REACT_APP_STATE !== "production") {
  //     setDateRange([
  //       dayjs("2024-02-21").startOf("day"),
  //       dayjs("2024-02-22").endOf("day"),
  //     ]);
  //     date=[dayjs("2024-02-21").startOf("day"),dayjs("2024-02-22").endOf("day")]
  //   } else {
  //     setDateRange([
  //       dayjs().subtract(3, "day"), //TODO: initial fetch for event logs should change to days or hours here
  //       dayjs(),
  //     ]);
  //     date=[dayjs().subtract(3, "day"),dayjs()]
  //   }
  //   // if (dateRange && dateRange[0]) {
  //     fetchInitialData(date);
  //   // }
  // }, []);
  // console.log(dateRange);
  // // re-fetch data on every 1 minute
  // useInterval(() => {
  //   fetchAllData();
  // }, MINUTE_MS);

  // //handle Change from filter Options

  // // on change of filter string we will call required apis for refresh data.
  // useEffect(() => {
  //   if (filterValues && dateRange.length > 0) {
  //     console.log("filteredString fetching");
  //     fetchAllData();
  //   }
  // }, [filterValues, dateRange]);

  // // create usable table data from data coming from apis.
  // function modifyTableData(data) {
  //   if (data != null) {
  //     const events = data.map((v) => new Event(v).toObj());
  //     console.log(events);
  //     let tempData = [];
  //     if (Array.isArray(data)) {
  //       tempData = events.map((obj) => {
  //         if (obj?.reason == null) {
  //           return {
  //             ...obj,
  //             timeString: dayjs(obj.ts).format("DD-MM-YYYY hh:mm:ss A"),
  //             reason: "Nil",
  //           };
  //         } else {
  //           const object = JSON.parse(obj?.reason);
  //           const name = Object.entries(object).map((item) => item[1]);
  //           console.log(name);
  //           const resultObject = { reason: name.toString() };
  //           return {
  //             ...obj,
  //             timeString: dayjs(obj.ts).format("DD-MM-YYYY hh:mm:ss A"),
  //             reason: resultObject.reason,
  //           };
  //         }
  //       });
  //     }
  //     console.log(tempData);
  //     setTableData(tempData);
  //   }
  // }

  // function handleDateChange(dtrange) {
  //   if (Array.isArray(dtrange)) {
  //     const [start, end] = dtrange;
  //     setDateRange([start, end]);
  //     let filter = filteredString;
  //     const parsed = queryString.parse(filter);
  //     parsed["st"] = dayjs(start).unix() * 1000;
  //     parsed["et"] = dayjs(end).unix() * 1000;
  //     // setFilteredParameters(parsed)
  //     // const stringified = queryString.stringify(parsed);
  //     // setFilteredString(stringified);
  //   }
  // }

  // // Download file on button click.
  // async function handleDownload() {
  //   loadingDispatch({
  //     type: "download",
  //     value: true,
  //   });

  //   const res = await apiService.get(`${Endpoint.ALL_EVENTLOGS}`, {
  //     st: dateRange[0].unix() * 1000,
  //     et: dateRange[1].unix() * 1000,
  //   });
  //   console.log(res.data);
  //   let tempData;
  //   if (Array.isArray(res?.data.data)) {
  //     tempData = res.data.data.map((obj) => {
  //       let resultObject;
  //       if (obj?.reason == null) {
  //         resultObject = { reason: "Nil" };
  //       } else {
  //         const object = JSON.parse(obj?.reason);
  //         const name = Object.entries(object).map((item) => item[1]);
  //         console.log(name);
  //         resultObject = { reason: name.toString() };
  //       }

  //       return {
  //         ...obj,
  //         ts: dayjs(obj.ts).format("DD-MM-YYYY hh:mm:ss A"),
  //         cam: getValue(obj?.cam?.name),
  //         line: getValue(obj?.line?.name),
  //         rfr: getValue(resultObject.reason),
  //       };
  //     });
  //     console.log(tempData);
  //     const dataToConvert = {
  //       data: tempData,
  //       filename: "report",
  //       delimiter: ",",
  //       headers: [
  //         "",
  //         "Date",
  //         "Camera",
  //         "Line Number",
  //         "Decision",
  //         "Reason For Rejection",
  //       ],
  //     };
  //     console.log(dataToConvert);
  //     csvDownload(dataToConvert);
  //     loadingDispatch({
  //       type: "download",
  //       value: false,
  //     });
  //   } else {
  //     console.log("hre");
  //   }
  // }

  // // combined function to fetch all required data.
  // async function fetchAllData() {
  //   function getMinutesDifference(timestamp1, timestamp2) {
  //     var difference = timestamp1 * 1000 - timestamp2 * 1000;
  //     var minutesDifference = Math.floor(difference / (1000 * 60));
  //     return minutesDifference;
  //   }

  //   loadingDispatch({
  //     type: "all",
  //     value: false,
  //   });
  //   console.log(filterValues);
  //   console.log(filterValues.app);
  //   console.log(filterValues.cam);
  //   console.log(filterValues.rfr);

  //   const getModelOutput = async () => {
  //     const res = await apiService.get(`${Endpoint.ALL_EVENTLOGS}`, {
  //       st: dateRange[0].unix() * 1000,
  //       et: dateRange[1].unix() * 1000,
  //       ...(filterValues.app.length > 0 ? { app: filterValues.app } : {}),
  //       ...(filterValues.cam.length > 0 ? { cam: filterValues.cam } : {}),
  //       ...(filterValues.rfr.length > 0 ? { rfr: filterValues.rfr } : {}),
  //       ...(filterValues.decision === "0" || filterValues.decision === "1"
  //         ? { decision: parseInt(filterValues.decision) }
  //         : {}),
  //     });
  //     console.log(res);
  //     modifyTableData(res.data.data);
  //     loadingDispatch({
  //       type: "table",
  //       value: false,
  //     });
  //   };

  //   const getUnitsData = async () => {
  //     const res = await apiService.get(`${Endpoint.UNITS_DATA}`, {
  //       st: dateRange[0].unix() * 1000,
  //       et: dateRange[1].unix() * 1000,
  //       ...(filterValues?.app.length > 0 ? { app: filterValues.app } : {}),
  //       ...(filterValues?.cam.length > 0 ? { cam: filterValues.cam } : {}),
  //       ...(filterValues?.rfr.length > 0 ? { rfr: filterValues.rfr } : {}),
  //     });
  //     console.log(res.data.data);
  //     setUnitsData(res.data.data);
  //     console.log(res.data.data?.processed?.value);
  //     console.log(
  //       getMinutesDifference(dateRange[0].unix(), dateRange[1].unix())
  //     );
  //     const result =
  //       res.data.data?.processed?.value /
  //       getMinutesDifference(dateRange[1].unix(), dateRange[0].unix());
  //     console.log(
  //       res.data.data?.processed?.value /
  //         getMinutesDifference(
  //           dateRange[0].unix() * 1000,
  //           dateRange[1].unix() * 1000
  //         )
  //     );
  //     const resultWithThreeDecimalPlaces = result.toFixed(2);
  //     setThroughput(resultWithThreeDecimalPlaces);
  //     loadingDispatch({
  //       type: "units",
  //       value: false,
  //     });
  //   };

  //   const getColumnChartData = async () => {
  //     const res = await apiService.get(`${Endpoint.COLUMN_CHART}`, {
  //       st: dateRange[0].unix() * 1000,
  //       et: dateRange[1].unix() * 1000,
  //       ...(filterValues.app.length > 0 ? { app: filterValues.app } : {}),
  //       ...(filterValues.cam.length > 0 ? { cam: filterValues.cam } : {}),
  //       ...(filterValues.rfr.length > 0 ? { rfr: filterValues.rfr } : {}),
  //     });
  //     //  console.log(res.data.data);
  //     if (res.data.data.length > 1) {
  //       const groupedData = res.data.data.reduce((result, currentItem) => {
  //         const existingItem = result.find(
  //           (item) => item.category === currentItem.category
  //         );

  //         if (existingItem) {
  //           // If item with the same name exists, add passed and rejected
  //           existingItem.passed += currentItem.passed;
  //           existingItem.rejected += currentItem.rejected;
  //         } else {
  //           // If item with the same name doesn't exist, add a new item
  //           result.push({
  //             category: currentItem.category,
  //             passed: currentItem.passed,
  //             rejected: currentItem.rejected,
  //           });
  //         }

  //         return result;
  //       }, []);
  //       console.log(groupedData);
  //       setColumnChartData(groupedData);
  //     } else {
  //       setColumnChartData(res.data.data);
  //     }

  //     loadingDispatch({
  //       type: "column",
  //       value: false,
  //     });
  //   };

  //   const getPieChartData = async () => {
  //     const res = await apiService.get(`${Endpoint.PI_CHART}`, {
  //       st: dateRange[0].unix() * 1000,
  //       et: dateRange[1].unix() * 1000,
  //       ...(filterValues.app.length > 0 ? { app: filterValues.app } : {}),
  //       ...(filterValues.cam.length > 0 ? { cam: filterValues.cam } : {}),
  //       ...(filterValues.rfr.length > 0 ? { rfr: filterValues.rfr } : {}),
  //     });
  //     if (res.data.data.length > 1) {
  //       const groupedData = res.data.data.reduce((result, currentItem) => {
  //         const existingItem = result.find(
  //           (item) => item.category === currentItem.category
  //         );

  //         if (existingItem) {
  //           // If item with the same name exists, add passed and rejected
  //           existingItem.value += currentItem.value;
  //         } else {
  //           // If item with the same name doesn't exist, add a new item
  //           result.push({
  //             category: currentItem.category,
  //             value: currentItem.value,
  //           });
  //         }

  //         return result;
  //       }, []);
  //       console.log(groupedData);
  //       setpieChartData(groupedData);
  //     } else {
  //       setpieChartData(res.data.data);
  //     }
  //     // setpieChartData(res.data.data);
  //     loadingDispatch({
  //       type: "pie",
  //       value: false,
  //     });
  //   };

  //   getModelOutput();
  //   getUnitsData();
  //   getColumnChartData();
  //   getPieChartData();
  // }

  // useEffect(() => {
  //   if (dateRange.length > 0) {
  //     // If dateRange is set, log the dates for verification
  //     console.log(dayjs(dateRange[0]));
  //     console.log(
  //       "Date range set:",
  //       dateRange[0].format("DD/MM/YYYY"),
  //       "-",
  //       dateRange[1].format("DD/MM/YYYY")
  //     );
  //   }
  // }, [dateRange]);

  return (
    <div
      className={`flex  h-[100vh] flex-col w-full bg-[#f7f7f7] overflow-auto relative ${
        isCollapsed ? "w-[95vw]" : "w-[75vw]"
      }`}
    >
      <div className="kpiArea h-full p-3">
        <div className="flex flex-row justify-center items-center gap-2">
          {["Shifts", "Products", "Defect Types", "Decision"].map(
            (item, index) => {
              return (
                <>
                  <div className="flex flex-col mt-2 basis-[20%] text-black">
                    <Select
                      key={index}
                      components={{
                        Option: InputOption,
                        MultiValue: ({ data, ...props }) => (
                          <MultiValue item={item} {...props} />
                        ),
                      }}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      placeholder={item}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: "#ffffff",
                          color: "#000000",
                          borderColor: "#CDD5DF",
                          flexBasis: "20%",
                        }),
                        option: (styles, { isDisabled, isFocused }) => {
                          return {
                            ...styles,
                            backgroundColor: isFocused
                              ? "#ffffff"
                              : "transparent",
                            color: "black",
                            cursor: isDisabled ? "not-allowed" : "default",
                          };
                        },
                      }}
                      options={
                        dropDownData &&
                        dropDownData[Object.keys(dropDownData)[index]]
                      }
                      isMulti
                      value={filteredParameters["item"]}
                      onChange={(selectedOption) =>
                        handleSelectChange(selectedOption, item)
                      }
                    />
                  </div>
                </>
              );
            }
          )}
          <RangePicker
            defaultValue={
              dateRange.length > 0
                ? [
                    dayjs(dateRange[0], "DD/MM/YYYY"),
                    dayjs(dateRange[1], "DD/MM/YYYY"),
                  ]
                : null
            }
            className="basis-[23%]"
            separator={<GoDash color="#1016D1" fontSize={"2.5vmin"} />}
            suffixIcon={<CiCalendar color="#1016D1" fontSize={"2.5vmin"} />}
            style={{
              padding: "0.70% 0.70%",
              backgroundColor: "#ffffff",
              marginTop: "8px",
            }}
            format="DD-MM-YYYY"
            onChange={handleRangeChange}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<DownloadOutlined />}
            size={"large"}
            className="download_btn h-10 w-10 mt-[8px] rounded-[50%] bg-[#1016D1]]"
            // onClick={handleDownload}
            // loading={loadingState.download}
          ></Button>
        </div>

        {/* Value Cards */}
        <div className="flex justify-between h-[20%] mb-[1%] text-white mt-4">
          <div className="w-[25%] h-[100%] p-[1%] mr-[1%] flex justify-around flex-col items-start border border-[##CDD5DF] bg-[#ffffff] rounded-md gap-4">
            <div className="flex flex-col justify-center items-start gap-4">
              <img src={Logs} alt="" />
              <span className="font-inter text-base text-[#000000]">
                Session Analysed
              </span>
            </div>
            <div className="w-[100%] flex justify-between">
              <h1 className="text-xl text-exo font-[600] text-black">
                {unitsData?.session_analyzed?.value || "-"}
              </h1>
              {isLoading ? (
                <Spin />
              ) : (
                generateState(
                  unitsData?.processed?.state || null,
                  unitsData?.processed?.state_value || null
                )
              )}
            </div>
          </div>
          <div className="w-[25%] h-[100%] p-[1%] mr-[1%] flex justify-around flex-col items-start border border-[##CDD5DF] bg-[#ffffff] rounded-md">
            <div className="flex flex-col justify-center items-start gap-4">
              <img src={Passed} alt="" />
              <span className="font-inter text-base text-[#000000]">
                Sessions Passed
              </span>
            </div>
            <div className="w-[100%] flex justify-between">
              <h1 className="text-xl text-exo font-[600] text-black">
                {unitsData?.passed?.value || "-"}
              </h1>
              {isLoading ? (
                <Spin />
              ) : (
                generateState(
                  unitsData?.passed?.state || null,
                  unitsData?.passed?.state_value || null
                )
              )}
            </div>
          </div>
          <div className="w-[25%] h-[100%] p-[1%] mr-[1%] flex justify-around flex-col items-start border border-[##CDD5DF] bg-[#ffffff] rounded-md">
            <div className="flex flex-col justify-center items-start gap-4">
              <img src={Logs} alt="" />
              <span className="font-inter text-base text-[#000000]">
                Sessions Failed
              </span>
            </div>
            <div className="w-[100%] flex justify-between">
              <h1 className="text-xl text-exo font-[600] text-black">
                {unitsData?.rejected?.value || "-"}
              </h1>
              {isLoading ? (
                <Spin />
              ) : (
                generateState(
                  unitsData?.rejected?.state || null,
                  unitsData?.rejected?.state_value || null
                )
              )}
              {}
            </div>
          </div>
          <div className="w-[25%] h-[100%] p-[1%] flex flex-col items-start justify-around border border-[##CDD5DF] bg-[#ffffff] rounded-md">
            <div className="flex flex-col justify-center items-start gap-4">
              <img src={Logs} alt="" />
              <span className="font-inter text-base text-[#000000] ">
                Session Passed (%)
              </span>
            </div>
            <div className="w-[100%] flex justify-between text-black">
              <h1 className="text-xl text-exo font-[600]">{50}</h1>
              {isLoading ? (
                <Spin />
              ) : (
                generateState(
                  unitsData?.throughput?.state || null,
                  unitsData?.throughput?.state_value || null
                )
              )}
            </div>
          </div>
        </div>
        {/* Value Cards */}
        <div className="flex flex-row h-[50%] mb-[1%] w-full bg-[#ffffff] rounded-md border ">
          <div className="flex flex-col h-full w-full">
            <div className="px-2 py-1">
              <p className="font-[400] text-lg text-[#000000]">
                Day Wise Session Count
              </p>
            </div>
            <SingleBarChart data={DayWiseSession} />
          </div>
        </div>
        {/* Chart Area */}
        <div className="flex flex-row h-[50%] mb-[1%]">
          <div className="w-[65%] mr-[1%] border bg-[#ffffff] rounded-md">
            {false ? (
              <>
                {isLoading && <Spin />}
                <div className="w-full h-full flex flex-row justify-center items-center text-xl text-[#000000]">
                  Oops there is no Data to visualize..
                </div>
              </>
            ) : (
              <div className="flex flex-col h-full">
                <div className="px-2 py-1">
                  <p className="font-[400] text-lg text-[#000000]">
                    Product Session Pass Vs Fail
                  </p>
                </div>
                <StackBarChart data={BarchartSessions} />
              </div>
            )}
          </div>
          <div className="w-[35%] border  bg-[#ffffff] rounded-md">
            {/* {loadingState.pie ? (
              <Spin />
            ) : (
              
            )} */}
            <div className="flex flex-col h-full">
              <div className="px-2 py-1">
                <p className="font-[400] text-lg text-[#000000]">
                  Defect Category
                </p>
              </div>
              <CustomPieChart data={PieChartData} />
            </div>
          </div>
        </div>
        {/* Chart Area

        

        {/* Table Area */}

        <div className="flex flex-row h-[50%] justify-between mb-[1%] w-full  gap-2 rounded-md ">
          <div className="basis-[50%] bg-[#ffffff] flex flex-col p-2 border ">
            <div className="px-2 py-1">
              <p className="font-[400] text-lg text-[#000000]">
                Weight
              </p>
            </div>
            <CustomLineChart data={weightChart} />
          </div>
          <div className="basis-[50%] bg-[#ffffff] border ">
            <div className="px-2 py-1">
              <p className="font-[400] text-lg text-[#000000]  ">
                Perforation
              </p>
            </div>
            <CustomLineChart data={perforationChart} />
          </div>
        </div>

        <div className="flex flex-row h-[30%] w-[100%] border  rounded-md">
          {isLoading ? (
            <Spin />
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
              // onRow={(record, index) => {
              //   return {
              //     onClick: (event) => {
              //       getAllUnitsSession(record.id);
              //       // console.log(column)
              //     },
              //   };
              // }}
            />
          )}
        </div>
        {/* Table Area */}
      </div>
    </div>
  );
}

export default Dashboard;
