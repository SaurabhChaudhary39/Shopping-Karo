import { useState, useEffect } from "react";
import FormContainer from '../../components/FormContainer';
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation } from "../../slices/productApislice";

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [price, setPrice] = useState(0);

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

  const [uploadImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const navigate = useNavigate();

  const updateHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      productId,
      name,
      price,
      image,
      brand,
      category,
      description,
      countInStock,
    };

    const res = await updateProduct(updatedProduct);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Product Updated");
      navigate('/admin/productlist');
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setPrice(product.price || '');
      setDescription(product.description || '');
      setBrand(product.brand || '');
      setCategory(product.category || '');
      setImage(product.image || '');
      setCountInStock(product.countInStock || '');
    }
  }, [product]);

  return (
    <>
      <Link to='/admin/productlist' className="btn-light btn my-3">
        Go Back
      </Link>
      <FormContainer>
        <h2>Edit Product</h2>

        {loadingUpdate && <Loader />}
        {loadingUpload && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={updateHandler}>
            <Form.Group controlId="name" className="my-1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
              />
            </Form.Group>

            <Form.Group controlId="price" className="my-1">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
              />
            </Form.Group>

            <Form.Group controlId="image" className="my-1">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter image URL"
              />
              <Form.Control
                type="file"
                label='Choose file'
                onChange={uploadFileHandler}
              />
            </Form.Group>

            <Form.Group controlId="brand" className="my-1">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Enter brand"
              />
            </Form.Group>

            <Form.Group controlId="category" className="my-1">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter product category"
              />
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-1">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                placeholder="Enter count in stock"
              />
            </Form.Group>

            <Form.Group controlId="description" className="my-1">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
