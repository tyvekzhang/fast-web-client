'use client';

import ChatMain from '@/components/chat/chat-main';
import ChatSidebar from '@/components/chat/chat-sidebar';
import { generateId } from '@/lib/utils';
import type { Conversation, Message } from '@/types/chat';
import { Layout } from 'antd';
import { useEffect, useState } from 'react';

const { Sider, Content } = Layout;

export default function HomePage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 从localStorage加载对话历史
  useEffect(() => {
    const savedConversations = localStorage.getItem('ai-conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed);
        if (parsed.length > 0) {
          setCurrentConversationId(parsed[0].id);
        }
      } catch (error) {
        console.error('Failed to parse saved conversations:', error);
        localStorage.removeItem('ai-conversations');
      }
    }
  }, []);

  // 保存对话到localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      try {
        localStorage.setItem('ai-conversations', JSON.stringify(conversations));
      } catch (error) {
        console.error('Failed to save conversations:', error);
      }
    }
  }, [conversations]);

  const createNewConversation = (): string => {
    const newConversation: Conversation = {
      id: generateId(),
      title: '新对话',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);

    // 移动端创建新对话后收起侧边栏
    if (isMobile) {
      setCollapsed(true);
    }

    return newConversation.id;
  };

  const updateConversation = (
    conversationId: string,
    updates: Partial<Conversation>,
  ) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, ...updates, updatedAt: new Date() }
          : conv,
      ),
    );
  };

  const deleteConversation = (conversationId: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((conv) => conv.id !== conversationId);

      // 如果删除的是当前对话，切换到第一个对话或创建新对话
      if (conversationId === currentConversationId) {
        if (filtered.length > 0) {
          setCurrentConversationId(filtered[0].id);
        } else {
          setCurrentConversationId(null);
        }
      }

      return filtered;
    });
  };

  const addMessage = (conversationId: string, message: Message) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const updatedMessages = [...conv.messages, message];
          // 如果是第一条用户消息，更新对话标题
          const title =
            conv.messages.length === 0 && message.role === 'user'
              ? message.content.slice(0, 30) +
                (message.content.length > 30 ? '...' : '')
              : conv.title;

          return {
            ...conv,
            messages: updatedMessages,
            title,
            updatedAt: new Date(),
          };
        }
        return conv;
      }),
    );
  };

  const updateMessage = (
    conversationId: string,
    messageId: string,
    content: string,
  ) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === messageId ? { ...msg, content } : msg,
            ),
            updatedAt: new Date(),
          };
        }
        return conv;
      }),
    );
  };

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId,
  );

  return (
    <Layout className="h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={280}
        collapsedWidth={isMobile ? 0 : 80}
        className="bg-gray-50 border-r border-gray-200"
        trigger={null}
      >
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={setCurrentConversationId}
          onCreateConversation={createNewConversation}
          onDeleteConversation={deleteConversation}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          isMobile={isMobile}
        />
      </Sider>

      <Layout className="w-full">
        <Content className="w-full">
          <ChatMain
            conversation={currentConversation}
            onAddMessage={addMessage}
            onUpdateMessage={updateMessage}
            onCreateConversation={createNewConversation}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            isMobile={isMobile}
          />
        </Content>
      </Layout>
    </Layout>
  );
}
