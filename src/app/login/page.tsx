'use client';

import { GitHubIcon, GoogleIcon, WeChatIcon } from '@/assets/icons';
import { useAuthStore } from '@/stores/auth-store';
import { OAuth2PasswordRequestForm } from '@/types/auth';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Space,
  Tabs,
  Typography,
  message,
} from 'antd';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Smartphone, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CardDecorativeBubble = () => {
  return (
    <motion.div
      animate={{ scale: 1.2 }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full -mr-16 -mt-16"
    />
  );
};

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  const { login, loading } = useAuthStore();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('password');
  const [countdown, setCountdown] = useState(0);

  const validateUsername = (username: string) => {
    const basicRegex = /^.{5,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^1[3-9]\d{9}$/;
    return (
      basicRegex.test(username) ||
      emailRegex.test(username) ||
      phoneRegex.test(username)
    );
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const onFinish = async (values: OAuth2PasswordRequestForm) => {
    try {
      await login(values);
      message.success('登录成功！');
      router.push('/');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    }
  };

  const onCodeFinish = async (values: any) => {
    try {
      // Here you would typically verify the code with your backend
      // For now, we'll just simulate a successful login
      await login({ username: values.phone, password: values.code });
      message.success('验证码登录成功！');
      router.push('/');
    } catch (error) {
      message.error('验证码登录失败，请检查验证码');
    }
  };

  const handleSendCode = () => {
    const phone = form.getFieldValue('phone');
    if (!phone || !validatePhone(phone)) {
      message.error('请输入有效的手机号码');
      return;
    }

    // Simulate sending verification code
    message.success('验证码已发送');
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleThirdPartyLogin = (provider: string) => {
    message.info(`正在跳转到${provider}登录...`);
  };

  const linkClass = 'text-sm text-blue-400 hover:text-blue-500 font-normal';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/95 bg-black relative">
          <CardDecorativeBubble />

          <div className="text-center mb-6">
            <Title level={2} className="mb-2 bg-clip-text text-secondary">
              欢迎回来
            </Title>
          </div>

          <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
            <TabPane tab="密码登录" key="password">
              <Form
                form={form}
                name="login"
                onFinish={onFinish}
                autoComplete="off"
                size="large"
                className="space-y-6"
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        if (validateUsername(value)) return Promise.resolve();
                        return Promise.reject(
                          new Error('请输入有效的邮箱地址或手机号'),
                        );
                      },
                    },
                  ]}
                >
                  <Input
                    prefix={<User className="text-gray-400" size={18} />}
                    placeholder="邮箱地址或手机号"
                    className="rounded-lg h-12"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6位字符' },
                  ]}
                >
                  <Input.Password
                    prefix={<Lock className="text-gray-400" size={18} />}
                    placeholder="密码"
                    className="rounded-lg h-12"
                    iconRender={(visible) =>
                      visible ? <Eye size={18} /> : <EyeOff size={18} />
                    }
                  />
                </Form.Item>

                <div className="flex justify-between items-center mb-6">
                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    className="mb-0"
                  >
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  <Link href="/forgot-password" className={linkClass}>
                    忘记密码？
                  </Link>
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full h-12 rounded-lg bg-primary border-0 hover:opacity-80 transition-all duration-200"
                  >
                    {loading ? '登录中...' : '登录'}
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="验证码登录" key="code">
              <Form
                form={form}
                name="codeLogin"
                onFinish={onCodeFinish}
                autoComplete="off"
                size="large"
                className="space-y-6"
              >
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        if (validatePhone(value)) return Promise.resolve();
                        return Promise.reject(new Error('请输入有效的手机号'));
                      },
                    },
                  ]}
                >
                  <Input
                    prefix={<Smartphone className="text-gray-400" size={18} />}
                    placeholder="手机号"
                    className="rounded-lg h-12"
                  />
                </Form.Item>

                <Form.Item
                  name="code"
                  rules={[
                    { required: true, message: '请输入验证码' },
                    { len: 6, message: '验证码为6位数字' },
                  ]}
                >
                  <div className="flex space-x-2">
                    <Input
                      prefix={<Mail className="text-gray-400" size={18} />}
                      placeholder="验证码"
                      className="rounded-lg h-12 flex-1"
                    />
                    <Button
                      onClick={handleSendCode}
                      disabled={countdown > 0}
                      className="h-12"
                    >
                      {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
                    </Button>
                  </div>
                </Form.Item>

                <div className="flex justify-between items-center mb-6">
                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    className="mb-0"
                  >
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full h-12 rounded-lg bg-primary border-0 hover:opacity-80 transition-all duration-200"
                  >
                    {loading ? '登录中...' : '登录'}
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>

          <Divider className="my-4">
            <Text type="secondary" className="text-sm">
              或使用以下方式登录
            </Text>
          </Divider>

          <Space className="w-full justify-center" size="large">
            <Button
              icon={<GitHubIcon />}
              shape="circle"
              size="large"
              className="w-10 h-10 border-gray-600 text-gray-600 hover:bg-gray-100 hover:border-gray-900"
              onClick={() => handleThirdPartyLogin('GitHub')}
            />
            <Button
              icon={<WeChatIcon size={24} />}
              shape="circle"
              size="large"
              className="w-10 h-10 border-gray-600 text-gray-600 hover:bg-gray-100 hover:border-gray-900"
              onClick={() => handleThirdPartyLogin('微信')}
            />
            <Button
              icon={<GoogleIcon size={24} />}
              shape="circle"
              size="large"
              className="w-10 h-10 border-gray-600 text-gray-600 hover:bg-gray-100 hover:border-gray-900"
              onClick={() => handleThirdPartyLogin('Google')}
            />
          </Space>

          <div className="text-center mt-8">
            <Text type="secondary" className="text-sm">
              新用户？
              <Link href="/register" className={`ml-1 ${linkClass}`}>
                立即注册
              </Link>
            </Text>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Text type="secondary" className="text-sm">
            登录即表示您同意我们的
            <Link href="/terms" className={`mx-1 ${linkClass}`}>
              服务条款
            </Link>
            和
            <Link href="/privacy" className={`ml-1 ${linkClass}`}>
              隐私政策
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
}
