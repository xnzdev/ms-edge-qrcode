/* eslint-disable react/react-in-jsx-scope */
import {
  Card,
  Input,
  Button,
  Form,
  Tooltip,
  message,
  Typography,
  Space,
  Row,
  Col,
  Upload,
} from 'antd';
import {
  DownloadOutlined,
  LinkOutlined,
  CopyOutlined,
  HomeOutlined,
  InboxOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import { Link, history } from 'umi';
import copy from 'copy-to-clipboard';
import { useRef, useState } from 'react';
import ExampleImage from './xnzpub_example.png';
import AutoUpload from '@/xnz_components/uploads';
import QrCode from 'qrcode-reader';

const { Paragraph, Title, Text } = Typography;
const { NODE_ENV } = process.env;
const { Dragger } = Upload;
// 创建一个右键菜单

const ThisPage = () => {

  const openChromeShortcuts = () => {
    if (NODE_ENV === 'development') {
      copy('chrome://extensions/shortcuts');
      message.success('已复制，请粘贴访问');
    } else {
      chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    }
  };

  const [qrResult, setQrResult] = useState("");
  const [qrError, setQrError] = useState(false);
  const beforeUpload = (file) => {
    // console.log(file)
    const reader = new FileReader();
    reader.addEventListener('load', function(){
        const qr = new QrCode();
        qr.callback = function(err, val){
          if(!err){
            setQrResult(val.result);
          }else{
            // console.log(err, val)
            setQrError(err);
          }
        };
        qr.decode(reader.result);
    });
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <>
      <Card style={{ width: 300, height: 396 }}>
        <Text strong={true}>解码说明</Text>
        <Paragraph>
          <ul style={{ fontSize: '12px' }}>
            <li>方式一：鼠标移到图片上方、右键菜单、选择“识别二维码信息”</li>
            <li>方式二：点击下方“选择图片”进行识别</li>
          </ul>
          <Row>
            <Col span={14}><AutoUpload listType="picture-card" beforeUpload={beforeUpload} btnText="选择图片"></AutoUpload></Col>
            <Col span={10}>
              <Text style={{display:qrError?"":"none"}} type="danger">识别错误，未能解析到正确信息</Text>
            </Col>
          </Row>

          <Text>识别结果：</Text>
          <Input.TextArea value={qrResult} style={{ resize: 'none' }} placeholder="此处为识别的二维码信息" />
        </Paragraph>

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
            <Space style={{ float: 'right' }}></Space>
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default ThisPage;
