export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/', redirect: '/bi/add' },
  {
    path: '/bi',
    name: 'AI图表分析',
    icon: 'SlidersTwoTone',
    routes: [
      {
        path: '/bi/add_async',
        name: '图表分析(异步)',
        icon: 'SlidersTwoTone',
        component: './AddChartAsync',
      },
      { path: '/bi/add', name: '图表分析', icon: 'BoxPlotTwoTone', component: './AddChart' },

      { name: '我的图表', icon: 'PieChartTwoTone', path: '/bi/list', component: './MyChart' },
    ],
  },
  {
    path: '/ai',
    name: '智慧AI',
    icon: 'FundTwoTone',
    routes: [
      {
        path: '/ai/add_excel',
        name: 'Excel表格生成',
        icon: 'FundTwoTone',
        component: './AddExcel',
      },
      { path: 'ai/assistant', name: 'AI问答', icon: 'FundTwoTone', component: './AiAssistant' },
    ],
  },
  {
    name: '个人中心',
    icon: 'SmileTwoTone',
    path: '/user/center',
    component: './User/UserCenter',
  },
  { path: '*', layout: false, component: './404' },
];
