/* eslint-disable react/react-in-jsx-scope */
import { Card, Input, Button, Form, Tooltip, message, Typography, Space } from 'antd';
import QRCode from 'qrcode.react';
import { DownloadOutlined, LinkOutlined, CopyOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'umi';
const { Paragraph } = Typography;
const ThisPage = () => {
  return (
    <>
      <div style={{ width: '300px' }}>
        <Card>
          <Space direction={'vertical'}>
            <QRCode value="http://facebook.github.io/react/" size={128} includeMargin={false} />

            <Input.TextArea />
            <Button>
              <DownloadOutlined />
            </Button>
            <Paragraph copyable={{ text: 'http://xnz.pub' }}>
              在线短链
              <LinkOutlined /> http://xnz.pub
            </Paragraph>

            <Link to="/settings" component={Typography.Link}>
              <SettingOutlined />
            </Link>
          </Space>
        </Card>
      </div>
    </>
  );
};
export default ThisPage;
