/* eslint-disable react/react-in-jsx-scope */
import { Card, Input, Button, Tooltip, Typography, Space, Row, Col, message } from 'antd';
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
import styles from "./styles.less";
import { useRef } from 'react';

const { Paragraph } = Typography;
const { NODE_ENV } = process.env;

const ThisPage = () => {
  const [curLink, setCurLink] = useState('http://xnz.pub'); // 当前长连接
  const [curDwz, setCurDwz] = useState(''); // 当前短网址
  const [btnIcon, setBtnIcon] = useState(<CopyOutlined />);
  const [copyTip, setCopyTip] = useState('复制链接'); 
  const curTextArea = useRef();

  const copyBtnHandle = (event) => {
    copy(curTextArea.current.state.value);
    setBtnIcon(<CheckOutlined style={{ color: '#52c41a' }} />);
    setCopyTip('复制成功');
    setTimeout(function () {
      setBtnIcon(<CopyOutlined />);
      setCopyTip('复制链接');
    }, 600);
  };

  const onTextAreaChange = ({ target: { value } }) => {
    if(!curDwz){
      setCurLink(value);
    }
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

  /**
   * 下载当前二维码图片
   * @param {clickEvent} event 
   */
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



  const toDwz = ()=>{
    if(curDwz){
      setCurDwz("");
      return;
    }
    var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(data) {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              if(xhr.responseText){
                var json = JSON.parse(xhr.responseText);
                if(json.code == 200){
                  let h2 = json.result.url.substr(0, 5) == 'https'?"https://":"http://";
                  setCurDwz(h2 + json.result.dwz);
                }
              }
            } else {
              //callback(null);
            }
          }
        }
	var url = "http://xnz.pub/apis.php?url="+encodeURIComponent(curLink);
	xhr.open('GET', url, true);
    xhr.send();	
  };


  return (
    <>
      <Card style={{ width: 300, height:396 }}>
        <Space direction={'vertical'}>
          <div className={styles.QrcodeContainer}>
            <QRCode id="BEST_QRCODE" value={curDwz?curDwz:curLink} size={252} />
            {/* <div className={styles.masker}>a</div> */}
          </div>
          <Input.TextArea ref={curTextArea} value={curDwz?curDwz:curLink} onChange={onTextAreaChange} style={{ resize: 'none' }} />
          <Row justify="space-between">
            <Col span={16}>
              <Space size="large">
                <Tooltip title={copyTip}>
                  <Button size="small" icon={btnIcon} onClick={copyBtnHandle} />
                </Tooltip>

                <Tooltip title="保存二维码">
                  <Button size="small" icon={<DownloadOutlined />} onClick={downLoadQrcode} />
                </Tooltip>

                <Tooltip title={curDwz?"返回长链接":"转成短链接"}>
                  <Button size="small" onClick={toDwz} 
                    style={curDwz?{
                      color:"red",
                      borderColor: "red"
                    }:{}}>{curDwz?"长":"短"}</Button>
                </Tooltip>

                <Tooltip title="解读二维码信息">
                  <Button size="small" onClick={() => history.push('/qrdecode')}>解</Button>
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
