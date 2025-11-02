import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';

const { Title, Text, Link } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn, user } = useAuth();
  const [error, setError] = useState('');
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = async (values) => {
    setError('');

    const result = await login(values);

    if (result.success) {
      message.success('Login successful!');

      // Get the user to check roles
      const userData = result.data?.data?.user;
      const isAdmin = userData?.roles?.includes('Admin');

      // Redirect admin to admin dashboard, others to auctions
      navigate(isAdmin ? '/admin' : '/auctions');
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ padding: '64px 20px', minHeight: 'calc(100vh - 200px)', background: '#f5f5f5' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '8px' }}>
            Welcome Back
          </Title>
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '32px', fontSize: '16px' }}>
            Sign in to your BRAVOCARS account
          </Text>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError('')}
              style={{ marginBottom: '24px' }}
            />
          )}

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="your.email@example.com"
                autoComplete="email"
                style={{ height: '48px' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                autoComplete="current-password"
                style={{ height: '48px' }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: '32px' }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoggingIn}
                style={{ height: '48px', fontSize: '16px', fontWeight: 600 }}
              >
                Sign In
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Text style={{ fontSize: '15px' }}>
                Don't have an account?{' '}
                <Link href="/register" style={{ fontWeight: 600 }}>Create one now</Link>
              </Text>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
