export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/', redirect: '/add' },
  { path: '/add_excel', name: '智能生成', icon: 'FundTwoTone', component: './AddExcel' },

  { path: '/add', name: '智能分析', icon: 'BoxPlotTwoTone', component: './AddChart' },
  {
    path: '/add_async',
    name: '智能分析(异步)',
    icon: 'SlidersTwoTone',
    component: './AddChartAsync',
  },
  { name: '我的图表', icon: 'PieChartTwoTone', path: '/list', component: './MyChart' },
  {
    name: '个人中心',
    icon: 'PieChartTwoTone',
    path: '/user/center',
    component: './User/UserCenter',
  },
  { path: '*', layout: false, component: './404' },
];
