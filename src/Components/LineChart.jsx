import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function CustomLineChart({ data }) {
     console.log(data)
  return (
    <div className="flex flex-row items-center justify-center h-[100%]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend layout="horizontal" align="right" verticalAlign="top" />
          {data[0]?.weight && <Line
            type="monotone"
            dataKey="weight"
            stroke="#002BC5"
            activeDot={{ r: 8 }}
          />}
          {data[0].avg && <><Line
            type="monotone"
            dataKey="avg"
            stroke="#002BC5"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="min"
            stroke="#002BC5"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="max"
            stroke="#002BC5"
            activeDot={{ r: 8 }}
          /></>}
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomLineChart;
