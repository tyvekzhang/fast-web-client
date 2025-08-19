'use client';

import type { Conversation } from '@/types/chat';
import { Button, Dropdown, Input, Modal, message } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  Edit,
  MessageSquare,
  MoreVertical,
  PanelRight,
  Plus,
  Sidebar,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
}

export default function ChatSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  collapsed,
  onToggleCollapse,
  isMobile,
}: ChatSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleDelete = (conversationId: string, title: string) => {
    Modal.confirm({
      title: '删除对话',
      content: `确定要删除对话"${title}"吗？此操作不可撤销。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        onDeleteConversation(conversationId);
        message.success('对话已删除');
      },
    });
  };

  const handleEdit = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editingId) {
      // 这里应该调用更新对话标题的函数
      // 暂时通过重新选择对话来触发更新
      setEditingId(null);
      setEditTitle('');
      message.success('标题已更新');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  if (collapsed && !isMobile) {
    return (
      <div className="h-full flex flex-col items-center py-4">
        <Button
          type="text"
          size="small"
          icon={
            <Sidebar
              className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            />
          }
          onClick={onToggleCollapse}
          className="mb-4"
        />
        <Button
          type="primary"
          size="small"
          icon={<Plus />}
          onClick={onCreateConversation}
          className="mb-4"
          shape="circle"
        />
        <div className="flex-1 w-full px-2 space-y-6">
          {conversations.slice(0, 10).map((conv) => (
            <Button
              key={conv.id}
              type={conv.id === currentConversationId ? 'link' : 'text'}
              icon={<MessageSquare />}
              onClick={() => onSelectConversation(conv.id)}
              className="w-full rounded-full"
              shape="circle"
            />
          ))}
        </div>
      </div>
    );
  }

  if (collapsed && isMobile) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-gray-800">AI助手</h1>
          <Button
            type="text"
            icon={
              <PanelRight
                className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
              />
            }
            onClick={onToggleCollapse}
            size="small"
          />
        </div>
        <Button
          type="primary"
          icon={<Plus />}
          onClick={onCreateConversation}
          className="w-full my-2"
          size="large"
        >
          新建对话
        </Button>
      </div>

      {/* 对话列表 */}
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>暂无对话历史</p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative rounded-lg p-3 cursor-pointer transition-all hover:bg-gray-100 ${
                  conversation.id === currentConversationId
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-white border border-transparent'
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {editingId === conversation.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onPressEnter={handleSaveEdit}
                        onBlur={handleCancelEdit}
                        className="mb-1"
                        autoFocus
                      />
                    ) : (
                      <h3 className="font-medium text-gray-900 truncate mb-1">
                        {conversation.title}
                      </h3>
                    )}
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{conversation.messages.length} 条消息</span>
                      <span className="mx-1">•</span>
                      <span>
                        {formatDistanceToNow(new Date(conversation.updatedAt), {
                          addSuffix: true,
                          locale: zhCN,
                        })}
                      </span>
                    </div>
                  </div>

                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'edit',
                          label: '重命名',
                          icon: <Edit size={14} />,
                          onClick: (e) => {
                            e.domEvent.stopPropagation();
                            handleEdit(conversation);
                          },
                        },
                        {
                          key: 'delete',
                          label: '删除',
                          icon: <Trash2 size={14} />,
                          danger: true,
                          onClick: (e) => {
                            e.domEvent.stopPropagation();
                            handleDelete(conversation.id, conversation.title);
                          },
                        },
                      ],
                    }}
                    trigger={['click']}
                    placement="bottomRight"
                  >
                    <Button
                      type="text"
                      icon={<MoreVertical />}
                      size="small"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Dropdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
