import React from 'react';
import { Card, Row, Col, Statistic,Typography, Carousel, Button, List } from 'antd';
import { HeartOutlined, UserOutlined,CalendarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home = () => {
  const statistics = {
    recipes: 150,
    mealPlans: 75,
    userFeedbacks: 300,
  };
  const healthyRecipes = [
    {
      title: 'Quinoa Salad',
      image: 'https://via.placeholder.com/240',
      ingredients: ['Quinoa', 'Cherry tomatoes', 'Cucumber'],
    },
    {
      title: 'Baked Salmon with Asparagus',
      image: 'https://via.placeholder.com/240',
      ingredients: ['Salmon fillets', 'Asparagus', 'Olive oil'],
    },
    {
      title: 'Chickpea Stir-Fry',
      image: 'https://via.placeholder.com/240',
      ingredients: ['Chickpeas', 'Bell peppers', 'Soy sauce'],
    },
    {
      title: 'Sweet Potato Tacos',
      image: 'https://via.placeholder.com/240',
      ingredients: ['Sweet potatoes', 'Black beans', 'Avocado'],
    },
    {
      title: 'Greek Yogurt Parfait',
      image: 'https://via.placeholder.com/240',
      ingredients: ['Greek yogurt', 'Honey', 'Berries'],
    },
  ];

  const testimonials = [
    { user: 'Alice', feedback: 'MealMate has transformed my meal planning!' },
    { user: 'John', feedback: 'The recipes are delicious and easy to follow!' },
    { user: 'Sara', feedback: 'I love how healthy my meals have become!' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* Hero Section */}
      <div style={{ background: '#f0f2f5', padding: '50px', textAlign: 'center' }}>
        <Title level={1}>Welcome to MealMate</Title>
        <Paragraph>Discover healthy recipes and plan your meals effortlessly.</Paragraph>

      </div>
     

      {/* Healthy Recipes Section */}
      <Title level={2} style={{ marginTop: '40px' }}>Healthy Recipes</Title>
      <Row gutter={16}>
        {healthyRecipes.map((recipe, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ marginBottom: '20px' }}
              cover={<img alt={recipe.title} src={recipe.image} />}
            >
              <Card.Meta title={recipe.title} description={`Ingredients: ${recipe.ingredients.join(', ')}`} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Testimonials Section */}
      <Title level={2} style={{ marginTop: '40px' }}>What Our Users Say</Title>
      <Carousel autoplay style={{ marginBottom: '20px' }}>
        {testimonials.map((testimonial, index) => (
          <div key={index} style={{ textAlign: 'center', padding: '20px' }}>
            <UserOutlined style={{ fontSize: '50px', color: '#1890ff' }} />
            <h3>{testimonial.user}</h3>
            <p>{testimonial.feedback}</p>
          </div>
        ))}
      </Carousel>

    
    </div>
  );
};

export default Home;



