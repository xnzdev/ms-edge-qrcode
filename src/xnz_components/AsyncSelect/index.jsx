import React from 'react';
import { Select, message } from 'antd';
import PropTypes from 'prop-types';

export default class AsyncSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: props.value || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if ('value' in nextProps && this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  componentDidMount() {
    if (!this.props.url) {
      return;
    }

    fetch(this.props.url)
      .then((response) => response.json())
      .then((json) => {
        // dataMapFunc 是做数据适配的可选参数，默认数据格式是 {code:1,text:'选项1'}
        if (json.code !== 200) {
          // console.error("AsyncSelect 响应的数据错误");
          message.error('AsyncSelect 响应的数据错误');
          return;
        }
        let data = [];
        // for(let k in json.result){
        //     data.push({code: k, text: json.result[k]});
        // }
        if (this.props.dataMapFunc) {
          // data = data.map(item => this.props.dataMapFunc(item));
          data = this.props.dataMapFunc(json);
        }else{
          data = defaultMapFunc(json);
        }
        this.setState({
          data,
        });
      });
  }

  handleChange = (value) => {
    this.setState({ value });
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const options = this.state.data.map((d) => <Select.Option key={d.code}>{d.text}</Select.Option>);

    return (
      <Select
        value={this.state.value}
        placeholder={this.props.placeholder}
        style={this.props.style}
        onChange={this.handleChange}
      >
        {options}
      </Select>
    );
  }
}

AsyncSelect.propTypes = {
  style: PropTypes.object,
  placeholder: PropTypes.string,
  value: PropTypes.string, // 默认值
  url: PropTypes.string.isRequired,
  dataMapFunc: PropTypes.func,
  onChange: PropTypes.func,
};


export const defaultMapFunc = (rjson) => {
  const data = [];
  for (let k in rjson.result) {
    data.push({ code: rjson.result[k].id, text: rjson.result[k].name });
  }
  return data;
};