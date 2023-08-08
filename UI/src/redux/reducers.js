import { combineReducers } from '@reduxjs/toolkit';
import productSlice from './product/productRedux';
import userSlice from './user/userRedux';

const rootReducer = combineReducers({
  product: productSlice,
  user: userSlice,
});

export default rootReducer;
