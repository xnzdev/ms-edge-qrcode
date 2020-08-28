/* eslint-disable react/react-in-jsx-scope */
import { Card, Input, Button, Form, Tooltip, message, Typography, Space } from 'antd';
import QRCode from 'qrcode.react';
import {
  DownloadOutlined,
  LinkOutlined,
  CopyOutlined,
  SettingOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { Link } from 'umi';
import { useState, useEffect } from 'react';
import copy from 'copy-to-clipboard';

const { Paragraph } = Typography;
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
      chrome.tabs.getSelected(null, function (tab) {
        setCurLink(tab.url);
      });
      // console.log(window.location.href)
      // setCurLink(window.location.href);
    }
    onLoaded();
  }, []);

  const downLoadQrcode = (event) => {
    const downLoadFileName = 'best_qrcode_' + new Date().getTime() + '.png';
    const Qr = document.getElementById("BEST_QRCODE");
    let image = new Image();
    image.src = Qr.toDataURL("image/png");
  
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
      <Card style={{ width: 300 }}>
        <Space direction={'vertical'}>
          <QRCode id="BEST_QRCODE" value={curLink} size={252} />
          <Input.TextArea value={curLink} onChange={onTextAreaChange} style={{resize:'none'}} />
          <Space size="large">
            <Tooltip title={copyTip}>
              <Button size="small" icon={btnIcon} onClick={copyBtnHandle} />
            </Tooltip>
            <Tooltip title="保存二维码">
              <Button size="small" icon={<DownloadOutlined />} onClick={downLoadQrcode} />
            </Tooltip>
          </Space>
          {/* <Paragraph copyable={{ text: 'http://xnz.pub' }}>
            在线短链
            <LinkOutlined /> http://xnz.pub
          </Paragraph> */}

          {/* <Link to="/settings">
            <SettingOutlined />官方 / 反馈
          </Link> */}
        </Space>
      </Card>
    </>
  );
};
export default ThisPage;
