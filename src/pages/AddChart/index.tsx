import { genChartByAiUsingPost, updateChartUsingPost } from '@/services/Power-Bi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, message, Row, Select, Space, Spin, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ReactECharts from 'echarts-for-react';
import React, { useState } from 'react';

/**
 * 添加图表页面
 * @constructor
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponse>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [option, setOption] = useState<any>();
  // const [updateChart, setUpdateChart] = useState<API.ChartUpdateRequest>();

  const onFinish = async (values: any) => {
    if (submitting) return;
    setSubmitting(true);
    //上传数据
    const params = {
      ...values,
      file: undefined,
    };

    const res = await genChartByAiUsingPost(params, {}, values.file.file.originFileObj);
    try {
      const chartOption = JSON.parse(res.data.genChart ?? '');
      console.log('chartoption', chartOption);
      if (!chartOption) {
        throw new Error('图表代码解析错误');
      } else {
        setChart(res.data);
        setOption(JSON.parse(res.data.genChart));
      }
      message.success('分析成功');
      console.log(res);
    } catch (e: any) {
      updateChartUsingPost({ id: res.data.chartId, status: 'failed' });
      message.error('分析失败', 3);
    }
    setSubmitting(false);
  };
  return (
    <div className="add_chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析">
            <Form name="addChart" onFinish={onFinish} initialValues={{}}>
              <Form.Item
                name="goal"
                label="分析目标"
                rules={[{ required: true, message: '请输入分析目标' }]}
              >
                <TextArea placeholder="请输入你的分析需求，比如：分析网站用户的增长情况" />
              </Form.Item>
              <Form.Item name="name" label="图表名称">
                <TextArea placeholder="请输入你的图表名称" />
              </Form.Item>
              <Form.Item name="chartType" label="图表类型" hasFeedback>
                <Select
                  options={[
                    { value: '折线图', label: '折线图' },
                    { value: '柱状图', label: '柱状图' },
                    // { value: '线柱混搭', label: '线柱混搭' },
                    { value: '饼图', label: '饼图' },
                    { value: '雷达图', label: '雷达图' },
                    { value: '散点图', label: '散点图' },
                    { value: '旭日图', label: '旭日图' },
                    { value: '桑基图', label: '桑基图' },
                    { value: '拓扑图', label: '拓扑图' },
                  ]}
                ></Select>
              </Form.Item>

              <Form.Item name="file" label="原始数据">
                <Upload name="file" listType="picture">
                  <Button icon={<UploadOutlined />}>上传CSV文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={submitting}
                  >
                    智能分析
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分析结论">{chart?.genResult ?? <div>请先在左侧进行提交</div>}</Card>
          <Divider />
          <Card title="可视化图表">
            {option ? <ReactECharts option={option} /> : <div>请先在左侧进行提交</div>}
            <Spin spinning={submitting} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
