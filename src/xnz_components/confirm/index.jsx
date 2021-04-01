import { Modal, Input, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export const showConfirm = (icon, title, content, okCallback, cancelCallback) => {
  // let english = 'Are you sure delete this task?'
  // 'Some descriptions'
  // Yes No
  confirm({
    title: title,
    icon: icon,
    content: content,
    okText: '确定',
    okType: 'danger', // danger[红色确定按钮] primary[主题色按钮]
    cancelText: '取消',
    onOk() {
      if (typeof okCallback === 'function') okCallback();
    },
    onCancel() {
      if (typeof cancelCallback === 'function') cancelCallback();
    },
  });
};

export const showDeleteConfirm = (content, okCallback, cancelCallback) => {
  showConfirm(
    <ExclamationCircleOutlined />,
    '确定执行删除操作？',
    content,
    okCallback,
    cancelCallback,
  );
};

export const showWarningConfirm = (title, content, okCallback, cancelCallback) => {
  showConfirm(<ExclamationCircleOutlined />, title, content, okCallback, cancelCallback);
};


class CommonModal extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    loading: false,
    visible: true,
  };
  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading } = this.state;
    return (
      <>
        <Modal
          visible={visible}
          title={this.props.title?this.props.title:'no title'}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              Submit
            </Button>,
          ]}
        ></Modal>
      </>
    );
  }
}

export default { CommonModal };