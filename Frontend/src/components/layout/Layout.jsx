import { Layout as AntLayout } from 'antd';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

const { Content } = AntLayout;

const Layout = ({ children }) => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ flex: 1 }}>
        {children}
      </Content>
      <Footer />
    </AntLayout>
  );
};

export default Layout;
