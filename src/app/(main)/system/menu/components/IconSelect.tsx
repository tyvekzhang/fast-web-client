import React from 'react';
import { Select } from 'antd';
import * as Icons from '@ant-design/icons';

const { Option } = Select;

interface IconSelectProps {
  onChange?: (value: string) => void; // 定义 onChange 回调函数
}

const IconSelect: React.FC<IconSelectProps> = ({ onChange }) => {
  const iconList = Object.keys(Icons).filter(key => key.endsWith('Filled'));

  const handleChange = (value: string) => {
    if (onChange) {
      onChange(value); // 调用父组件传递的回调函数
    }
  };

  return (
    <Select
      showSearch
      placeholder="选择一个图标"
      optionFilterProp="children"
      onChange={handleChange} // 监听选择事件
    >
      {iconList.map(iconName => (
        <Option key={iconName} value={iconName}>
          {React.createElement(Icons[iconName])}
          <span style={{ marginLeft: 8 }}>{iconName}</span>
        </Option>
      ))}
    </Select>
  );
};

export default IconSelect;
