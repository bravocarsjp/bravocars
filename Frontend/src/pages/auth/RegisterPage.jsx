import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, Row, Col, App } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';

const { Title, Text, Link } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isRegistering } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = async (values) => {
    setError('');

    // Send all fields including confirmPassword to backend
    const result = await register(values);

    if (result.success) {
      setSuccess(true);
      message.success('Registration successful! Please wait for admin approval.');
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ padding: '64px 20px', minHeight: 'calc(100vh - 200px)', background: '#f5f5f5' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '8px' }}>
            Create Your Account
          </Title>
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '32px', fontSize: '16px' }}>
            Join BRAVOCARS to start bidding on premium vehicles
          </Text>

          {success && (
            <Alert
              message="Registration Successful!"
              description="Your account is pending admin approval. You'll be able to login once approved."
              type="success"
              showIcon
              style={{ marginBottom: '24px' }}
            />
          )}

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
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: 'Please input your first name!' },
                    { min: 2, message: 'First name must be at least 2 characters!' }
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Enter your first name" style={{ height: '48px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: 'Please input your last name!' },
                    { min: 2, message: 'Last name must be at least 2 characters!' }
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Enter your last name" style={{ height: '48px' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="your.email@example.com" style={{ height: '48px' }} />
            </Form.Item>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 8, message: 'Password must be at least 8 characters!' },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message: 'Must include uppercase, lowercase, number and special character!'
                    }
                  ]}
                  hasFeedback
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Create a strong password" style={{ height: '48px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Re-enter your password" style={{ height: '48px' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginTop: '32px' }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isRegistering}
                disabled={success}
                style={{ height: '48px', fontSize: '16px', fontWeight: 600 }}
              >
                Create Account
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Text style={{ fontSize: '15px' }}>
                Already have an account?{' '}
                <Link href="/login" style={{ fontWeight: 600 }}>Sign In</Link>
              </Text>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
