"use client"
import { codePreview } from '@/service/code-gen';
import { CodePreviewResponse } from '@/types/code-gen';
import { CloseOutlined, CopyOutlined } from '@ant-design/icons';
import { Modal, Tabs, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePreviewProps {
  open: boolean;
  onClose: () => void;
  tableId: number;
}

interface TabItem {
  key: string;
  label: string;
  children: string;
  language: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ open, onClose, tableId }) => {
  const [codePreviewData, setCodePreviewData] = useState<CodePreviewResponse | null>(null);
  const processCodeString = useCallback((code: string) => {
    if (!code) return '';
    return code.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  }, []);

  useEffect(() => {
    const fetchCodePreview = () => {
      if (!tableId) return;
      codePreview(tableId).then((resp) => {
        setCodePreviewData(resp);
      });
    };
    if (open) {
      fetchCodePreview();
    }
  }, [tableId, open]);

  const buildItems = (data: CodePreviewResponse | null): TabItem[] => {
    if (!data) return [];

    const python_tabs = [
      { key: 'modelPy', label: 'model.py', children: processCodeString(data.modelPy), language: 'python' },
      { key: 'schemaPy', label: 'schema.py', children: processCodeString(data.schemaPy), language: 'python' },
      { key: 'mapperPy', label: 'mapper.py', children: processCodeString(data.mapperPy), language: 'python' },
      { key: 'servicePy', label: 'service.py', children: processCodeString(data.servicePy), language: 'python' },
      { key: 'serviceImplPy', label: 'serviceImpl.py', children: processCodeString(data.serviceImplPy), language: 'python' },
      { key: 'controllerPy', label: 'controller.py', children: processCodeString(data.controllerPy), language: 'python' },
    ];

    const java_tabs = [
      { key: 'controller', label: 'controller.java', children: processCodeString(data.controller), language: 'java' },
      { key: 'service', label: 'service.java', children: processCodeString(data.service), language: 'java' },
      {
        key: 'serviceImpl',
        label: 'serviceImpl.java',
        children: processCodeString(data.serviceImpl),
        language: 'java',
      },
      { key: 'mapper', label: 'mapper.java', children: processCodeString(data.mapper), language: 'java' },
      { key: 'model', label: 'model.java', children: processCodeString(data.model), language: 'java' },
      { key: 'converter', label: 'converter.java', children: processCodeString(data.converter), language: 'java' },
      { key: 'create', label: 'create.java', children: processCodeString(data.create), language: 'java' },
      { key: 'modify', label: 'modify.java', children: processCodeString(data.modify), language: 'java' },
      {
        key: 'batchModify',
        label: 'batchModify.java',
        children: processCodeString(data.batchModify),
        language: 'java',
      },
      { key: 'query', label: 'query.java', children: processCodeString(data.query), language: 'java' },
      { key: 'detail', label: 'detail.java', children: processCodeString(data.detail), language: 'java' },
      { key: 'page', label: 'page.java', children: processCodeString(data.page), language: 'java' },
    ];

    const react_tabs = [
      { key: 'index', label: 'index.tsx', children: processCodeString(data.index), language: 'js' },
      { key: 'router', label: 'router.tsx', children: processCodeString(data.router), language: 'js' },
      { key: 'iQuery', label: 'iQuery.tsx', children: processCodeString(data.iQuery), language: 'js' },
      { key: 'iCreate', label: 'iCreate.tsx', children: processCodeString(data.iCreate), language: 'js' },
      { key: 'iDetail', label: 'iDetail.tsx', children: processCodeString(data.iDetail), language: 'js' },
      { key: 'iModify', label: 'iModify.tsx', children: processCodeString(data.iModify), language: 'js' },
      {
        key: 'iBatchModify',
        label: 'iBatchModify.tsx',
        children: processCodeString(data.iBatchModify),
        language: 'js',
      },
      { key: 'iImport', label: 'iImport.tsx', children: processCodeString(data.iImport), language: 'js' },
      { key: 'api', label: 'api.ts', children: processCodeString(data.api), language: 'js' },
      { key: 'type', label: 'type.ts', children: processCodeString(data.type), language: 'js' },
    ];

    let displayTabs: TabItem[] = [];
    if (codePreviewData?.backend === 'python') {
      displayTabs = python_tabs.concat(react_tabs);
    } else if (codePreviewData?.backend === 'java') {
      displayTabs = java_tabs.concat(react_tabs);
    }

    return displayTabs;
  };

  const items = buildItems(codePreviewData);

  const copyToClipboard = (async (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success('已复制');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  });

  const renderTabContent = ({ children, language }: { children: string; language: string }) => (
    <div className="relative">
      <button
        onClick={() => copyToClipboard(children)}
        className="absolute right-2 top-2 p-2 hover:bg-gray-700 rounded"
        title="复制代码"
        aria-label="复制代码"
      >
        <CopyOutlined className="text-gray-400" />
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '4px',
          fontSize: '14px',
        }}
        showLineNumbers={true}
        wrapLines={true}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
  return (
    <Modal
      title="代码预览"
      open={open}
      onCancel={onClose}
      width={'79%'}
      footer={null}
      loading={!codePreviewData}
      closeIcon={<CloseOutlined />}
      destroyOnClose
    >
      <Tabs
        items={items.map((item) => ({
          key: item.key,
          label: item.label,
          children: renderTabContent({ children: item.children, language: item.language }),
        }))
      }

      />
    </Modal>
  );
};

export default CodePreview;
