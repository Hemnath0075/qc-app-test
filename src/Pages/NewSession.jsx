import React, { useEffect, useRef, useState } from "react";
import TopNav from "../Components/TopNav";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Barcode from "react-barcode";
import { useNavigate } from "react-router-dom";
import { Endpoint, apiService } from "../Services/apiService";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Image from "../Assets/Frame 9267.svg";
import Camera from "../Assets/Camera (1).svg";
import useWebSocket from "react-use-websocket";
import AnalysisBtn from "../Components/AnalysisBtn";
import RefreshIcon from "../Assets/refresh.svg";
import { CleaningServices } from "@mui/icons-material";

function NewSession({ isCollapsed }) {
  const [variantId, setVariantId] = useState(null);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productDetails, setProductDetails] = useState();
  const analysingSecondsRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [variantInfo, setVariantInfo] = useState();
  const [products, setProducts] = useState();
  const [variants, setVariants] = useState();
  const [barcodeAnalyzeId, setBarcodeAnalyzeId] = useState(0);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm();

  const handleExternalSubmit = () => {
    handleSubmit(onSubmit)(); // Call handleSubmit to trigger validation and onSubmit function
  };

  const startAnalyze = async () => {
    // console.log("start analyze for id ", unit_id);
    console.log(analysingSecondsRef.current);
    console.log(progress);
    analysingSecondsRef.current = 0;
    setProgress(10);
    const intervalId = setInterval(() => {
      setProgress((progress) => {
        // Check if the progress is 90 or more
        if (progress !== -1) {
          if (analysingSecondsRef.current > 30) {
            clearInterval(intervalId);
            return -1;
          } else if (progress >= 90) {
            clearInterval(intervalId); // Stop the interval
            return progress; // Return the current progress value
          } else {
            return progress + 10; // Otherwise, increment the progress
          }
        } else {
          return -1;
        }
      });
      analysingSecondsRef.current += 2;
    }, 2000);
    let endpoint = Endpoint.ANALYZE_CLD_BARCODE;
    const res = await apiService.post(endpoint);
    console.log(res);
    if (res.status === 201) {
      // toast.success(`Started Analyzing Barcode...`);
      // setBarcodeAnalyzeId(res.data.data);

      // getDetailsByBarcode();
      pingBarcodeAnalyze(res.data.data);
    }
  };

  console.log(analysingSecondsRef);

  const pingBarcodeAnalyze = async (id) => {
    // let counter = 1 ;
    console.log("called pingbarcodeanalyze");
    let endpoint = Endpoint.GET_RESULT_CLD_BARCODE;
    const res = await apiService.get(endpoint, { sid: id });
    console.log(res);
    if (res.status === 200) {
      setBarcodeAnalyzeId(res.data.data);
      getDetailsByBarcode(res.data.data);
      setProgress(100);
    } else if (res.status === 425) {
      if (analysingSecondsRef.current < 30) {
        console.log("check here ", analysingSecondsRef.current);
        setTimeout(() => {
          pingBarcodeAnalyze(id);
        }, 5000);
      } else {
        console.log("set progress to -1");
        setProgress(-1);
      }
    } else if (res.status === 500) {
      console.log("it must quit here ");
      setProgress(-1);
      // analysingSecondsRef.current = 0;
    }
  };

  // 18901030942676
  // 18901030937139
  const getDetailsByBarcode = async (code) => {
    let endpoint = Endpoint.GET_DETAILS_BY_BARCODE;
    const res = await apiService.get(endpoint, { code: code });
    console.log(res);
    setVariantId(res.data.data.product.variant.id);
    if (res.status === 200) {
      setProductDetails(res.data.data);
    }
  };

  const resetAnalyse = () => {
    setProgress(0);
  };

  const { lastMessage } = useWebSocket(`ws://localhost:8000/frame/1/get`, {
    onOpen: () => console.log("connected"),
    onMessage: handleEvent,
  });
  function handleEvent(e) {
    console.log(e);
    setImage(e.data);
  }
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      console.log(data);
      // const decoded = jwtDecode(localStorage.getItem("token"));
      // API LOGIC HERE
      // let payload = {
      //   product_id: data.product.value,
      //   variant_id: data.variant.value,
      //   user_id: decoded.sub,
      //   units: data.units,
      //   variant_info_id: variantInfo.variant_id, //TODO: change variant info id here
      //   // "start_ts": 1718564324676
      // };

      // let batch_code_payload = {
      //   property_type: "coding",
      //   value_type: "detection",
      //   label: "Batch code",
      //   value: data.batch_code,
      // };
      // console.log(batch_code_payload)
      // let batch_code_endpoint = Endpoint.ADD_BATCH_CODE.replace(
      //   "{variant_id}",
      //   variantId
      // );
      // const create_batch_code = await apiService.post(
      //   batch_code_endpoint,
      //   batch_code_payload
      // );
      // if (
      //   create_batch_code.status === 201 ||
      //   create_batch_code.status === 200
      // ) {
        let payload = {
          product_id: productDetails?.product?.id,
          variant_id: productDetails?.product?.variant?.id,
          units: data.units,
          // "start_ts": 1718564324676
        };
        console.log(payload);
        const res = await apiService.post(Endpoint.CREATE_SESSION, payload);
        console.log(res);
        if (res.status === 201) {
          setIsLoading(false);
          // toast.success("QC Session Created Succesfully");
          setTimeout(() => {
            navigate(`/session/${res.data.data}`);
          }, 1000);
        }
      // }
    } catch (err) {
      // catch error from response
      console.log(err);
    }
  };

  const fetchProductDetails = async () => {
    setIsLoading(true);
    let endpoint = Endpoint.GET_PRODUCT_DETAILS;

    // const res = await apiService.get(finalEndpoint);
  };

  const getVariantDetails = async () => {
    setIsLoading(true);
    const formValues = getValues();
    console.log(formValues);
    const productId = formValues.product.value;
    const variantId = formValues.variant.value;
    console.log(variantId);
    let endpoint = Endpoint.GET_VARIANT_INFO.replace("{product_id}", productId);
    let finalEndpoint = endpoint.replace("{variant_id}", variantId);
    // endpoint.replace("{variant_id}",variantId)
    console.log(endpoint);
    const res = await apiService.get(finalEndpoint);
    console.log(res);
    setVariantInfo(res.data.data[0]);
    setIsLoading(false);
  };

  const getVariants = async (value) => {
    setIsLoading(true);
    let endpoint = Endpoint.GET_ALL_VARIANTS.replace("{product_id}", value);
    const res = await apiService.get(endpoint);
    let variantOptions = [];
    res.data.data.map((item) => {
      variantOptions.push({ value: item.id, label: item.label });
    });
    setVariants(variantOptions);
    setIsLoading(false);
  };

  const fetchAllProducts = async () => {
    const res = await apiService.get(Endpoint.GET_ALL_PRODUCTS);
    let productsOptions = [];
    res.data.data.map((item) => {
      productsOptions.push({ value: item.id, label: item.label });
    });
    setProducts(productsOptions);
    setIsLoading(false);
  };
  console.log(products);

  const getValueForLabel = (label) => {
    if (productDetails?.product?.variant?.properties) {
      // Use find to get the first item that matches the label
      const foundItem = productDetails.product.variant.properties.find(
        (item) => item.label === label
      );

      // If an item is found, return its value; otherwise, return undefined or handle as needed
      return foundItem ? foundItem.value : "-";
    }
  };

  useEffect(() => {
    // fetchAllProducts();
  }, []);

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
      <div className="px-8 py-1">
        <div className="bg-white h-[95vh] mt-4 w-full rounded-[10px] flex flex-row">
          <div className="basis-[50%] px-8">
            <h2 className="text-2xl py-4">Start a New Session</h2>
            <div className="basis-[40%] flex flex-col h-full gap-4">
              <div className="w-[834px] h-[373px]">
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
                {image && (
                  <img
                    src={`data:image/png;base64,${image}`}
                    alt=""
                    className="w-[834px] h-[373px]"
                  />
                  // <video
                  //   src={"/jam.mp4"}
                  //   key={1}
                  //   height="70vh"
                  //   controls
                  //   className="z-[100000]"
                  //   loop
                  //   muted
                  //   autoPlay
                  // />
                )}
                {!image && (
                  <div className="w-[834px] h-[373px] border-[2px] flex flex-row justify-center items-center ">
                    <p>Loading Live Stream , Please wait</p>
                  </div>
                )}
                {/* {item.det_out.id == null && <video src={"/jam.mp4"} key={item} height="70vh" controls className="z-[100000]" loop muted autoPlay />} */}
              </div>
              <AnalysisBtn
                key={"AnlyzeCLDBarcode"}
                startAnalyze={startAnalyze}
                label={"CLD Barcode"}
                data={null}
                progress={progress}
              />
              {progress === 100 && (
                <div
                  className="cursor-pointer flex flex-row gap-4 w-full py-4 rounded-[10px] bg-[#BCC8C4] text-white text-md justify-center items-center font-[500]"
                  onClick={resetAnalyse}
                >
                  <img src={RefreshIcon} alt="" />
                  <p className="text-black">Retry Analyze CLD Barcode</p>
                </div>
              )}
              {/* <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-4 flex flex-col gap-2">
                  <label htmlFor="" className="text-lg">
                    Product Name
                  </label>
                  <Controller
                    name="product"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select"
                        options={products}
                        onChange={(e) => {
                          field.onChange(e);
                          getVariants(e.value);
                        }}
                      />
                    )}
                  />
                  {errors.email && (
                    <span className="text-[#DD0F0F]">
                      This field is required
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <label htmlFor="" className="text-lg">
                    Variant Name
                  </label>
                  <Controller
                    name="variant"
                    control={control}
                    render={({ field }) => (
                      <Select
                        placeholder="Variant name"
                        {...field}
                        options={variants}
                        onChange={(e) => {
                          field.onChange(e);
                          getVariantDetails(e.value);
                        }}
                      />
                    )}
                  />
                  {errors.email && (
                    <span className="text-[#DD0F0F]">
                      This field is required
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-row justify-start items-center gap-8">
                  <label htmlFor="" className="text-lg">
                    No. of Units to QC
                  </label>
                  <input
                    type="number"
                    className="border-[#CDD5DF] border-[2px] py-[10px] flex-auto px-4 rounded-[10px] text-md mt-2"
                    // placeholder="Enter your Email ID"
                    {...register("units", { required: true, maxLength: 20 })}
                  />
                  {errors.email && (
                    <span className="text-[#DD0F0F]">
                      This field is required
                    </span>
                  )}
                </div>
              </form> */}
            </div>
          </div>
          <div className="basis-[50%] py-4 px-2 flex flex-col gap-2">
            <div className="h-auto bg-[#F7F7F7] rounded-[10px] border-2 border-[#CDD5DF] flex flex-col px-4 py-4">
              <p className="text-2xl">Product Details</p>
              <div className="flex flex-col mt-1">
                <div className="flex flex-row justify-between items-center text-lg font-[500]">
                  <p className="mt-1 flex flex-row justify-between items-center text-lg text-[#697586]">
                    Product
                  </p>
                  <p>
                    {productDetails?.product?.label === null
                      ? "-"
                      : productDetails?.product?.label}
                  </p>
                </div>
              </div>
              <div className="flex flex-col mt-1">
                <div className="flex flex-row justify-between items-center text-lg font-[500]">
                  <p className="mt-1 flex flex-row justify-between items-center text-lg text-[#697586]">
                    Variant
                  </p>
                  <p>
                    {productDetails?.product?.variant?.label === null
                      ? "-"
                      : productDetails?.product?.variant?.label}
                  </p>
                </div>
              </div>
              <form action="" onSubmit={handleSubmit(onSubmit)}>
                {/* <div className="mt-0 flex flex-row justify-between items-center gap-8">
                  <div className="w-40">
                    <label htmlFor="" className="text-lg ">
                      Batch Code
                    </label>
                  </div>
                  <div className="basis-[10%]">
                    <input
                      type="text"
                      className="border-[#CDD5DF] w-32 basis-[10%] border-[2px] py-[6px]  px-4 rounded-[10px] text-md mt-2"
                      // placeholder="Enter your Email ID"
                      {...register("batch_code", {
                        required: true,
                        maxLength: 20,
                      })}
                    />
                  </div>
                  {errors.batch_code && (
                    <span className="text-[#DD0F0F]">
                      This field is required
                    </span>
                  )}
                </div> */}
                <div className="mt-1 flex flex-row justify-between items-center gap-8">
                  <div className="w-40">
                    <label htmlFor="" className="text-lg ">
                      No. of Units to QC
                    </label>
                  </div>
                  <div className="basis-[10%]">
                    <input
                      type="number"
                      className="border-[#CDD5DF] w-32 basis-[10%] border-[2px] py-[6px]  px-4 rounded-[10px] text-md mt-2"
                      // placeholder="Enter your Email ID"
                      {...register("units", { required: true, maxLength: 20 })}
                    />
                  </div>
                  {errors.units && (
                    <span className="text-[#DD0F0F]">
                      This field is required
                    </span>
                  )}
                </div>
              </form>
            </div>
            <div className="h-full bg-[#F7F7F7] rounded-[10px] border-2 border-[#CDD5DF] flex flex-col px-8 py-4">
              <p className="text-2xl">Reference Values</p>
              <div className="flex flex-col mt-1">
                <div className="flex flex-row justify-between items-center text-lg font-[500]">
                  <p>Coding</p>
                  <p>Reference Values</p>
                </div>
                <div className="mt-2 flex flex-row justify-between items-center text-lg text-[#697586]">
                  <p>USP</p>
                  <p>
                    {productDetails?.product?.variant?.properties
                      ? getValueForLabel("USP")
                      : "-"}
                  </p>
                </div>
                <div className="mt-2 flex flex-row justify-between items-center text-lg text-[#697586]">
                  <p>Price</p>
                  <p>
                    {productDetails?.product?.variant?.properties
                      ? getValueForLabel("Price")
                      : "-"}
                  </p>
                </div>
                <div className="mt-2 flex flex-row justify-between items-center text-lg text-[#697586]">
                  <p>Manufacturing Date (MD)</p>
                  <p>
                    {productDetails?.product?.variant?.properties
                      ? getValueForLabel("Manufacturing Date")
                      : "-"}
                  </p>
                </div>
                <div className="mt-2 flex flex-row justify-between items-center text-lg text-[#697586]">
                  <p>Expiry Date (ED)</p>
                  <p>
                    {productDetails?.product?.variant?.properties
                      ? getValueForLabel("Expiry Date")
                      : "-"}
                  </p>
                </div>
                <div className="mt-2 flex flex-row justify-between items-center text-lg text-[#697586]">
                  <p>Batch Code</p>
                  <p>
                    {productDetails?.product?.variant?.properties
                      ? getValueForLabel("Batch Code")
                      : "-"}
                  </p>
                </div>
                <div className="mt-2 flex flex-row justify-between items-center text-lg text-[#697586]">
                  <p>Factory Code</p>
                  <p>
                    {productDetails?.product?.variant?.properties
                      ? getValueForLabel("Factory Code")
                      : "-"}
                  </p>
                </div>
                <div className="mt-1 flex flex-col justify-between items-start text-lg gap-1">
                  <p className="font-[500]">Barcode</p>
                  {/* <p className="text-[#697586]">
                    {variantInfo?.det_in.barcode
                      ? variantInfo.det_in.barcode
                      : "-"}
                  </p> */}
                  <div className="flex flex-row justify-center items-center w-full">
                    {/* <Barcode value={"FE09W1"} width={"4%"} /> */}
                    <div className="mt-1 flex flex-row justify-between items-center text-lg text-[#697586] w-full">
                      <p>Value</p>
                      <p>
                        {productDetails?.product?.variant?.properties
                          ? getValueForLabel("Barcode")
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-2">
                  <div className="flex flex-row justify-between items-center text-lg font-[500]">
                    <p>Material Code</p>
                  </div>
                  <div className="mt-2 flex flex-row justify-between items-center text-lg text-[#697586]">
                    <p>Front</p>
                    <p>
                      {productDetails?.product?.variant?.properties
                        ? getValueForLabel("Front")
                        : "-"}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-row justify-between items-center text-lg text-[#697586]">
                    <p>Back</p>
                    <p>
                      {productDetails?.product?.variant?.properties
                        ? getValueForLabel("Back")
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="w-full bg-[#1F36C7] px-2 cursor-pointer py-4 rounded-[10px]"
              onClick={handleExternalSubmit}
            >
              <p className="text-white text-center text-lg font-[500]">
                Begin Session
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default NewSession;
