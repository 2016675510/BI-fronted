import { uploadImageUsingPost } from '@/services/Power-Bi/fileController';
import {
  getLoginUserUsingGet,
  signUsingPost,
  updateMyUserUsingPost,
} from '@/services/Power-Bi/userController';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  GetProp,
  Input,
  message,
  Row,
  Tag,
  Upload,
  UploadProps,
} from 'antd';
import React, { useEffect, useState } from 'react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const Login: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  let { currentUser } = initialState ?? {};
  const [points, setPoints] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [activeTabKey2, setActiveTabKey2] = useState<string>('info');
  const onTab2Change = (key: string) => {
    setActiveTabKey2(key);
  };
  const handleChange: UploadProps['onChange'] = async (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    const res = await uploadImageUsingPost({}, info.file.originFileObj as FileType);
    console.log('res', res?.data);
    if (res?.code === 0) {
      setLoading(false);
      setImageUrl(res?.data);
      currentUser.userAvatar = res?.data;
      message.success('上传成功');
    } else {
      message.error('上传失败');
    }
  };

  /**
   * 登陆成功后，获取登录用户信息
   */
  const fetchUserInfo = async () => {
    const userInfo = await getLoginUserUsingGet();
    currentUser = userInfo;
    setPoints(currentUser?.data?.user_points);
    console.log('userInfo', currentUser);
  };

  // fetchUserInfo();
  //当用户信息更新时，重新获取用户信息
  useEffect(() => {
    fetchUserInfo();
  }, [currentUser]);

  //修改信息
  const onFormSubmit = async (values: any) => {
    try {
      const res = await updateMyUserUsingPost(values, {});
      if (res?.code === 0) {
        message.info('修改成功');
        currentUser.userName = res.data.userName;
      }
    } catch (e: any) {
      message.error('修改失败', 5);
    }
  };
  const tabListNoTitle = [
    {
      key: 'info',
      label: '个人信息',
    },
    {
      key: 'updateInfo',
      label: '修改信息',
    },
  ];
  const contentListNoTitle: Record<string, React.ReactNode> = {
    info: (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'left',
            marginBottom: 24,
          }}
        >
          <img
            src={imageUrl ? imageUrl : currentUser?.userAvatar}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
            }}
          ></img>
        </div>

        <Descriptions
          bordered
          style={{ marginTop: '20px', width: '500px' }}
          column={{ xxl: 1, xl: 1, lg: 1, md: 3, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="昵称">{currentUser?.userName}</Descriptions.Item>
          <Descriptions.Item label="ID">{currentUser?.id}</Descriptions.Item>
        </Descriptions>
      </>
    ),
    updateInfo: (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'left',
            marginBottom: 24,
          }}
        >
          <img
            src={imageUrl ? imageUrl : currentUser?.userAvatar}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
            }}
          ></img>
          <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            // action="/api/file/uploadImage"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            <button
              style={{
                width: '70px',
                height: '70px',
                border: 0,
                borderRadius: '50%',
                background: 'none',
              }}
              type="button"
            >
              {loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </div>

        <Form
          onFinish={async (values) => {
            await onFormSubmit(values as API.UserUpdateMyRequest);
          }}
          initialValues={{
            userName: currentUser?.userName,
            userAccount: currentUser?.userAccount,
          }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="userName"
                label="昵称"
                rules={[{ required: true, message: '请输入昵称!' }]}
              >
                <Input style={{ width: '200px' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button style={{ marginLeft: '20px' }} type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </>
    ),
  };

  //签到
  const signIn = async () => {
    // 模拟签到操作，实际应用中应发送请求到后端
    const res = await signUsingPost();
    fetchUserInfo();
    if (res.code === 0) {
      message.success('签到成功');
    } else if (res.code === 40403) {
      message.error('今日已签到');
    }
  };

  return (
    <div className="userCenter">
      <Card
        tabBarExtraContent={
          <img
            src={imageUrl ? imageUrl : currentUser?.userAvatar}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
            }}
          ></img>
        }
        tabList={tabListNoTitle}
        activeTabKey={activeTabKey2}
        onTabChange={onTab2Change}
        tabProps={{
          size: 'middle',
        }}
      >
        {contentListNoTitle[activeTabKey2]}
      </Card>
      <Card title={'我的特权'} style={{ marginTop: '20px' }}>
        <Row>
          <Col span={12}>
            <p>
              专属积分：{points ?? 0}
              {/*<label>{currentUser?.user_points ? currentUser?.user_points : '0'} </label>*/}
              <Button type="primary" onClick={signIn} style={{ marginLeft: '20px' }}>
                每日签到
              </Button>
            </p>
            <p>
              身份：
              {currentUser?.userRole === 'admin' ? (
                <>
                  <Tag color="blue">管理员</Tag>
                </>
              ) : currentUser?.userRole === 'vip' ? (
                <>
                  <Tag color="blue">Vip用户</Tag>
                </>
              ) : (
                <>
                  <Tag color="blue">普通用户</Tag>
                  {/*<Button type="primary" onClick={signIn} style={{ marginLeft: '20px' }}>*/}
                  {/*  获取会员*/}
                  {/*</Button>*/}
                </>
              )}
            </p>
          </Col>
          <Col span={12}></Col>
        </Row>
      </Card>
    </div>
  );
};
export default Login;
