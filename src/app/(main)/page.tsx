'use client';

import {
  BellOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  LineChartOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, List, message, Statistic } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation('common');

  const showToast = () => {
    message.success('操作成功');
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
            icon={<LineChartOutlined />}
          />
          <StatisticCard
            title="活跃度"
            value={93.2}
            suffix="%"
            icon={<ThunderboltOutlined />}
          />
          <StatisticCard title="警报数" value={23} icon={<BellOutlined />} />
          <StatisticCard
            title="完成任务"
            value={76}
            icon={<CheckCircleOutlined />}
          />
        </div>
      </Card>

      {/* 快捷操作 */}
      <Card title="⚡ 快捷操作" className="shadow rounded-2xl">
        <div className="flex flex-wrap gap-3">
          <Button type="primary" icon={<PlusOutlined />} onClick={showToast}>
            创建项目
          </Button>
          <Button icon={<UploadOutlined />}>导入数据</Button>
          <Button danger icon={<DeleteOutlined />}>
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
            dataSource={[
              '用户A 上传了一个新文件',
              '系统完成了每日备份',
              '管理员更新了权限设置',
            ]}
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
