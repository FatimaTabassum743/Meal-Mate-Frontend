// src/components/auth/Login.js
import React, { useState, useContext } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', values);
      message.success('Login successful!');
      // Store the access token and refresh token
      localStorage.setItem('token', data.token); // Store access token
      // Assuming your backend sends refresh token
      localStorage.setItem('refreshToken', data.refreshToken);
       // Store refresh token if you have it
      login(data.token); // Call the login method to update context state
    } catch (error) {
      message.error('Login failed! Please check your credentials.');
      console.error(error); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Login" style={{ width: 400, margin: '0 auto', marginTop: '10%' }}>
      <Form name="login" onFinish={onFinish}>
        <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;
