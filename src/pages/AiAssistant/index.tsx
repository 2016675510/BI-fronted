import MdView from '@/components/MdView';
import { getAiContentUsingGet, queryAiUsingGet } from '@/services/Power-Bi/aiContentController';
import { DownCircleTwoTone, SearchOutlined, UpCircleTwoTone } from '@ant-design/icons';
import { Button, Card, Col, Collapse, Divider, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';

const Assistant: React.FC = () => {
  const [aiMessage, setAiMessage] = useState('');
  const [sseData, setSseData] = useState('');
  // const eventSourceRef = useRef(null);
  // const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const [history, setHistory] = useState<
  //   { question: string; answer: string; createdTime: string }[]
  // >([]);
  const [groupedHistory, setGroupedHistory] = useState<any>({});

  // 将ISO日期转换为正常日期格式
  function convertToNormalDate(isoDateString) {
    // 创建一个 Date 对象
    const date = new Date(isoDateString);
    // 使用 toLocaleString 方法来格式化日期
    // 这里使用 'zh-CN' 表示使用中文格式
    // 你可以根据需要调整选项
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      // hour: '2-digit',
      // minute: '2-digit',
      // second: '2-digit',
    };
    const normalDate = date.toLocaleString('zh-CN', options);

    return normalDate;
  }

  // let [isComplete, setIsComplete] = useState<boolean>(false);
  // const saveMessage = () => {
  //   setHistory([...history, { question: aiMessage, answer: sseData }]);
  //   setIsComplete(false);
  // };
  //
  // useEffect(() => {
  //   // 当 sseData 发生变化时，触发 dataSaved 事件
  //   if (isComplete) saveMessage();
  // }, [isComplete]);
  //页面初始化装载History数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setHistory([]);
        setGroupedHistory({});
        const res = await getAiContentUsingGet();
        if (res.code === 0) {
          //循环变例res.data,取出历史记录，赋值给history
          for (let i = 0; i < res.data.length; i++) {
            const item = res.data[i];
            console.log('item', item.createTime);
            const normalDate = convertToNormalDate(item.createTime);
            // setHistory((prevHistory) => [
            //   ...prevHistory,
            //   { question: item.question, answer: item.answer, createdTime: normalDate },
            // ]);
            // console.log('history', history);
            if (!groupedHistory[normalDate]) {
              groupedHistory[normalDate] = [];
            }
            groupedHistory[normalDate].push({ question: item.question, answer: item.answer });
          }
          setGroupedHistory({ ...groupedHistory });
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    fetchData();
  }, [loading]);

  const start = async () => {
    try {
      setLoading(true);
      //装载数据
      const param = { userMessage: aiMessage };
      const res = await queryAiUsingGet(param);
      setSseData(res.data);
      // setHistory([...history, { question: aiMessage, answer: res.data, createdTime: new Date() }]);
    } catch (e: any) {
      console.log(e);
    }
    setLoading(false);
  };

  // const startSSE = async () => {
  //   //清空sseData原始内容
  //   setSseData('');
  //   if (eventSourceRef.current) {
  //     eventSourceRef.current.close();
  //   }
  //
  //   const eventSource = new EventSource(
  //     `http://localhost:8101/api/chart/sse?userMessage=${aiMessage}`,
  //     {
  //       withCredentials: true, // 启用携带 cookie
  //     },
  //   );
  //   //
  //   //
  //   eventSource.onmessage = (event) => {
  //     //拼接之前数据
  //     if (event.data === '】') {
  //       setIsComplete(true); // 设置 isComplete 为 true，以便在 sseData 更新后保存历史记录
  //     } else {
  //       setSseData((prevData) => prevData + event.data);
  //     }
  //   };
  //
  //   eventSource.onerror = (event) => {
  //     if (event.eventPhase === EventSource.CLOSED) {
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
  //     saveMessage();
  //   }
  // };

  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card
            title="AI助手"
            style={{
              marginBottom: 20,
            }}
          >
            <div
              style={{
                margin: '16px',
                minHeight: '410px',
                maxHeight: '700px',
              }}
            >
              {/*<TextArea value={sseData} readOnly autoSize={{ minRows: 5, maxRows: 10 }}></TextArea>*/}
              <div style={{ display: 'flex', marginTop: '10px' }}>
                <TextArea
                  value={aiMessage}
                  placeholder="请输入问题"
                  onChange={(e) => setAiMessage(e.target.value)}
                  style={{ minWidth: '100px', flex: 1, marginRight: '10px', fontSize: '16px' }}
                  autoSize={{ minRows: 1, maxRows: 10 }}
                ></TextArea>
                <Button
                  type="primary"
                  size={'middle'}
                  loading={loading}
                  onClick={start}
                  shape="circle"
                  icon={<SearchOutlined />}
                />
                {/*<Button loading={loading} onClick={start} icon={<UpCircleTwoTone />}></Button>*/}
              </div>
              <Divider />
              <div style={{ display: 'flex', marginTop: '10px' }}>
                {/*<Button type="primary" loading={aiLoading} onClick={startSSE}>*/}
                {/*  发送（流式）*/}
                {/*</Button>*/}
                {/*<Button type="primary" style={{ marginLeft: '10px' }} onClick={stopSSE}>*/}
                {/*  停止*/}
                {/*</Button>*/}
                {/*<Button*/}
                {/*  type="primary"*/}
                {/*  loading={loading}*/}
                {/*  style={{ marginLeft: '10px' }}*/}
                {/*  onClick={start}*/}
                {/*>*/}
                {/*  发送*/}
                {/*</Button>*/}
              </div>

              <div
                style={{
                  display: 'flex',
                  marginTop: '10px',
                  width: '100%',
                  overflowY: 'auto',
                  minHeight: '260px',
                  maxHeight: '600px',
                  maxWidth: '100%',

                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '5px',
                }}
              >
                <MdView content={sseData} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="历史问答">
            <div
              style={{ margin: '16px', minHeight: '410px', maxHeight: '700px', overflowY: 'auto' }}
            >
              {Object.entries(groupedHistory).map(([date, items], index) => (
                <Collapse
                  key={index}
                  bordered={false}
                  defaultActiveKey={['1']}
                  expandIcon={({ isActive }) => (
                    <span style={{ fontSize: '16px' }}>
                      {isActive ? <DownCircleTwoTone /> : <UpCircleTwoTone />}
                    </span>
                  )}
                >
                  <Collapse.Panel
                    style={{ margin: '10px 1', fontSize: '16px' }}
                    header={`日期: ${date}`}
                    key={date}
                  >
                    {/* 嵌套使用 Collapse 组件来表示每个问答 */}
                    <Collapse
                      bordered={false}
                      defaultActiveKey={['1']}
                      expandIcon={({ isActive }) => (
                        <span style={{ fontSize: '16px' }}>
                          {isActive ? <DownCircleTwoTone /> : <UpCircleTwoTone />}
                        </span>
                      )}
                    >
                      {items.map((item, idx) => (
                        <Collapse.Panel
                          key={idx} // 使用复合 key
                          header={<strong>问题: {item.question}</strong>}
                          extra={<div style={{ fontSize: '16px' }}>回答</div>}
                        >
                          <div
                            style={{
                              display: 'flex',
                              marginTop: '10px',
                              overflowY: 'auto',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                            }}
                          >
                            <MdView content={item.answer} />
                          </div>
                        </Collapse.Panel>
                      ))}
                    </Collapse>
                  </Collapse.Panel>
                </Collapse>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Assistant;
