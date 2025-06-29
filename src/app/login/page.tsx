'use client';

import { useAuthStore } from '@/stores/auth-store';
import { LoginRequest } from '@/types/auth';
import {
  App,
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Space,
  Typography,
} from 'antd';
import {
  Eye,
  EyeOff,
  Github,
  Lock,
  Mail,
  MessageSquare,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const { Title, Text, Link } = Typography;


// 卡片内装饰气泡 - 只保留这一个
const CardDecorativeBubble = () => {
  return (
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full -mr-16 -mt-16" />
  );
};

export default function LoginPage() {
  const {message} = App.useApp()
  const router = useRouter();
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, [])

  const { login, loading } = useAuthStore();

  const [form] = Form.useForm();

  // 验证用户名格式
  const validateUsername = (username: string) => {
    const basicRegex = /^.{5,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^1[3-9]\d{9}$/;
    return basicRegex.test(username) || emailRegex.test(username) || phoneRegex.test(username);
  };

  const onFinish = async (values: LoginRequest) => {

    try {
      login(values)
      message.success('登录成功！');
      router.push('/');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    } 
  };

  const handleThirdPartyLogin = (provider: string) => {
    message.info(`正在跳转到${provider}登录...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="">
          <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/95 bg-black relative">
            {/* 卡片内装饰气泡 - 只保留这一个 */}
            <CardDecorativeBubble />

            {/* 品牌Logo和标题 */}
            <div className="text-center mb-8">
              <Title
                level={2}
                className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                欢迎回来
              </Title>
              <Text type="secondary">请登录您的账户继续使用</Text>
            </div>

            {/* 登录表单 */}
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
              className="space-y-4"
            >
              <div>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        if (validateUsername(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('请输入有效的邮箱地址或手机号'),
                        );
                      },
                    },
                  ]}
                >
                  <div>
                    <Input
                      prefix={<User className="text-gray-400" size={18} />}
                      placeholder="邮箱地址或手机号"
                      className="rounded-lg h-12"
                    />
                  </div>
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6位字符' },
                  ]}
                >
                  <div>
                    <Input.Password
                      prefix={<Lock className="text-gray-400" size={18} />}
                      placeholder="密码"
                      className="rounded-lg h-12"
                      iconRender={(visible) =>
                        visible ? <Eye size={18} /> : <EyeOff size={18} />
                      }
                    />
                  </div>
                </Form.Item>
              </div>

              {/* 记住我和忘记密码 */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    className="mb-0"
                  >
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  <Link
                    href="/forgot-password"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    忘记密码？
                  </Link>
                </div>
              </div>

              {/* 登录按钮 */}
              <div>
                <Form.Item>
                  <div>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                      size="large"
                    >
                      {loading ? '登录中...' : '登录'}
                    </Button>
                  </div>
                </Form.Item>
              </div>
            </Form>

            {/* 第三方登录 */}
            <div>
              <Divider className="my-6">
                <Text type="secondary" className="text-sm">
                  或使用以下方式登录
                </Text>
              </Divider>

              <Space className="w-full justify-center" size="large">
                <div>
                  <Button
                    icon={<Github size={18} />}
                    shape="circle"
                    size="large"
                    className="w-12 h-12 border-gray-800 text-gray-800 hover:bg-gray-50 hover:border-gray-900"
                    onClick={() => handleThirdPartyLogin('GitHub')}
                  />
                </div>
                <div>
                  <Button
                    icon={<MessageSquare size={18} />}
                    shape="circle"
                    size="large"
                    className="w-12 h-12 border-gray-800 text-gray-800 hover:bg-gray-50 hover:border-gray-900"
                    onClick={() => handleThirdPartyLogin('微信')}
                  />
                </div>
                <div>
                  <Button
                    icon={<Mail size={18} />}
                    shape="circle"
                    size="large"
                    className="w-12 h-12 border-gray-800 text-gray-800 hover:bg-gray-50 hover:border-gray-900"
                    onClick={() => handleThirdPartyLogin('Google')}
                  />
                </div>
              </Space>
            </div>

            {/* 注册链接 */}
            <div>
              <div className="text-center mt-8">
                <Text type="secondary">
                  新用户？
                  <Link
                    href="/register"
                    className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    立即注册
                  </Link>
                </Text>
              </div>
            </div>
          </Card>
        </div>

        {/* 隐私声明 */}
        <div className="text-center mt-6">
          <Text type="secondary" className="text-xs">
            登录即表示您同意我们的
            <Link href="/terms" className="mx-1">
              服务条款
            </Link>
            和
            <Link href="/privacy" className="ml-1">
              隐私政策
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
}