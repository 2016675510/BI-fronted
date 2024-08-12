import { genChartByAiAsyncUsingPost } from '@/services/Power-Bi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Form, message, Select, Space, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';

import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';

/**
 * 添加图表（异步）页面
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  const onFinish = async (values: any) => {
    if (submitting) return;
    setSubmitting(true);
    //上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiAsyncUsingPost(params, {}, values.file.file.originFileObj);

      if (!res?.data) {
        throw new Error('图表代码解析错误');
      } else {
        message.success('分析任务提交成功，稍后请在我的图表页面查看');
        //重置所有字段
        form.resetFields();
      }
    } catch (e: any) {
      message.warning('分析失败', 3);
    }
    setSubmitting(false);
  };
  return (
    <div className="add_chart">
      <Card title="智能分析">
        <Form
          form={form}
          name="addChart"
          labelAlign="left"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          initialValues={{}}
        >
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
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                智能分析
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChartAsync;
