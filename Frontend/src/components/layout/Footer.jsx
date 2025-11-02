import { Layout, Typography, Space, Divider } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, LinkedinOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer = () => {
  return (
    <AntFooter
      style={{
        padding: '24px 16px',
        textAlign: 'center',
        width: '100%',
      }}
    >
      {/* Social Media Icons */}
      <Space size="middle" style={{ marginBottom: '16px', justifyContent: 'center' }}>
        <Link href="#" style={{ color: 'inherit', transition: 'color 0.3s' }}>
          <FacebookOutlined style={{ fontSize: '20px' }} />
        </Link>
        <Link href="#" style={{ color: 'inherit', transition: 'color 0.3s' }}>
          <TwitterOutlined style={{ fontSize: '20px' }} />
        </Link>
        <Link href="#" style={{ color: 'inherit', transition: 'color 0.3s' }}>
          <InstagramOutlined style={{ fontSize: '20px' }} />
        </Link>
        <Link href="#" style={{ color: 'inherit', transition: 'color 0.3s' }}>
          <LinkedinOutlined style={{ fontSize: '20px' }} />
        </Link>
      </Space>

      <Divider style={{ margin: '16px 0' }} />

      {/* Copyright Text */}
      <Text type="secondary" style={{ fontSize: '13px' }}>
        © <Link href="/" style={{ fontWeight: 'bold', color: 'inherit' }}>BRAVOCARS</Link>{' '}
        {new Date().getFullYear()} • Contact: info@bravocars.com
      </Text>
    </AntFooter>
  );
};

export default Footer;
