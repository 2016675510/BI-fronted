import { genExcelByAiUsingPost } from '@/services/Power-Bi/chartController';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, message, Row, Select, SelectProps, Space, Table } from 'antd';
import * as ExcelJs from 'exceljs';
import { saveAs } from 'file-saver';
import React, { useState } from 'react';

/**
 * 添加图表页面
 * @constructor
 */
const AddExcel: React.FC = () => {
  // const [chart, setChart] = useState<API.BiResponse>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  // const [option, setOption] = useState<any>();
  // const [excelData, setExcelData] = useState<any>();
  // const [goal] = useState<any>();
  const [dataSource, setDataSource] = useState<any>();
  const [columns, setColumns] = useState<any>();
  const [exported, setExported] = useState<boolean>(true);
  // const [aiLoading, setAiLoading] = useState<boolean>(false);

  const options: SelectProps['options'] = [
    {
      value: '生成表单：学生信息表',
      label: '生成表单：学生信息表',
    },
    {
      value: '生成表单：客户满意度调查报告',
      label: '生成表单：客户满意度调查报告',
    },
    {
      value: '生成结构化内容:规划一个成都户外团建活动的行程',
      label: '生成结构化内容:规划一个成都户外团建活动的行程',
    },
    {
      value: '收集整理数据 : 给出中国各省的 GDP 和人口数据',
      label: '收集整理数据 : 给出中国各省的 GDP 和人口数据',
    },
    {
      value: '新建数据表 : 新建任务管理表，追踪不同任务的责任人、进度和时间节点',
      label: '新建数据表 : 新建任务管理表，追踪不同任务的责任人、进度和时间节点',
    },
  ];

  // 生成数据源
  function generateTableData(data) {
    if (data === null) return;
    const header = data.shift(); // 获取表头并移除它
    return data.map((row, index) => {
      const item = {};
      header.forEach((title, colIndex) => {
        item[title] = row[colIndex];
      });
      return {
        key: String(index + 1),
        ...item,
      };
    });
  }

  // 生成列配置
  function generateColumns(header) {
    if (header === null) return;
    return header.map((title) => ({
      title,
      dataIndex: title,
      key: title,
    }));
  }

  const downloadFile = async () => {
    if (submitting) return;
    if (dataSource === null) return;
    setSubmitting(true);
    //文件下载
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    onExportBasicExcel();
    message.info('下载成功');
    setSubmitting(false);
  };

  function generateHeaders(columns: any[]) {
    return columns?.map((col) => {
      const obj = {
        // 显示的 name
        header: col.title,
        // 用于数据匹配的 key
        key: col.dataIndex,
        // 列宽
        width: col.width / 5 || 20,
      };
      return obj;
    });
  }

  function saveWorkbook(workbook: any, fileName: string) {
    // 导出文件
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: '' });
      saveAs(blob, fileName);
    });
  }

  function onExportBasicExcel() {
    // 创建工作簿
    const workbook = new ExcelJs.Workbook();
    // 添加sheet
    const worksheet = workbook.addWorksheet('sheet1');
    // 设置 sheet 的默认行高
    worksheet.properties.defaultRowHeight = 20;
    // 设置列
    worksheet.columns = generateHeaders(columns);
    // 添加行
    worksheet.addRows(dataSource);
    // 导出excel
    saveWorkbook(workbook, 'sampleData.xlsx');
  }

  // 使用这些函数生成数据源和列配置
  const onFinish = async (values: any) => {
    if (submitting) return;
    setSubmitting(true);
    const encodedValues = {};
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        encodedValues[key] = encodeURIComponent(values[key]);
      }
    }
    //上传数据
    const params = {
      ...encodedValues,
    };
    try {
      const res = await genExcelByAiUsingPost(params, {});
      console.log('res0', res[0]);
      setColumns(generateColumns(res[0]));
      setDataSource(generateTableData(res));
      message.info('生成成功');
    } catch (e: any) {
      message.error('生成失败', 3);
    }
    setExported(false);
    setSubmitting(false);
  };

  /*
   * ai助手
   *
   * */

  // const [aiMessage, setAiMessage] = useState('');
  // const [sseData, setSseData] = useState('');
  // const eventSourceRef = useRef(null);

  // const startSSE = () => {
  //   //清空sseData原始内容
  //   setSseData('');
  //   if (eventSourceRef.current) {
  //     eventSourceRef.current.close();
  //   }
  //
  //   // const url = `http://localhost:8080/sse?${queryString}`;
  //
  //   const eventSource = new EventSource(
  //     `http://localhost:8101/api/chart/sse?userMessage=${aiMessage}`,
  //   );
  //
  //   eventSource.onmessage = (event) => {
  //     console.log('event', event.data);
  //     //拼接之前数据
  //     setSseData((prevData) => prevData + event.data);
  //   };
  //
  //   eventSource.onerror = (event) => {
  //     if (event.eventPhase === EventSource.CLOSED) {
  //       console.log('sseData', sseData);
  //       console.log('连接关闭');
  //       eventSource.close();
  //       setAiLoading(false);
  //     }
  //   };
  //   eventSource.onopen = () => {
  //     console.log('连接打开');
  //     setAiLoading(true);
  //   };
  //   eventSourceRef.current = eventSource;
  // };
  //
  // const stopSSE = () => {
  //   if (eventSourceRef.current) {
  //     eventSourceRef.current.close();
  //     setAiLoading(false);
  //   }
  // };

  return (
    <div className="add_chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智慧生成" style={{ marginBottom: 10, minHeight: '500px' }}>
            <Form name="addChart" onFinish={onFinish} initialValues={{}}>
              <Form.Item
                name="goal"
                label="生成目标"
                rules={[{ required: true, message: '请输入分析目标' }]}
              >
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="请输入你的分析需求"
                  options={options}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 12 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={submitting}
                  >
                    智能生成
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
          {/*<Card*/}
          {/*  title="AI助手"*/}
          {/*  style={{*/}
          {/*    marginBottom: 20,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <div style={{ margin: '16px', minHeight: '410px', maxWidth: '600px' }}>*/}
          {/*    /!*<TextArea value={sseData} readOnly autoSize={{ minRows: 5, maxRows: 10 }}></TextArea>*!/*/}
          {/*    <div style={{ display: 'flex', marginTop: '10px' }}>*/}
          {/*      <Input*/}
          {/*        value={aiMessage}*/}
          {/*        onChange={(e) => setAiMessage(e.target.value)}*/}
          {/*        placeholder="请输入问题"*/}
          {/*        style={{ flex: 1, marginRight: '10px' }}*/}
          {/*      />*/}
          {/*      <Button type="primary" loading={aiLoading} onClick={startSSE}>*/}
          {/*        发送*/}
          {/*      </Button>*/}
          {/*      <Button type="primary" style={{ marginLeft: '10px' }} onClick={stopSSE}>*/}
          {/*        停止*/}
          {/*      </Button>*/}
          {/*    </div>*/}
          {/*    <Divider />*/}
          {/*    <div style={{ display: 'flex', marginTop: '10px' }}>*/}
          {/*      <TextArea*/}
          {/*        readOnly*/}
          {/*        autoSize={{ minRows: 5, maxRows: 20 }}*/}
          {/*        type="text"*/}
          {/*        value={sseData}*/}
          {/*        placeholder="ai生成结果"*/}
          {/*      />*/}
          {/*      /!*<MdView content={sseData} />*!/*/}
          {/*    </div>*/}

          {/*    /!*<ReactMarkdown source={sseData} />*!/*/}
          {/*    /!*<ReactMarkdown>{sseData}</ReactMarkdown>*!/*/}
          {/*  </div>*/}
          {/*</Card>*/}
        </Col>
        <Col span={12}>
          <Card
            title="数据预览"
            extra={
              <Button
                type="primary"
                shape="round"
                loading={submitting}
                disabled={exported}
                icon={<DownloadOutlined />}
                onClick={downloadFile}
                download
              >
                导出
              </Button>
            }
            style={{ marginBottom: 10, minHeight: '500px' }}
          >
            {<Table columns={columns} dataSource={dataSource} /> ?? <div>请先在左侧进行提交</div>}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddExcel;
