import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Input, message, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Meta } = Card;

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [form] = Form.useForm();

  // Fetch all recipes on initial load
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data } = await api.get('/recipes');
      setRecipes(data);
    } catch (error) {
      message.error('Failed to load recipes.');
    }
  };

  // Show modal for adding or editing a recipe
  const showModal = (recipe = null) => {
    setSelectedRecipe(recipe);
    setIsEditMode(!!recipe);
    setIsModalOpen(true);
    if (recipe) {
      // Fill form with existing recipe data when editing
      form.setFieldsValue({
        title: recipe.title,
        ingredients: recipe.ingredients.join(', '), // convert array to comma-separated string
        instructions: recipe.instructions,
        image: recipe.image,
      });
    } else {
      form.resetFields();
    }
  };

  // Handle cancel for modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Handle submit for add/update recipe
  const handleSubmit = async (values) => {
    const ingredientsArray = values.ingredients.split(',').map((ing) => ing.trim());
    const recipeData = {
      title: values.title,
      ingredients: ingredientsArray,
      instructions: values.instructions,
      image: values.image,
    };

    try {
      if (isEditMode && selectedRecipe) {
        // Update recipe
        await api.put(`/recipes/${selectedRecipe._id}`, recipeData);
        message.success('Recipe updated successfully');
      } else {
        // Add new recipe
        const { data } = await api.post('/recipes', recipeData);
        setRecipes([...recipes, data]);
        message.success('Recipe added successfully');
      }
      fetchRecipes(); // Refresh recipe list
      setIsModalOpen(false);
    } catch (error) {
      message.error(isEditMode ? 'Failed to update recipe.' : 'Failed to add recipe.');
    }
  };

  // Handle delete recipe
  const handleDelete = async (id) => {
    try {
      await api.delete(`/recipes/${id}`);
      fetchRecipes(); // Refresh recipe list after deletion
      message.success('Recipe deleted successfully');
    } catch (error) {
      message.error('Failed to delete recipe.');
    }
  };

  // Handle view details
  const handleView = async (id) => {
    try {
      const { data } = await api.get(`/recipes/${id}`);
      Modal.info({
        title: data.title,
        content: (
          <div>
            <p><strong>Ingredients:</strong> {data.ingredients.join(', ')}</p>
            <p><strong>Instructions:</strong> {data.instructions}</p>
            <img src={data.image} alt={data.title} style={{ width: '100%', marginTop: '10px' }} />
          </div>
        ),
      });
    } catch (error) {
      message.error('Failed to load recipe details.');
    }
  };

  return (
    <Card title="Recipes" style={{ margin: '20px' }}>
      <Button type="primary" onClick={() => showModal()} icon={<PlusOutlined />}>
        Add New Recipe
      </Button>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        {recipes.map((recipe) => (
          <Col key={recipe._id} xs={24} sm={16} md={12} lg={8}>
            <Card
              hoverable
              style={{ width: 240, marginBottom: '20px' }}
              cover={<img width={240} height={170} alt={recipe.title} src={recipe.image || 'https://via.placeholder.com/240'} />}
              actions={[
                <Button type="link" onClick={() => showModal(recipe)}>Edit</Button>,
                <Button type="link" onClick={() => handleView(recipe._id)}>View</Button>,
                <Button type="link" danger onClick={() => handleDelete(recipe._id)}>Delete</Button>,
              ]}
            >
              <Meta title={recipe.title} description={recipe.ingredients.join(', ')} />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={isEditMode ? 'Edit Recipe' : 'Add New Recipe'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter the recipe title' }]}
          >
            <Input placeholder="Recipe Title" />
          </Form.Item>

          <Form.Item
            label="Ingredients"
            name="ingredients"
            rules={[{ required: true, message: 'Please enter ingredients' }]}
          >
            <Input.TextArea placeholder="Enter ingredients separated by commas" />
          </Form.Item>

          <Form.Item
            label="Instructions"
            name="instructions"
            rules={[{ required: true, message: 'Please enter the instructions' }]}
          >
            <Input.TextArea placeholder="Recipe Instructions" />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ required: true, message: 'Please enter an image URL' }]}
          >
            <Input placeholder="Image URL" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditMode ? 'Update' : 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Recipes;




