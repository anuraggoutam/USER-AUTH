import { publicRequest, userRequest } from '../../requestMethods';

const getProducts = async () => {
  const res = await publicRequest.get('/products');
  return res.data;
};

const deleteProduct = async (id) => {
  const res = await userRequest.delete(`/products/${id}`);
  return res.data;
};

const updateProduct = async (id, product) => {
  const res = await userRequest.update(`/products/${id}`, product);
  return res.data;
};

const addProduct = async (product) => {
  const res = await userRequest.post(`/products`, product);
  return res.data;
};

const productService = {
  getProducts,
  deleteProduct,
  updateProduct,
  addProduct,
};

export default productService;
