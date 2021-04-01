/**
 * 使用方式：
 * 
 <AutoUpload form={form} updateField="f_business_license" />
 *
  <FormItem label="营业执照">
    <FormItem noStyle name="f_business_license">
      <Input style={{ marginBottom: '10px' }} readOnly placeholder="文本框只读，请上传文件" />
    </FormItem>
    
    <AutoUpload action="/serverIp" form={form} updateField="f_business_license" />
  </FormItem>
 *
 * 控件会自动更新form表单的 【updateField 设置的】 字段值，上面方式只能更新一个字段，
 * 如果想更新多个可以修改本文件代码进行扩展，或采用 onResp 方式自行书写
 */

import { Upload, Button, message, Image } from 'antd';
import React, { useState, useEffect } from 'react';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

const AutoUpload = (props) => {
  /**
   * 验证文件类型和后缀
   */
  function validateExt(file) {
    // 上传前的验证，如大小，图片格式，文件格式等
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    return isJpgOrPng;
  }

  /**
   * 验证文件大小
   */
  function validateSize(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isLt2M;
  }

  /**
   * 如果文件的图片类型，可转base64格式后使用
   * @param {图片file对象} img
   * @param {*} callback
   */
  function toBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  //
  /**
   * 属性说明：
   * action     【必填】 上传请求地址，TODO后期可配置默认地址，作为选填
   * defaultUrl 【选填】 默认图片(video)展示地址
   * data       【选填】 其他参数
   * form       【选填】 上传控件所在表单
   * listType   【选填】 展示类型(同步官方参数)默认text，上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
   * updateField 【选填】 上传成功后，将结果值更新到指定字段
   * notify(respone)【选填,function】 上传响应，参数为响应对象
   * rules {
   *    size: 2*1024 kb,
   *    mimeType:[],
   *    suffix: [],
   *    message.size: '',
   *    message.mimeType: '',
   *    message.suffix: '',
   * }
   * */
  const { action, defaultUrl, data, form, listType, updateField, btnText, notify, beforeUpload } = props;

  const [uploadRuning, setUploadRuning] = useState(false); // 正在上传中控制
  const [queryUrl, setQueryUrl] = useState(''); // 文件上传的访问相对路径
  const [serverDoneData, setServerDoneData] = useState({
    id: '',
    title: '',
    alt: '',
    path: '',
    url: '',
    meta_type: '',
    suffix: '',
    thumb: '',
  });

  useEffect(() => {
    if (defaultUrl) {
      // 根据默认只设置 图片展示路径
      setImgUrl(defaultUrl);
    }
  }, []);

  /**
   * 将API响应数据转化成插件使用数据
   * 可依据服务端接口和插件的使用进行自定义配置
   * {
   *    "path": resp.path // 多媒体存储路径，绝对或相对
   *    "url" : // 多媒体文件访问路径
   * }
   * @param {object} resp
   */
  const responseDataToLocalUse = (resp) => {
    let d = { id: '', title: '', alt: '', path: '', url: '', meta_type: '', suffix: '', thumb: '' };
    d.path = resp.result.path;
    d.url = resp.result.url;
    return d;
  };

  const uploadDoneUpateForm = (doneData) => {
    if (form && updateField) {
      // 修改表单值
      let fv = {};
      fv[updateField] = doneData.path;
      form.setFieldsValue(fv);
    }
  };
  /**
   * 上传之前的操作
   * @param {*} file
   */
  function xBeforeUpload(file) {
    if(beforeUpload){
      return beforeUpload(file);
    }
    return validateExt(file) && validateSize(file);
  }

  /**
   * 当fileInput 改变时
   * @param {*} info
   */
  const handleChange = (info) => {
    toBase64(info.file, imageUrl =>
      setServerDoneData(responseDataToLocalUse({result:{path:imageUrl, url:""}}))
    );

    if (info.file.status === 'uploading') {
      setUploadRuning(true);
      return;
    }
    if (info.file.status === 'done') {
      const doneData = responseDataToLocalUse(info.file.response);
      setServerDoneData(doneData);
      setUploadRuning(false);
      uploadDoneUpateForm(doneData);
      if (notify && typeof notify == 'function') {
        notify(info.file.response, info);
      }
    }
  };

  /**
   * 图片类型时的 按钮样式
   */
  const uploadButton = (
    <div>
      {uploadRuning ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">{btnText ? btnText : 'Upload'}</div>
    </div>
  );

  /**
   * 根据属性 listType 判断展示
   *  图片方式样式，还是
   *  按钮方式样式
   */
  const buttonShowType = () => {
    if (listType === 'text' || !listType) {
      return (
        <Button>
          <UploadOutlined /> {btnText ? btnText : 'Click to Upload'}
        </Button>
      );
    } 
    if (listType === 'picture-card') {
      const imgSrc = serverDoneData.path?serverDoneData.path:(form?form.getFieldValue(updateField):'');
      return imgSrc ? <img src={imgSrc} alt="" style={{ width: '100%', height:'100%' }} /> : uploadButton;
    }
    return null;
  };

  return (
    <Upload
      name="file"
      listType={listType}
      className="xnz-upload-image-uploader"
      showUploadList={false}
      action={action} // 上传地址
      beforeUpload={xBeforeUpload}
      onChange={handleChange}
      data={data}
    >
      {buttonShowType()}
    </Upload>
  );
};

export default AutoUpload;
