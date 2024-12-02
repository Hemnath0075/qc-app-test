import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarchartSessions, occurences } from "../Mock/dashboard";

function VerticalStackBarChart({ data }) {
  const colors = ["#1F36C7", "#00D7C4", "#FF9F00", "#A020F0"];

  return (
    <div className="flex items-center justify-center h-[100%] ml-[20px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          barSize={80}
          width={500}
          height={300}
          layout="vertical"
          data={occurences}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          {/* <Tooltip cursor={{fill: 'transparent'}} /> */}
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, "dataMax + 10"]} />
          <YAxis type="category" dataKey={"name"} />
          <Tooltip cursor={{ fill: "transparent" }} />
          {/* <Legend layout="horizontal" align="right" verticalAlign="top" /> */}
          <Bar
            dataKey="number"
            // fill={(entry, index) => colors[index]}
            stackId="a"
            barSize={50}
            label={{ position: "right", fill:'black' }}
            activeBar={<Rectangle fill="#1F36C7" stroke="blue" />}
          >
            {occurences.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % 20]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VerticalStackBarChart;
