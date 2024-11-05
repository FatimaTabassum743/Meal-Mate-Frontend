// src/components/common/Navbar.js
import React, { useContext } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';

const { Header, Sider, Content } = Layout;

const Navbar = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" style={{ padding: '16px', color: '#fff', textAlign: 'center', fontSize: '1.5em' }}>
          MealMate
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Home</Link>
          </Menu.Item>
          <Menu.Item key="/recipes" icon={<UnorderedListOutlined />}>
            <Link to="/recipes">Recipes</Link>
          </Menu.Item>
          <Menu.Item key="/mealplan" icon={<CalendarOutlined />}>
            <Link to="/mealplan">Meal Planner</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
       
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Navbar;
