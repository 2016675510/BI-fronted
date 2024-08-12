import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const SignIn = ({ onSignIn }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSignIn = () => {
    // 假设这是一个异步调用后端的函数
    onSignIn().then(() => {
      // 签到成功后关闭模态框，实际应用中应基于实际响应来处理
      setIsVisible(false);
    });
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsVisible(true)}>
        签到领取积分
      </Button>
      <Modal
        title="签到成功"
        visible={isVisible}
        onOk={() => setIsVisible(false)}
        onCancel={() => setIsVisible(false)}
      >
        <p>签到成功，积分已更新！</p>
      </Modal>
    </>
  );
};

export default SignIn;
