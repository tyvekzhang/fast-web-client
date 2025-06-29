import { EditableCellProps } from '@/types/common';
import { Checkbox, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import React from 'react';

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  record,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  index,
  children,
  required,
  options,
  ...restProps
}) => {
  let inputNode;

  switch (inputType) {
    case 'number':
      inputNode = <InputNumber style={{ width: '100%' }} />;
      break;
    case 'select':
      inputNode = (
        <Select style={{ width: '100%' }}>
          {options?.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      );
      break;
    case 'checkbox':
      inputNode = <Checkbox />;
      break;
    case 'date':
      inputNode = <DatePicker style={{ width: '100%' }} />;
      break;
    default:
      inputNode = <Input />;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          valuePropName={inputType === 'checkbox' ? 'checked' : 'value'}
          rules={[
            {
              required: required,
              message: `必填项: ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
