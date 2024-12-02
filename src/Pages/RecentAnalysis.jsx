import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Table } from 'antd';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { allStoppageTable } from '../Mock/dashboard';


const loss_events = [
    {
      title: "Stop Time",
      dataIndex: "timestring",
      width: "20%",
    },
    {
      title: "Line No",
      dataIndex: "line_no",
      width: "20%",
    },
    {
      title: "Machine Name",
      dataIndex: "machine_name",
      width: "20%",
    },
  
    {
      title: "Stoppage Type",
      dataIndex: "stoppage_type",
      width: "20%",
    },
    {
      title: "Stoppage Duration",
      dataIndex: "stoppage_duration",
      width: "20%",
    },
  ];

function RecentAnalysis({isCollapsed}) {
    const [loadingState,setLoadingState] = useState(false)
    const navigate = useNavigate()
  return (
    <div className={`flex  h-[100vh] flex-col w-full bg-[#f7f7f7] overflow-auto relative ${isCollapsed ? 'w-[95vw]':'w-[75vw]'}`}>
      {/* <TopNav /> */}
      <div className="p-8">
        <div className="flex flex-row justify-between items-center w-full">
          <h2 className="text-3xl">Recent Loss Of Events</h2>
          
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
              columns={loss_events}
              bordered={false}
              dataSource={allStoppageTable}
              pagination={false}
              scroll={{
                y: "80vh",
              }}
              onRow={(record, index) => {
                return {
                  onClick: (event) => {
                    navigate("/1");
                    // getAllUnitsSession(record.id);
                    // console.log(column)
                  },
                };
              }}
            />
          )}
          
        </div>
      </div>
    </div>
  )
}

export default RecentAnalysis