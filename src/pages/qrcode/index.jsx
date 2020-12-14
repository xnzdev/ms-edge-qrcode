/* eslint-disable react/react-in-jsx-scope */
import { Card, Input, Button, Tooltip, Typography, Space, Row, Col } from 'antd';
import QRCode from 'qrcode.react';
import {
  DownloadOutlined,
  CopyOutlined,
  SettingOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import copy from 'copy-to-clipboard';

const { Paragraph } = Typography;
const { NODE_ENV } = process.env;

const ThisPage = () => {
  const [curLink, setCurLink] = useState('http://xnz.pub');
  const [btnIcon, setBtnIcon] = useState(<CopyOutlined />);
  const [copyTip, setCopyTip] = useState('复制链接');

  const copyBtnHandle = (event) => {
    copy(curLink);
    setBtnIcon(<CheckOutlined style={{ color: '#52c41a' }} />);
    setCopyTip('复制成功');
    setTimeout(function () {
      setBtnIcon(<CopyOutlined />);
      setCopyTip('复制链接');
    }, 600);
  };

  const onTextAreaChange = ({ target: { value } }) => {
    setCurLink(value);
  };

  useEffect(() => {
    function onLoaded() {
      if (NODE_ENV === 'development') {
        setCurLink(window.location.href);
      } else {
        chrome.tabs.getSelected(null, function (tab) {
          setCurLink(tab.url);
        });
      }
      // console.log(window.location.href)
    }
    onLoaded();
  }, []);

  const downLoadQrcode = (event) => {
    const downLoadFileName = 'best_qrcode_' + new Date().getTime() + '.png';
    const Qr = document.getElementById('BEST_QRCODE');
    let image = new Image();
    image.src = Qr.toDataURL('image/png');

    const link = document.createElement('a');
    const evt = document.createEvent('MouseEvents');
    link.style.display = 'none';
    link.href = image.src; // window.URL.createObjectURL(resp);
    link.download = downLoadFileName;
    document.body.appendChild(link); // 此写法兼容可火狐浏览器
    evt.initEvent('click', false, false);
    link.dispatchEvent(evt);
    document.body.removeChild(link);
  };
  return (
    <>
      <Card style={{ width: 300, height:396 }}>
        <Space direction={'vertical'}>
          <QRCode id="BEST_QRCODE" value={curLink} size={252} />
          <Input.TextArea value={curLink} onChange={onTextAreaChange} style={{ resize: 'none' }} />
          <Row justify="space-between">
            <Col span={16}>
              <Space size="large">
                <Tooltip title={copyTip}>
                  <Button size="small" icon={btnIcon} onClick={copyBtnHandle} />
                </Tooltip>

                <Tooltip title="保存二维码">
                  <Button size="small" icon={<DownloadOutlined />} onClick={downLoadQrcode} />
                </Tooltip>
              </Space>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Tooltip title="官方设置">
                <Button
                  size="small"
                  icon={<SettingOutlined />}
                  onClick={() => history.push('/settings')}
                ></Button>
              </Tooltip>
            </Col>
          </Row>
          
        </Space>
        
      </Card>
    </>
  );
};
export default ThisPage;
