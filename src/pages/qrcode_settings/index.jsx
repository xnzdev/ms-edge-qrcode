/* eslint-disable react/react-in-jsx-scope */
import { Card, Input, Button, Form, Tooltip, message, Typography, Space, Row, Col } from 'antd';
import { DownloadOutlined, LinkOutlined, CopyOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import copy from 'copy-to-clipboard';
import { useRef } from 'react';

const { Paragraph, Title, Text } = Typography;
const { NODE_ENV } = process.env;
const fk = 'http://xlaravel.com:8020/api/required/feedback/save';
const feedbackData = {
  tip: 'qrshort',
  title: 'Qr赞',
  contents: '👍',
  notify_user: '客户',
};
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

  const handleLike = () => {
    fetch(
      fk, //跨域请求的路径
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          Accept: 'application/json,text/plain,*/*',
        },
        body: JSON.stringify(feedbackData),
      },
    )
      .then((response) => response.json())
      .then((result) => {
        // 在此处写获取数据之后的处理逻辑
        // console.log(result);
        if (result.code == 200) {
          message.success('感谢+1赞👍');
        } else {
        }
      })
      .catch(function (e) {
        // console.log('fetch fail');
      });
  };

  const handleFeedback = () => {
    let contents = '';
    if (textAreaRef.current) {
      contents = textAreaRef.current.state.value;
    }
    if (contents) {
      fetch(
        fk, //跨域请求的路径
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            Accept: 'application/json,text/plain,*/*',
          },
          body: JSON.stringify({ ...feedbackData, contents: contents }),
        },
      )
        .then((response) => response.json())
        .then((result) => {
          // 在此处写获取数据之后的处理逻辑
          // console.log(result);
          if (result.code == 200) {
            message.success('反馈成功，感谢您的反馈');
          } else {
          }
        })
        .catch(function (e) {
          // console.log('fetch fail');
        });
    } else {
      message.error('请输入您的反馈！');
    }
  };

  return (
    <>
      <div style={{ width: '300px' }}>
        <Card>
          <Title level={4}>使用说明</Title>
          <Paragraph>
            <ul style={{ fontSize: '12px' }}>
              <li>
                <span style={{ color: '#008dff', cursor: 'pointer' }} onClick={openChromeShortcuts}>
                  设置
                </span>
                <code>⌘+Q或Ctrl+Q</code>快捷键更方便
              </li>
              <li>
                按钮 <Button size="small" icon={<CopyOutlined />} /> 可以复制链接
              </li>
              <li>
                按钮 <Button size="small" icon={<DownloadOutlined />} /> 可以下载二维码图片到本地
              </li>
            </ul>
          </Paragraph>
          <Text strong={true}>下次更新</Text>
          <Paragraph>
            <ul style={{ fontSize: '12px' }}>
              <li>客户的修改意见</li>
              <li>更优秀的短网址</li>
            </ul>
          </Paragraph>
          <Input.TextArea
            ref={textAreaRef}
            style={{ marginBottom: '12px' }}
            placeholder="🙏感谢您反馈宝贵意见！"
          ></Input.TextArea>

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
                <Button size="small" onClick={handleLike}>
                  赞
                </Button>
                <Button type="primary" size="small" onClick={handleFeedback}>
                  反馈
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
};
export default ThisPage;
