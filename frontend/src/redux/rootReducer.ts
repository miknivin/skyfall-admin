import { combineReducers } from "redux";

import { userApi } from "./api/userApi";
import { authApi } from "./api/authApi";
import { userSlice } from "./features/authSlice";
import { propertiesApi } from "./api/propertiesApi";

const rootReducer = combineReducers({
  user: userSlice.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [propertiesApi.reducerPath]: propertiesApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
