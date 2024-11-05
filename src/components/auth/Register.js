// src/components/auth/Register.js
import React, { useState, useContext } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const Register = () => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/register', values);
      message.success('Registration successful!');
      login(data.token);
    } catch (error) {
      message.error('Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Register" style={{ width: 400, margin: '0 auto', marginTop: '10%' }}>
      <Form name="register" onFinish={onFinish}>
        <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Register;
