import { Modal } from 'antd';
import React from 'react';

const EasyModal = (props) => {
  const { visible, onOk: handleOk, onCancel, DomContents, title } = props;
  const okHandle = async () => {
    if(handleOk){
      handleOk()
    }
  };

  return (
    <Modal
      className="page-modal"
      destroyOnClose
      title={title||"EasyModal"}
      visible={visible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      {DomContents}
    </Modal>
  );
};

export default EasyModal;
