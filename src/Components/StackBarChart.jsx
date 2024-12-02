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
} from "recharts";
import { BarchartSessions } from "../Mock/dashboard";



function StackBarChart({ data }) {
  // const aggregatedData = data?.reduce((acc, item) => {
  //   const existing = acc.find((i) => i.name === item.name);
  //   if (existing) {
  //     existing.passed += parseInt(item.passed);
  //     existing.failed += parseInt(item.failed);
  //     existing.variants.push({
  //       variant: item.variant,
  //       passed: item.passed,
  //       failed: item.failed,
  //     });
  //   } else {
  //     acc.push({
  //       name: item.name,
  //       passed: parseInt(item.passed),
  //       failed: parseInt(item.failed),
  //       variants: [{ variant: item.variant, passed: item.passed, failed: item.failed }],
  //     });
  //   }
    
  //   return acc;
  // }, []);

  // console.log(aggregatedData)

  // const CustomTooltip = ({ active, payload }) => {
  //   console.log(payload)
  //   if (active && payload && payload.length) {
  //     const product = payload[0].payload;
  //     console.log(product)
  //     return (
  //       <div className="bg-white border p-2 rounded shadow">
  //         <h4 className="font-[600]">{product.name}</h4>
  //         <table class="w-full border-collapse mt-2">
  //           <thead>
  //             <tr>
  //               <th class="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-bold">
  //                 Variant
  //               </th>
  //               <th class="border border-gray-300 bg-gray-100 px-4 py-2 text-left text-[#1F36C7] font-bold">
  //                 Passed
  //               </th>
  //               <th class="border border-gray-300 bg-gray-100 px-4 py-2 text-left text-[#00D7C4] font-bold">
  //                 Failed
  //               </th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {product.variants.map((variant, index) => (
  //               <tr key={index}>
  //                 <td class="border border-gray-300 px-4 py-2">
  //                   {variant.variant}
  //                 </td>
  //                 <td class="border border-gray-300 px-4 py-2 text-[#1F36C7]">
  //                   {variant.passed}
  //                 </td>
  //                 <td class="border border-gray-300 px-4 py-2 text-[#00D7C4]">
  //                   {variant.failed}
  //                 </td>
  //               </tr>
  //             ))}
  //             <tr >
  //               <td class="border border-gray-300 font-[600] px-4 py-2">
  //                 {"Total"}
  //               </td>
  //               <td class="border border-gray-300 px-4 font-[600] py-2 text-[#1F36C7]">
  //                 {product.passed}
  //               </td>
  //               <td class="border border-gray-300 px-4 font-[600] py-2 text-[#00D7C4]">
  //                 {product.failed}
  //               </td>
  //             </tr>
  //           </tbody>
  //         </table>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  const colors = ['#1F36C7', '#00D7C4', '#FF9F00', '#A020F0'];

  return (
    <div className="flex items-center justify-center h-[100%]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          barSize={80}
          width={500}
          height={300}
          data={BarchartSessions}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          {/* <Tooltip cursor={{fill: 'transparent'}} /> */}
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip cursor={{fill: 'transparent'}}/>
          {/* <Legend layout="horizontal" align="right" verticalAlign="top" /> */}
          <Bar
            dataKey="minor_stoppage"
            fill="#1F36C7"
            stackId="a"
            activeBar={<Rectangle fill="#1F36C7" stroke="blue" />}
          />
          <Bar
            dataKey="changeover"
            fill="#00D7C4"
            stackId="a"
            activeBar={<Rectangle fill="#00D7C4" stroke="purple" />}
          />
          <Bar
            dataKey="cutting_blade_change"
            fill="#FF9F00"
            stackId="a"
            activeBar={<Rectangle fill="#FF9F00" stroke="purple" />}
          />
          <Bar
            dataKey="others"
            fill="#A020F0"
            stackId="a"
            activeBar={<Rectangle fill="#A020F0" stroke="purple" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StackBarChart;
