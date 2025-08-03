'use client';
import { codeModify, getTableDetail } from '@/service/code-gen';
import { GenField, GenTable } from '@/types/code-gen';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Tabs,
  TabsProps,
  message,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
// import { useAppSelector } from '@/stores';
const { Option } = Select;

interface CodeEditProps {
  open: boolean;
  onClose: () => void;
  tableId: string;
}

const CodeModify: React.FC<CodeEditProps> = ({ open, onClose, tableId }) => {
  const [isCodeModifyLoading, setIsCodeModifyLoading] = useState(false);
  const [tableInfo, setTableInfo] = useState<GenTable>(); // 基本信息
  const [fieldInfo, setFieldInfo] = useState<GenField[]>([]); // 表格数据
  const [tableForm] = Form.useForm();
  // const { dictData } = useAppSelector((state) => state.dict);
  const dictData = {};

  useEffect(() => {
    tableForm.setFieldsValue(tableInfo);
  }, [tableForm, tableInfo]);

  useEffect(() => {
    const fetchTableDetail = async () => {
      const res = await getTableDetail(tableId);
      const { table, fields } = res;
      setTableInfo(table);
      setFieldInfo(fields);
    };

    if (open && tableId) {
      fetchTableDetail();
    }
  }, [open, tableId]);

  const [changedFields, setChangedFields] = useState<Record<string, any>>({});

  const handleFieldChange = useCallback(
    (key: number, dataIndex: string, value: any) => {
      setChangedFields((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          [dataIndex]: value,
        },
      }));
    },
    [],
  );
  const fieldColumns = [
    {
      title: '主键',
      dataIndex: 'id',
      key: 'id',
      hidden: true,
    },
    {
      title: '序号',
      dataIndex: 'No',
      key: 'No',
      render: (_: number, _record: GenField, rowIndex: number) => rowIndex + 1,
      width: '4%',
    },
    {
      title: '字段名称',
      dataIndex: 'field_name',
      key: 'field_name',
    },
    {
      title: '字段类型',
      dataIndex: 'field_type',
      key: 'field_type',
    },
    {
      title: '字段描述',
      dataIndex: 'comment',
      key: 'comment',
      width: '8%',
      render: (value: string, record: GenField) => (
        <Input
          value={changedFields[record.id]?.comment ?? value}
          onChange={(e) =>
            handleFieldChange(record.id, 'comment', e.target.value)
          }
        />
      ),
    },
    {
      title: 'JS类型',
      dataIndex: 'js_type',
      key: 'js_type',
      render: (value: string, record: GenField) => (
        <Select
          value={changedFields[record.id]?.js_type ?? value}
          style={{ width: '100%' }}
          onChange={(newValue) =>
            handleFieldChange(record.id, 'js_type', newValue)
          }
        >
          <Option value="String">String</Option>
          <Option value="Number">Number</Option>
          <Option value="Boolean">Boolean</Option>
          <Option value="Date">Date</Option>
          <Option value="Array">Array</Option>
          <Option value="Object">Object</Option>
        </Select>
      ),
    },
    {
      title: '主键',
      dataIndex: 'primary_key',
      key: 'primary_key',
      render: (value: number) => (value === 1 ? '是' : '否'),
    },
    {
      title: '创建',
      dataIndex: 'creatable',
      key: 'creatable',
      render: (value: number, record: GenField) => (
        <Checkbox
          checked={changedFields[record.id]?.creatable ?? value === 1}
          onChange={(e) =>
            handleFieldChange(record.id, 'creatable', e.target.checked ? 1 : 0)
          }
        />
      ),
    },
    {
      title: '修改',
      dataIndex: 'updatable',
      key: 'updatable',
      render: (value: number, record: GenField) => (
        <Checkbox
          checked={changedFields[record.id]?.updatable ?? value === 1}
          onChange={(e) =>
            handleFieldChange(record.id, 'updatable', e.target.checked ? 1 : 0)
          }
        />
      ),
    },
    {
      title: '查询',
      dataIndex: 'queryable',
      key: 'queryable',
      render: (value: number, record: GenField) => (
        <Checkbox
          checked={changedFields[record.id]?.queryable ?? value === 1}
          onChange={(e) =>
            handleFieldChange(record.id, 'queryable', e.target.checked ? 1 : 0)
          }
        />
      ),
    },
    {
      title: '列表',
      dataIndex: 'pageable',
      key: 'pageable',
      render: (value: number, record: GenField) => (
        <Checkbox
          checked={changedFields[record.id]?.pageable ?? value === 1}
          onChange={(e) =>
            handleFieldChange(record.id, 'pageable', e.target.checked ? 1 : 0)
          }
        />
      ),
    },
    {
      title: '详情',
      dataIndex: 'detailable',
      key: 'detailable',
      render: (value: number, record: GenField) => (
        <Checkbox
          checked={changedFields[record.id]?.detailable ?? value === 1}
          onChange={(e) =>
            handleFieldChange(record.id, 'detailable', e.target.checked ? 1 : 0)
          }
        />
      ),
    },
    {
      title: '批量修改',
      dataIndex: 'batch_updatable',
      key: 'batch_updatable',
      render: (value: number, record: GenField) => (
        <Checkbox
          checked={changedFields[record.id]?.batch_updatable ?? value === 1}
          onChange={(e) =>
            handleFieldChange(
              record.id,
              'batch_updatable',
              e.target.checked ? 1 : 0,
            )
          }
        />
      ),
    },
    {
      title: '查询方式',
      dataIndex: 'query_type',
      key: 'query_type',
      render: (value: string, record: GenField) => (
        <Select
          value={changedFields[record.id]?.query_type ?? value}
          style={{ width: '100%' }}
          onChange={(newValue) =>
            handleFieldChange(record.id, 'query_type', newValue)
          }
        >
          <Option value="EQ">=</Option>
          <Option value="NE">!=</Option>
          <Option value="GT">&gt;</Option>
          <Option value="GTE">&gt;=</Option>
          <Option value="LT">&lt;</Option>
          <Option value="LTE">&lt;=</Option>
          <Option value="LIKE">LIKE</Option>
          <Option value="BETWEEN">BETWEEN</Option>
        </Select>
      ),
    },
    {
      title: '显示类型',
      dataIndex: 'html_type',
      key: 'html_type',
      render: (value: string, record: GenField) => (
        <Select
          value={changedFields[record.id]?.html_type ?? value}
          style={{ width: '100%' }}
          onChange={(newValue) =>
            handleFieldChange(record.id, 'html_type', newValue)
          }
        >
          <Option value="input">文本框</Option>
          {/*<Option value="textarea">文本域</Option>*/}
          <Option value="select">下拉框</Option>
          <Option value="radio">单选框</Option>
          <Option value="checkbox">复选框</Option>
          <Option value="datepicker">日期控件</Option>
          {/*<Option value="fileUpload">文件上传</Option>*/}
          {/*<Option value="editor">富文本控件</Option>*/}
        </Select>
      ),
    },
    {
      title: '字典类型',
      dataIndex: 'dict_type',
      key: 'dict_type',
      width: '8%',
      render: (value: string, record: GenField) => {
        const options = [];
        for (const key in dictData) {
          const items = dictData[key];
          const labels = items.map((item: { label: string }) => item.label);
          const displayLabel = labels.join(',');
          // 构建正确的 option 对象
          const option = {
            value: key,
            label: displayLabel,
          };
          // 正确更新 options 数组
          options.push(option);
        }
        return (
          <Select
            value={changedFields[record.id]?.dict_type ?? value}
            onChange={(newValue) =>
              handleFieldChange(record.id, 'dict_type', newValue)
            }
            style={{ width: '100%' }}
          >
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
                <span>{option.value}</span>
                <span> </span>
                <span className="text-gray-400 text-ellipsis">
                  {option.label}
                </span>
              </Option>
            ))}
          </Select>
        );
      },
    },
  ];

  const handleCodeModifyFinish = async () => {
    const updatedFieldInfo = fieldInfo.map((field) => {
      if (changedFields[field.id]) {
        return { ...field, ...changedFields[field.id] };
      }
      return field;
    });
    const gen_table = { ...tableForm.getFieldsValue() };
    const genTableDetail = {
      table: gen_table,
      fields: updatedFieldInfo,
    };
    setIsCodeModifyLoading(true);
    try {
      await codeModify(genTableDetail);
      message.success('更新成功');
    } finally {
      setIsCodeModifyLoading(false);
    }
    onClose();
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '表信息',
      children: (
        <Form
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          form={tableForm}
        >
          <div className="grid grid-cols-2 gap-2">
            <Form.Item
              label="编号"
              name="id"
              required={true}
              className={'hidden'}
            >
              <Input value={tableInfo?.id} />
            </Form.Item>
            <Form.Item label="表名称" name="table_name" required={true}>
              <Input value={tableInfo?.table_name} />
            </Form.Item>
            <Form.Item label="表描述" name="comment">
              <Input value={tableInfo?.comment} />
            </Form.Item>
            <Form.Item label="实体类名称" name="class_name">
              <Input value={tableInfo?.class_name} />
            </Form.Item>
            <Form.Item label="作者" name="function_author">
              <Input value={tableInfo?.function_author} />
            </Form.Item>
          </div>
          <div className={'border-b border-gray-200 mb-4'} />
          <div className={'grid grid-cols-2 gap-4'}>
            <Form.Item label="生成模板" name="tpl_category">
              <Select value={tableInfo?.tpl_category}>
                <Option value="crud">单表（增删改查）</Option>
                <Option value="tree">树表（增删改查）</Option>
              </Select>
            </Form.Item>
            <Form.Item label="模块名" name="module_name">
              <Input value={tableInfo?.module_name} />
            </Form.Item>
            <Form.Item label="业务名" name="business_name">
              <Input value={tableInfo?.business_name} />
            </Form.Item>
            <Form.Item label="功能名" name="function_name">
              <Input value={tableInfo?.function_name} />
            </Form.Item>
            <Form.Item label="生成包路径" name="package_name">
              <Input value={tableInfo?.package_name} />
            </Form.Item>
            <Form.Item label="生成路径" name="gen_path">
              <Input value={tableInfo?.gen_path} />
            </Form.Item>
          </div>
        </Form>
      ),
    },
    {
      key: '2',
      label: '字段信息',
      children: (
        <Table
          columns={fieldColumns}
          dataSource={fieldInfo}
          pagination={false}
          scroll={{ x: 1500 }}
          size="small"
        />
      ),
    },
  ];

  const footerButtons = () => [
    <div className="flex items-center justify-center gap-2" key="footer">
      <Button key="back" onClick={onClose}>
        取消
      </Button>
      <Button
        key="submit"
        type="primary"
        loading={isCodeModifyLoading}
        onClick={handleCodeModifyFinish}
      >
        确定
      </Button>
    </div>,
  ];

  return (
    <Modal
      title="编辑表"
      open={open}
      onCancel={onClose}
      footer={footerButtons}
      width={1200}
      style={{ top: 20 }}
    >
      <div style={{ padding: '12px 0' }}>
        <Tabs defaultActiveKey="2" items={items} />
      </div>
    </Modal>
  );
};

export default CodeModify;
