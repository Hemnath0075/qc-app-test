export const drop_down_config = {
  data: {
    Shifts: [
      {
        value: 1,
        label: "Shift A (9-12)",
      },
      {
        value: 2,
        label: "Shift B (12-3)",
      },
      {
        value: 3,
        label: "Shift C (3-6)",
      },
    ],
    products: [
      {
        value: 1,
        label: "Clinic Plus",
      },
      {
        value: 2,
        label: "Product X",
      },
    ],
    defect_reasons: [
      {
        value: 10,
        label: "Wrong Coding",
      },
      {
        value: 11,
        label: "Wrong Material Code",
      },
      {
        value: 12,
        label: "Wrong Weight",
      },
      {
        value: 13,
        label: "Wrong Perforation",
      },
    ],
    decision: [
      {
        value: 1,
        label: "True",
      },
      {
        value: 2,
        label: "False",
      },
    ],
  },
};

export const units = {
  data: {
    session_analyzed: {
      value: 20,
      state: null,
      state_value: null,
    },
    passed: {
      value: 10,
      state: null,
      state_value: null,
    },
    failed: {
      value: 10,
      state: null,
      state_value: null,
    },
  },
};

export const getAllSessions = {
  data: [
    {
      id: 1,
      units: 5,
      start_ts: 1721910384686,
      end_ts: 1721922053423,
      product: {
        id: 1,
        label: "CLINIC PLUS",
      },
      variant: {
        id: 1,
        label: "CLINIC PLUS STRONG AND LONG 960X6 ML",
      },
      user: {
        id: 1,
        email: "tester@email.com",
        name: "random user",
      },
    },
    {
        id: 2,
        units: 5,
        start_ts: 1721910384686,
        end_ts: 1721922053423,
        product: {
          id: 1,
          label: "CLINIC PLUS1",
        },
        variant: {
          id: 1,
          label: "CLINIC PLUS STRONG AND LONG 960X6 ML",
        },
        user: {
          id: 1,
          email: "tester@email.com",
          name: "random user",
        },
      },
  ],
};

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
