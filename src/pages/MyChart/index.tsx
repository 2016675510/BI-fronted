import {deleteChartUsingPost, listMyChartVoByPageUsingPost,} from '@/services/Power-Bi/chartController';
import {DeleteTwoTone} from '@ant-design/icons';
import {useModel} from '@umijs/max';
import {Avatar, Button, Card, Collapse, List, message, Popconfirm, PopconfirmProps, Result,} from 'antd';
import {Text} from 'antd-mobile-alita';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, {useEffect, useState} from 'react';

/**
 * 添加图表页面
 * @constructor
 */
const MyChart: React.FC = () => {
  const initSearchParams = { current: 1, pageSize: 4, sortField: 'createTime', sortOrder: 'desc' };
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({
    ...initSearchParams,
  });
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart>();
  const [total, setTotal] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartVoByPageUsingPost(searchParams);
      if (res.data) {
        if (res.data.records) {
          res.data.records.forEach((data) => {
            //如果状态为succeed，才会解析图表代码
            if (data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              if (chartOption.title !== null) chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
          setChartList(res.data.records ?? []);
          setTotal(res.data.total ?? 0);
        }
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败', e.message);
    }
    setLoading(false);
  };


  // const confirm: PopconfirmProps['onConfirm'] = (e) => {
  //   console.log(e);
  //   message.success('Click on Yes');
  // };
  const confirm: (id: number) => void = (id) => {
    deleteChart(id);
    // 在这里使用id做删除操作
  };
  const deleteChart = async (id: number) => {
    try {
      const response = await deleteChartUsingPost({ id });
      console.log(response);
      if (response.code === 0) {
        // 删除成功后重新加载数据
        loadData();
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      console.error(error);
      message.error('删除过程中发生错误');
    }
  };
  const cancel: PopconfirmProps['onCancel'] = (e) => {
    // console.log(e);
    // message.error('Click on No');
  };

  //钩子函数，[searchParams]发送变化时，会自动执行
  useEffect(() => {
    loadData();
  }, [searchParams]);
  const { Meta } = List.Item;

  return (
    <div className="my-chart-page">
      <div>
        <Search
          loading={loading}
          placeholder="请输入图表名称"
          enterButton
          onSearch={(value) => {
            setSearchParams({
              ...initSearchParams,
              name: value,
            });
          }}
        />
      </div>
      <div className="margin-16" />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          pageSize: searchParams.pageSize,
          total: total,
          current: searchParams.current,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <Card>
            <List.Item key={item.id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between', // 水平间距分布，使按钮靠右
                  alignItems: 'center', // 垂直居中对齐
                }}
              >
                <Meta
                  avatar={<Avatar src={currentUser?.userAvatar || 'https://friends-backends-image.oss-cn-shenzhen.aliyuncs.com/2024-03/23.png'} />}
                  title={item.name}
                  description={item.chartType ? '图表类型:' + item.chartType : undefined}
                />
                <Popconfirm
                  title="Delete the chart"
                  description="Are you sure to delete this chart?"
                  onConfirm={() => confirm(item.id)}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="dashed" icon={<DeleteTwoTone />} />
                </Popconfirm>
              </div>
              {/*<Button type="dashed" icon={<DeleteTwoTone />}></Button>*/}
              {/*<List.Item.Meta*/}
              {/*  avatar={<Avatar src={currentUser?.userAvatar} />}*/}
              {/*  title={item.name}*/}
              {/*  description={item.chartType ? '图表类型:' + item.chartType : undefined}*/}
              {/*></List.Item.Meta>*/}

              <>
                {item.status === 'wait' && (
                  <>
                    <Result
                      status="warning"
                      title="待生成"
                      subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等待'}
                    />
                  </>
                )}
                {item.status === 'running' && (
                  <>
                    <Result status="info" title="图表生成中" subTitle={item.execMessage} />
                  </>
                )}
                {item.status === 'succeed' && (
                  <>
                    <div style={{ marginBottom: 16 }} />
                    <p>{'分析目标:' + item.goal}</p>
                    <div style={{ marginBottom: 16 }} />
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart ?? '{}')} />
                    <Collapse
                      size="small"
                      items={[
                        {
                          key: '1',
                          label: '结论',
                          children: <Text wrap="false">{item.genResult}</Text>,
                        },
                      ]}
                    />
                  </>
                )}
                {item.status === 'failed' && (
                  <>
                    <Result status="error" title="图表生成失败" subTitle={item.execMessage} />
                  </>
                )}
              </>
            </List.Item>
          </Card>
        )}
      />
    </div>
  );
};
export default MyChart;
