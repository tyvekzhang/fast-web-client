'use client';

import { useGlobalToast } from '@/components/assist/global-toast';
import { Badge, Button, Card, List, Statistic } from 'antd';
import {
  Bell,
  Bot,
  CheckCircle,
  LineChart,
  Plus,
  Trash2,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { message, notification } = useGlobalToast();
  const { t } = useTranslation('common');
  const router = useRouter();

  const showToast = () => {
    message.success('缓存已清空');
  };

  const showNotifaction = () => {
    notification.error({
      message: '出错了',
      description: '网络请求失败，请重试。',
    });
  };

  const handleCodeGenClick = () => {
    router.push('/tool/codegen');
  };
  const handleBotClick = () => {
    window.open('/chat', '_blank');
  };
  useEffect(() => {
    // 初始化逻辑
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-50 overflow-auto">
      {/* 数据概览 */}
      <Card title="📊 数据概览（指标 + 图表）" className="shadow rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard
            title="用户数"
            value={112893}
            icon={<LineChart className="w-4 h-4" />}
          />
          <StatisticCard
            title="活跃度"
            value={93.2}
            suffix="%"
            icon={<Zap className="w-4 h-4" />}
          />
          <StatisticCard
            title="警报数"
            value={23}
            icon={<Bell className="w-4 h-4" />}
          />
          <StatisticCard
            title="完成任务"
            value={76}
            icon={<CheckCircle className="w-4 h-4" />}
          />
        </div>
      </Card>

      {/* 快捷操作 */}
      <Card title="⚡ 快捷操作" className="shadow rounded-2xl">
        <div className="flex flex-wrap gap-3">
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCodeGenClick}
          >
            代码生成
          </Button>
          <Button icon={<Bot className="w-4 h-4" />} onClick={handleBotClick}>
            AI助手
          </Button>
          <Button
            danger
            onClick={showToast}
            icon={<Trash2 className="w-4 h-4" />}
          >
            清空缓存
          </Button>
        </div>
      </Card>

      {/* 待办事项 / 警报 + 最新动态 并排显示 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 待办事项 */}
        <Card title="📌 待办事项 / 警报" className="shadow rounded-2xl">
          <List
            bordered
            dataSource={['审批用户注册', '处理系统告警', '更新数据模型']}
            renderItem={(item) => (
              <List.Item>
                <Badge status="processing" text={item} />
              </List.Item>
            )}
          />
        </Card>

        {/* 最新动态 */}
        <Card title="📝 最新动态" className="shadow rounded-2xl">
          <List
            size="small"
            dataSource={['系统完成了每日备份', '管理员更新了权限设置']}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Card>
      </div>
    </div>
  );
};

export default Home;

// 子组件：封装统计卡片
const StatisticCard = ({
  title,
  value,
  suffix,
  icon,
}: {
  title: string;
  value: number;
  suffix?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <Card variant="borderless" className="bg-white rounded-xl">
      <Statistic title={title} value={value} prefix={icon} suffix={suffix} />
    </Card>
  );
};
