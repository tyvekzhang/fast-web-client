'use client';
import { codePreview } from '@/service/code-gen';
import { CodePreviewResponse } from '@/types/code-gen';
import { X, Copy } from 'lucide-react';
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

const CodePreview: React.FC<CodePreviewProps> = ({
  open,
  onClose,
  tableId,
}) => {
  const [codePreviewData, setCodePreviewData] =
    useState<CodePreviewResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [copying, setCopying] = useState(false);

  // 关闭时清理数据
  useEffect(() => {
    if (!open) {
      setCodePreviewData(null);
      setActiveTab('');
    }
  }, [open]);

  const processCodeString = useCallback((code: string) => {
    if (!code) return '';
    return code.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  }, []);

  useEffect(() => {
    const fetchCodePreview = () => {
      if (!tableId) return;
      codePreview(tableId).then((resp) => {
        setCodePreviewData(resp);
        // 默认激活第一个tab
        if (resp) {
          if (resp.backend === 'python') setActiveTab('modelPy');
          else if (resp.backend === 'java') setActiveTab('controller');
        }
      });
    };
    if (open) {
      fetchCodePreview();
    }
  }, [tableId, open]);

  const buildItems = (data: CodePreviewResponse | null): TabItem[] => {
    if (!data) return [];

    const python_tabs = [
      {
        key: 'controllerPy',
        label: 'controller.py',
        children: processCodeString(data.controllerPy),
        language: 'python',
      },
      {
        key: 'servicePy',
        label: 'service.py',
        children: processCodeString(data.servicePy),
        language: 'python',
      },
      {
        key: 'serviceImplPy',
        label: 'serviceImpl.py',
        children: processCodeString(data.serviceImplPy),
        language: 'python',
      },
      {
        key: 'mapperPy',
        label: 'mapper.py',
        children: processCodeString(data.mapperPy),
        language: 'python',
      },


      {
        key: 'modelPy',
        label: 'model.py',
        children: processCodeString(data.modelPy),
        language: 'python',
      },
      {
        key: 'schemaPy',
        label: 'schema.py',
        children: processCodeString(data.schemaPy),
        language: 'python',
      },


    ];

    const java_tabs = [
      {
        key: 'controller',
        label: 'controller.java',
        children: processCodeString(data.controller),
        language: 'java',
      },
      {
        key: 'service',
        label: 'service.java',
        children: processCodeString(data.service),
        language: 'java',
      },
      {
        key: 'serviceImpl',
        label: 'serviceImpl.java',
        children: processCodeString(data.serviceImpl),
        language: 'java',
      },
      {
        key: 'mapper',
        label: 'mapper.java',
        children: processCodeString(data.mapper),
        language: 'java',
      },
      {
        key: 'model',
        label: 'model.java',
        children: processCodeString(data.model),
        language: 'java',
      },
      {
        key: 'converter',
        label: 'converter.java',
        children: processCodeString(data.converter),
        language: 'java',
      },
      {
        key: 'create',
        label: 'create.java',
        children: processCodeString(data.create),
        language: 'java',
      },
      {
        key: 'modify',
        label: 'modify.java',
        children: processCodeString(data.modify),
        language: 'java',
      },
      {
        key: 'batchModify',
        label: 'batchModify.java',
        children: processCodeString(data.batchModify),
        language: 'java',
      },
      {
        key: 'query',
        label: 'query.java',
        children: processCodeString(data.query),
        language: 'java',
      },
      {
        key: 'detail',
        label: 'detail.java',
        children: processCodeString(data.detail),
        language: 'java',
      },
      {
        key: 'page',
        label: 'page.java',
        children: processCodeString(data.page),
        language: 'java',
      },
    ];

    const react_tabs = [
      {
        key: 'page.tsx',
        label: 'page.tsx',
        children: processCodeString(data.index),
        language: 'js',
      },
      {
        key: 'query.tsx',
        label: 'query.tsx',
        children: processCodeString(data.query),
        language: 'js',
      },
      {
        key: 'create.tsx',
        label: 'create.tsx',
        children: processCodeString(data.create),
        language: 'js',
      },
      {
        key: 'detail.tsx',
        label: 'detail.tsx',
        children: processCodeString(data.detail),
        language: 'js',
      },
      {
        key: 'update.tsx',
        label: 'update.tsx',
        children: processCodeString(data.update),
        language: 'js',
      },
      {
        key: 'batchUpdate.tsx',
        label: 'batchUpdate.tsx',
        children: processCodeString(data.batchUpdate),
        language: 'js',
      },
      {
        key: 'import.tsx',
        label: 'import.tsx',
        children: processCodeString(data.import),
        language: 'js',
      },
      {
        key: 'api',
        label: 'api.ts',
        children: processCodeString(data.api),
        language: 'js',
      },
      {
        key: 'type',
        label: 'type.ts',
        children: processCodeString(data.type),
        language: 'js',
      },
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

  // 复制按钮防抖
  const copyToClipboard = async (text: string) => {
    if (copying) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(text);
      message.success('已复制');
    } catch {
      message.error('复制失败，请手动复制');
    } finally {
      setTimeout(() => setCopying(false), 800);
    }
  };

  // 代码高亮风格自动切换
  const getLanguage = (lang: string) => {
    if (lang === 'js') return 'javascript';
    if (lang === 'java') return 'java';
    if (lang === 'python') return 'python';
    return 'text';
  };

  const renderTabContent = ({
    children,
    language,
  }: {
    children: string;
    language: string;
  }) => (
    <div className="relative">
      <button
        onClick={() => copyToClipboard(children)}
        className="absolute right-2 top-2 p-2 hover:bg-gray-700 rounded"
        title="复制代码"
        aria-label="复制代码"
        disabled={copying}
      >
        <Copy className="text-gray-100 w-4 h-4" />
      </button>
      <SyntaxHighlighter
        language={getLanguage(language)}
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
      closeIcon={<X />}
      destroyOnHidden
      bodyStyle={{ minHeight: 400 }}
    >
      {!codePreviewData || items.length === 0 ? (
        <div
          style={{
            minHeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          加载中...
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items.map((item) => ({
            key: item.key,
            label: item.label,
            children: renderTabContent({
              children: item.children,
              language: item.language,
            }),
          }))}
        />
      )}
    </Modal>
  );
};

export default CodePreview;
