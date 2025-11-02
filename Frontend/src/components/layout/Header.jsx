import { Layout, Button, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {
  CarOutlined,
  UserOutlined,
  SettingOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons';
import useAuthStore from '../../stores/authStore';
import useAuth from '../../hooks/useAuth';
import { message } from 'antd';
import { useThemeMode } from '../../contexts/ThemeContext';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();

  // Derive isAuthenticated from user state
  const isAuthenticated = !!user;

  const handleLogout = async () => {
    await logout();
    message.success('Logged out successfully');
    navigate('/login');
  };

  // Check if user is admin
  const isAdmin = user?.roles?.includes('Admin');

  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#1565c0',
        padding: '0 24px',
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo and Brand */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <CarOutlined style={{ fontSize: '24px', color: '#ffffff', marginRight: '12px' }} />
        <Text
          style={{
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '0.15rem',
            fontFamily: 'monospace',
          }}
        >
          BRAVOCARS
        </Text>
      </Link>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Navigation Items */}
      <Space size="middle">
        <Link to="/auctions">
          <Button type="link" style={{ color: '#ffffff' }}>
            Auctions
          </Button>
        </Link>

        <Button
          type="link"
          icon={mode === 'dark' ? <BulbFilled /> : <BulbOutlined />}
          onClick={toggleTheme}
          style={{ color: '#ffffff' }}
        />

        {isAuthenticated ? (
          <>
            {isAdmin && (
              <>
                <Link to="/admin">
                  <Button type="link" icon={<SettingOutlined />} style={{ color: '#ffffff' }}>
                    Dashboard
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button type="link" style={{ color: '#ffffff' }}>
                    Users
                  </Button>
                </Link>
              </>
            )}
            <Link to="/profile">
              <Button type="link" icon={<UserOutlined />} style={{ color: '#ffffff' }}>
                {user?.firstName || 'Profile'}
              </Button>
            </Link>
            <Button type="link" onClick={handleLogout} style={{ color: '#ffffff' }}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button type="link" style={{ color: '#ffffff' }}>
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button type="primary" style={{ background: '#dc004e', borderColor: '#dc004e' }}>
                Register
              </Button>
            </Link>
          </>
        )}
      </Space>
    </AntHeader>
  );
};

export default Header;
