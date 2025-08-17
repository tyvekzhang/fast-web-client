'use client';
import { codePreview } from '@/service/code-gen';
import { CodePreviewResponse } from '@/types/code-gen';
import { message, Modal, Skeleton, Tabs } from 'antd';
import { Check, Copy, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePreviewProps {
  open: boolean;
  onClose: () => void;
  tableId: string;
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
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // 关闭时清理数据
  useEffect(() => {
    if (!open) {
      setCodePreviewData(null);
      setActiveTab('');
      setCopiedTab(null);
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
        key: 'schemaPy',
        label: 'schema.py',
        children: processCodeString(data.schemaPy),
        language: 'python',
      },

      {
        key: 'modelPy',
        label: 'model.py',
        children: processCodeString(data.modelPy),
        language: 'python',
      },
    ];

    const react_tabs = [
      {
        key: 'pageTs',
        label: 'page.tsx',
        children: processCodeString(data.pageTs),
        language: 'js',
      },
      {
        key: 'queryTs',
        label: 'query.tsx',
        children: processCodeString(data.queryTs),
        language: 'js',
      },
      {
        key: 'createTs',
        label: 'create.tsx',
        children: processCodeString(data.createTs),
        language: 'js',
      },
      {
        key: 'detailTs',
        label: 'detail.tsx',
        children: processCodeString(data.detailTs),
        language: 'js',
      },
      {
        key: 'updateTs',
        label: 'update.tsx',
        children: processCodeString(data.updateTs),
        language: 'js',
      },
      {
        key: 'batchUpdateTs',
        label: 'batchUpdate.tsx',
        children: processCodeString(data.batchUpdateTs),
        language: 'js',
      },
      {
        key: 'importTs',
        label: 'import.tsx',
        children: processCodeString(data.importTs),
        language: 'js',
      },
      {
        key: 'serviceTs',
        label: 'service.ts',
        children: processCodeString(data.serviceTs),
        language: 'js',
      },
      {
        key: 'typeTs',
        label: 'type.ts',
        children: processCodeString(data.typeTs),
        language: 'js',
      },
    ];

    let displayTabs: TabItem[] = [];
    if (codePreviewData?.backend === 'python') {
      displayTabs = python_tabs.concat(react_tabs);
    }
    return displayTabs;
  };

  const items = buildItems(codePreviewData);

  // 复制按钮
  const copyToClipboard = async (text: string, tabKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tabKey);
      message.success('已复制');
      setTimeout(() => setCopiedTab(null), 5000);
    } catch {
      message.error('复制失败，请手动复制');
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
    key,
  }: {
    children: string;
    language: string;
    key: string;
  }) => (
    <div className="relative">
      <button
        onClick={() => copyToClipboard(children, key)}
        className="absolute right-2 top-2 p-2 hover:bg-gray-700 rounded"
        title="复制代码"
        aria-label="复制代码"
      >
        {copiedTab === key ? (
          <Check className="text-gray-100 w-4 h-4" />
        ) : (
          <Copy className="text-gray-100 w-4 h-4" />
        )}
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
        <div style={{ minHeight: 300, padding: 16 }}>
          <Skeleton active paragraph={{ rows: 6 }} />
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
              key: item.key,
            }),
          }))}
        />
      )}
    </Modal>
  );
};

export default CodePreview;
