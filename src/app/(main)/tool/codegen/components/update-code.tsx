'use client';
import {
  codeModify,
  getAllTables,
  getTableDetail,
  getTableFieldsById,
} from '@/service/code-gen';
import { useAllDictData } from '@/service/dict-datum';
import { Field, TableResult } from '@/types/code-gen';
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
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const { Option } = Select;

interface CodeEditProps {
  open: boolean;
  onClose: () => void;
  tableId: string;
}

const CodeModify: React.FC<CodeEditProps> = ({ open, onClose, tableId }) => {
  const [isCodeModifyLoading, setIsCodeModifyLoading] = useState(false);
  const [tableInfo, setTableInfo] = useState<TableResult>();
  const [fieldInfo, setFieldInfo] = useState<Field[]>([]);
  const [allTables, setAllTables] = useState<TableResult[]>([]);
  const [subTableFields, setSubTableFields] = useState<Record<string, Field[]>>({});

  const [tableForm] = Form.useForm();
  const { dictData } = useAllDictData();

  // 初始化表详情和所有表列表
  useEffect(() => {
    if (open && tableId) {
      (async () => {
        const res = await getTableDetail(tableId);
        const { table, fields } = res;
        setTableInfo(table);
        setFieldInfo(fields);
        tableForm.setFieldsValue(table);
      })();
      (async () => {
        const res = await getAllTables();
        setAllTables(res);
      })();
    }
  }, [open, tableId, tableForm]);

  // 监听关联表变化，加载字段
  const watchTplCategory = Form.useWatch('tpl_category', tableForm);
  const watchSubTables = Form.useWatch('relationTables', tableForm);

  useEffect(() => {
    if (watchTplCategory === '2' && Array.isArray(watchSubTables)) {
      watchSubTables.forEach(async (item, idx) => {
        debugger
        const { tableId } = item || {};
        if (tableId && !subTableFields[tableId]) {
          const res = await getTableFieldsById(tableId);
          setSubTableFields(prev => ({ ...prev, [tableId]: res }));
        }
      });
    }
  }, [watchSubTables, watchTplCategory, subTableFields]);

  // 字段变更处理
  const [changedFields, setChangedFields] = useState<Record<string, any>>({});

  const handleFieldChange = useCallback(
    (key: number, dataIndex: string, value: any) => {
      setChangedFields(prev => ({
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
    { title: '主键', dataIndex: 'id', key: 'id', hidden: true },
    { title: '序号', dataIndex: 'No', key: 'No', render: (_: any, _r: Field, i: number) => i + 1, width: 60 },
    { title: '字段名称', dataIndex: 'field_name', key: 'field_name' },
    { title: '字段类型', dataIndex: 'field_type', key: 'field_type' },
    {
      title: '字段描述',
      dataIndex: 'comment',
      key: 'comment',
      width: 150,
      render: (v: string, r: Field) => (
        <Input
          value={changedFields[r.id]?.comment ?? v}
          onChange={e => handleFieldChange(r.id, 'comment', e.target.value)}
        />
      ),
    },
    {
      title: 'JS类型',
      dataIndex: 'js_type',
      key: 'js_type',
      render: (v: string, r: Field) => (
        <Select
          value={changedFields[r.id]?.js_type ?? v}
          className="w-full"
          onChange={val => handleFieldChange(r.id, 'js_type', val)}
        >
          {['String', 'Number', 'Boolean', 'Date', 'Array', 'Object'].map(t => (
            <Option key={t} value={t}>
              {t}
            </Option>
          ))}
        </Select>
      ),
    },
    { title: '主键', dataIndex: 'primary_key', key: 'primary_key', render: (v: number) => (v === 1 ? '是' : '否') },
    ...['creatable', 'updatable', 'queryable', 'listable', 'detailable', 'batch_updatable'].map(k => ({
      title: { creatable: '创建', updatable: '修改', queryable: '查询', listable: '列表', detailable: '详情', batch_updatable: '批量修改' }[k],
      dataIndex: k,
      key: k,
      render: (v: number, r: Field) => (
        <Checkbox
          checked={changedFields[r.id]?.[k] ?? v === 1}
          onChange={e => handleFieldChange(r.id, k, e.target.checked ? 1 : 0)}
        />
      ),
    })),
    {
      title: '查询方式',
      dataIndex: 'query_type',
      key: 'query_type',
      render: (v: string, r: Field) => (
        <Select
          value={changedFields[r.id]?.query_type ?? v}
          className="w-full"
          onChange={val => handleFieldChange(r.id, 'query_type', val)}
        >
          {['EQ', '=', { value: 'NE', label: '!=' }, 'GT', 'GTE', 'LT', 'LTE', 'LIKE', 'BETWEEN'].map(o =>
            typeof o === 'string' ? (
              <Option key={o} value={o}>
                {o}
              </Option>
            ) : (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ),
          )}
        </Select>
      ),
    },
    {
      title: '显示类型',
      dataIndex: 'html_type',
      key: 'html_type',
      render: (v: string, r: Field) => (
        <Select
          value={changedFields[r.id]?.html_type ?? v}
          className="w-full"
          onChange={val => handleFieldChange(r.id, 'html_type', val)}
        >
          {[
            { v: 'input', l: '文本框' },
            { v: 'select', l: '下拉框' },
            { v: 'radio', l: '单选框' },
            { v: 'checkbox', l: '复选框' },
            { v: 'datepicker', l: '日期控件' },
          ].map(({ v, l }) => (
            <Option key={v} value={v}>
              {l}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: '字典类型',
      dataIndex: 'dict_type',
      key: 'dict_type',
      width: 200,
      render: (v: string, r: Field) => {
        const options = Object.entries(dictData).map(([k, arr]) => ({
          value: k,
          label: arr.map(i => i.label).join(','),
        }));
        return (
          <Select
            value={changedFields[r.id]?.dict_type ?? v}
            onChange={val => handleFieldChange(r.id, 'dict_type', val)}
            className="w-full"
            showSearch
            optionFilterProp="value"
          >
            {options.map(o => (
              <Option key={o.value} value={o.value}>
                <span>{o.value}</span>&nbsp;
                <span className="text-gray-400 truncate">{o.label}</span>
              </Option>
            ))}
          </Select>
        );
      },
    },
  ];

  // 保存配置
  const handleCodeModifyFinish = async () => {
    const updatedFieldInfo = fieldInfo.map(f => (changedFields[f.id] ? { ...f, ...changedFields[f.id] } : f));
    const gen_table = { ...tableForm.getFieldsValue() };

    const genTableDetail = {
      table: gen_table,
      fields: updatedFieldInfo,
    };
    setIsCodeModifyLoading(true);
    try {
      await codeModify(genTableDetail);
      message.success('更新成功');
      onClose();
    } finally {
      setIsCodeModifyLoading(false);
    }
  };

  const tableOptions = useMemo(
    () =>
      allTables.map(t => ({
        value: t.db_table_id,
        label: `${t.table_name}${t.comment ? `（${t.comment}）` : ''}`,
      })),
    [allTables],
  );

 const items: TabsProps['items'] = [
  {
    key: 'tableInfo',
    label: '表信息',
    children: (
      <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={tableForm}>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="编号" name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="表名称" name="table_name" required>
            <Input />
          </Form.Item>

          <Form.Item label="实体类名称" name="class_name">
            <Input />
          </Form.Item>
          <Form.Item label="作者" name="function_author">
            <Input />
          </Form.Item>
          <Form.Item label="表描述" name="comment">
            <Input />
          </Form.Item>
        </div>
      </Form>
    ),
  },
  {
    key: 'fieldInfo',
    label: '字段信息',
    children: (
      <Table
        columns={fieldColumns}
        dataSource={fieldInfo}
        pagination={false}
        rowKey="id"
        scroll={{ x: 1500 }}
        size="small"
      />
    ),
  },
  {
    key: 'genInfo',
    label: '生成信息',
    children: (
      <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={tableForm}>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="生成模板" name="tpl_category" initialValue="2">
            <Select>
              <Option value="1">单表操作</Option>
              <Option value="2">关联表操作</Option>
              <Option value="3">树形表操作</Option>
            </Select>
          </Form.Item>
          <Form.Item label="模块名" name="module_name">
            <Input />
          </Form.Item>
          <Form.Item label="业务名" name="business_name">
            <Input />
          </Form.Item>
          <Form.Item label="功能名" name="function_name">
            <Input />
          </Form.Item>
          <Form.Item label="生成包路径" name="package_name">
            <Input />
          </Form.Item>
        </div>

        {watchTplCategory === '2' && (
          <Form.List name="relationTables" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                <h4 className="mt-4 mb-4 font-semibold border-b border-gray-200 px-4">关联表配置</h4>
                {fields.map((field, idx) => {
                  const selectedTableName = tableForm.getFieldValue(['relationTables', field.name, 'tableId']);
                  const relationOptions = (subTableFields[selectedTableName] || []).map(f => ({
                    value: f.field_name,
                    label: `${f.field_name} (${f.comment})`,
                  }));

                  return (
                    <div key={field.key} className="flex items-center gap-4 mb-3 px-4">
                      <Form.Item
                        label="关联表名"
                        name={[field.name, 'tableId']}
                        rules={[{ required: true, message: '请选择关联表' }]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <Select
                          placeholder="请选择表"
                          options={tableOptions}
                          allowClear
                          onChange={() => {
                            tableForm.setFieldValue(['relationTables', field.name, 'relationField'], undefined);
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="关联字段"
                        name={[field.name, 'relationField']}
                        rules={[{ required: true, message: '请选择字段' }]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <Select
                          placeholder="请选择字段"
                          options={relationOptions}
                        />
                      </Form.Item>
                      <div className="flex gap-2 mt-1 min-w-24">
                        {fields.length > 1 && (
                          <Button size='small' type="link" onClick={() => remove(field.name)}>
                            删除
                          </Button>
                        )}
                        {idx === fields.length - 1 && (
                          <Button type="link" size='small' onClick={() => add()}>
                            新增
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </Form.List>
        )}

        {watchTplCategory === '3' && (
          <>
            <h4 className="mt-4 mb-4 font-semibold border-b border-gray-200 px-4">树表配置</h4>
            <Form.Item name="treeTable" initialValue={{}}>
              <div className="grid grid-cols-3 gap-2">
                <Form.Item
                  label="树字段"
                  name={['treeTable', 'tree_code']}
                  rules={[{ required: true, message: '请选择树字段' }]}
                >
                  <Select
                    options={fieldInfo.map(f => ({ value: f.field_name, label: `${f.field_name} (${f.comment})` }))}
                  />
                </Form.Item>
                <Form.Item
                  label="树父字段"
                  name={['treeTable', 'tree_parent_code']}
                  rules={[{ required: true, message: '请选择树父字段' }]}
                >
                  <Select
                    options={fieldInfo.map(f => ({ value: f.field_name, label: `${f.field_name} (${f.comment})` }))}
                  />
                </Form.Item>
                <Form.Item
                  label="显示名称"
                  name={['treeTable', 'tree_name']}
                  rules={[{ required: true, message: '请选择显示名称字段' }]}
                >
                  <Select
                    options={fieldInfo.map(f => ({ value: f.field_name, label: `${f.field_name} (${f.comment})` }))}
                  />
                </Form.Item>
              </div>
            </Form.Item>
          </>
        )}
      </Form>
    ),
  },
];

  const footerButtons = () => [
    <Button key="cancel" onClick={onClose}>
      取消
    </Button>,
    <Button key="submit" type="primary" loading={isCodeModifyLoading} onClick={handleCodeModifyFinish}>
      确定
    </Button>,
  ];

  return (
    <Modal
      title="编辑表"
      open={open}
      onCancel={onClose}
      footer={footerButtons}
      width={1000}
      style={{ top: 20 }}
      destroyOnHidden
    >
      <Tabs defaultActiveKey="fieldInfo" items={items} destroyOnHidden />
    </Modal>
  );
};

export default CodeModify;