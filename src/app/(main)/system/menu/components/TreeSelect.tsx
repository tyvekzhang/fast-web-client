import { TreeSelect as AntTreeSelect } from 'antd';
import React from 'react';

interface TreeSelectProps {
  treeData: any[];
  placeholder: string;
}

const TreeSelect: React.FC<TreeSelectProps> = ({ treeData, placeholder }) => {
  return (
    <AntTreeSelect
      treeData={treeData}
      placeholder={placeholder}
      treeDefaultExpandAll
      showSearch
      allowClear
    />
  );
};

export default TreeSelect;
