import { Modal, Form, Input } from 'antd';
import React from 'react';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const EasyFormModal = (props) => {
  const { modalVisible, onOk: handleOk, onCancel, formData, title } = props;

  const [form] = Form.useForm();

  const okHandle = async () => {
    if (handleOk) {
      const fieldsValue = await form.validateFields();
      handleOk(fieldsValue, form);
    }
  };

  const cancelHandle = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // 将控件参数标准化/初始化
  const normTool = (item) => {
    return {
      label: '',
      placeholder: '',
      name: '',
      value: '',
      hidden: false,
      node: null,
      rules: null,
      type: 'input', // input password
      ...item,
    };
  };

  // 按配置展示控件
  const formItem = (norm) => {
    if (norm.node) {
      return norm.node;
    }
    if (norm.type === 'password') {
      return <Input.Password placeholder={norm.placeholder} />;
    }
    return <Input placeholder={norm.placeholder} />;
  };

  const domFactory = (data) => {
    /**
     * {
     *      label:"",
     *      placeholder:"",
     *      name:"",
     *      value:"",
     *      hidden:false,
     *      node: ReactNode,
     *      rules:
     * }
     */
    if (data) {
      const domArray = [];
      data.forEach((item) => {
        const norm = normTool(item);
        const itemStyle = {};
        domArray.push(
          <Form.Item
            key={norm.name}
            name={norm.name}
            label={norm.label}
            rules={norm.rules}
            style={itemStyle}
            hidden={norm.hidden}
          >
            {formItem(norm)}
          </Form.Item>,
        );
      });
      return domArray;
    }
    return null;
  };

  return (
    <Modal
      className="page-modal"
      destroyOnClose
      title={title || 'EasyModal'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
    >
      <Form
        {...formLayout}
        form={form}
        // initialValues={}
      >
        {formData && formData.length > 0 ? domFactory(formData) : null}
      </Form>
    </Modal>
  );
};

export default EasyFormModal;
