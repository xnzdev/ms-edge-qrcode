/* eslint-disable react/react-in-jsx-scope */
import { Card, Input, Button, Form, Tooltip, message, Typography, Space, Row, Col } from 'antd';
import { DownloadOutlined, LinkOutlined, CopyOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import copy from 'copy-to-clipboard';
import { useRef } from 'react';
import ExampleImage from './xnzpub_example.png';

const { Paragraph, Title, Text } = Typography;
const { NODE_ENV } = process.env;

const ThisPage = () => {
  const textAreaRef = useRef();

  const openChromeShortcuts = () => {
    if (NODE_ENV === 'development') {
      copy('chrome://extensions/shortcuts');
      message.success('已复制，请粘贴访问');
    } else {
      chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    }
  };

  
  return (
    <>
      <Card style={{ width: 300, height: 396 }}>
        <Text strong={true}>解码说明</Text>
        <Paragraph>
          <ul style={{ fontSize: '12px' }}>
            <li>
                方式一：
              <span style={{ color: '#008dff', cursor: 'pointer' }} onClick={openChromeShortcuts}>
                设置
              </span>
              <code>⌘+D或Ctrl+D</code>快捷键读取，并提示
            </li>
            <li>
              方式二：提交图片，单击“解析信息”按钮
            </li>
          </ul>
          <img src={ExampleImage} />
        </Paragraph>
        

        <div style={{height:80}}></div>
        
        <Row justify="space-between">
          <Col span={12}>
            <Tooltip title="返回主页">
              <Button
                size="small"
                icon={<HomeOutlined />}
                onClick={() => history.push('/index.html')}
              ></Button>
            </Tooltip>
          </Col>
          <Col span={12}>
            <Space style={{ float: 'right' }}>
              
            </Space>
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default ThisPage;
