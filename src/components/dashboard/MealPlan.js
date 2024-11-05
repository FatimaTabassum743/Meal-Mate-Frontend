import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Spin, Select, Row, Col, Button, message } from 'antd';
import api from '../../services/api';

const { Title, Text } = Typography;
const { Option } = Select;
const { Meta } = Card;
const MealPlan = () => {
  const [mealPlan, setMealPlan] = useState({
    meals: [], // Array to hold meal objects with type and recipe
  });
  const [recipes, setRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]); // To hold fetched meal plans
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await api.get('/recipes'); // Ensure this endpoint returns your recipes
        setRecipes(data);
      } catch (err) {
        setError('Failed to load recipes. Please try again later.');
      }
    };

    const fetchMealPlans = async () => {
      try {
        const { data } = await api.get('/mealplans'); // Fetch existing meal plans
        setMealPlans(data);
      } catch (err) {
        setError('Failed to load meal plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
    fetchMealPlans();
  }, []);

  const handleMealSelect = (mealType, recipeId) => {
    const selectedRecipe = recipes.find((recipe) => recipe._id === recipeId);
    const updatedMeals = mealPlan.meals.filter(meal => meal.type !== mealType); // Remove existing meal of the same type
    if (selectedRecipe) {
      updatedMeals.push({ type: mealType, recipe: selectedRecipe._id }); // Use only the recipe ID
    }
    setMealPlan({ meals: updatedMeals });
  };

  const confirmMeal = async () => {
    // Directly use the meals in the state for the API call
    const { meals } = mealPlan; // This is already structured with type and recipe ID

    // Validate that at least one meal is selected
    if (meals.length === 0 || !meals.some(meal => meal.recipe)) {
      return message.error('At least one meal must be selected.');
    }

    try {
      await api.post('/mealplans', { meals }); // Send the meals array to the backend
      message.success('Meal plan confirmed for today!');

      // Optionally fetch meal plans again to refresh the displayed list
      const { data } = await api.get('/mealplans'); // Refreshing meal plans
      setMealPlans(data);
      
      // Reset the mealPlan state after confirming
      setMealPlan({ meals: [] }); // Reset the meals array
    } catch (err) {
      message.error('Failed to confirm meal plan. Please try again later.');
    }
  };
  console.log(mealPlans,"meal");

  if (loading) {
    return <Spin size="large" style={{ margin: '20px' }} />;
  }

  if (error) {
    return <Text type="danger" style={{ margin: '20px' }}>{error}</Text>;
  }

  return (
    <Card title="Plan Your Meals" style={{ margin: '20px' }} bordered={false}>
      <Title level={4}>Today's Meals</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Title level={5}>Breakfast</Title>
          <Select
            placeholder="Select Breakfast"
            onChange={(recipeId) => handleMealSelect('breakfast', recipeId)}
            style={{ width: '100%' }}
            showSearch
            filterOption={(input, option) => 
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {recipes.map((recipe) => (
              <Option key={recipe?._id} value={recipe?._id}>
                {recipe?.title}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <Title level={5}>Lunch</Title>
          <Select
            placeholder="Select Lunch"
            onChange={(recipeId) => handleMealSelect('lunch', recipeId)}
            style={{ width: '100%' }}
            showSearch
            filterOption={(input, option) => 
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {recipes.map((recipe) => (
              <Option key={recipe._id} value={recipe._id}>
                {recipe.title}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <Title level={5}>Dinner</Title>
          <Select
            placeholder="Select Dinner"
            onChange={(recipeId) => handleMealSelect('dinner', recipeId)}
            style={{ width: '100%' }}
            showSearch
            filterOption={(input, option) => 
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {recipes.map((recipe) => (
              <Option key={recipe._id} value={recipe._id}>
                {recipe.title}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Card title="Selected Meals" style={{ marginTop: '20px' }}>
        {mealPlan.meals.map(meal => (
          <p key={meal.type}>
            <strong>{meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}:</strong> {meal.recipe ? recipes.find(recipe => recipe._id === meal.recipe)?.title : 'None selected'}
          </p>
        ))}
      </Card>

      <Button type="primary" onClick={confirmMeal} style={{ marginTop: '20px' }}>
        Confirm This  Meal For Today
      </Button>
      <Row gutter={24} style={{ marginTop: '20px' }}>
        <h1>Your Previous Choices</h1>
        {mealPlans.map((recipe) => (
          <Col key={recipe?.recipe?._id} xs={24} sm={16} md={12} lg={8}>
            <Card
              hoverable
              style={{ width: 240, marginBottom: '20px' }}
              cover={<img width={240} height={170} alt={recipe?.recipe?.title} src={recipe?.recipe?.image || 'https://via.placeholder.com/240'} />}
           
            >
              <Meta title={recipe?.recipe?.title} description={recipe?.recipe?.ingredients.join(', ')} />
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default MealPlan;
