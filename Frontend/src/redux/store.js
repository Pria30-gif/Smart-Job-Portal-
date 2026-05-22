import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
<<<<<<< HEAD
import jobSlice from "./jobSlice";
import { companySlice } from "./companyslice";
=======
// NOTE: We only need to import the default export (the reducer) for the slices
import jobReducer from "./jobSlice"; 
import companyReducer from "./companyslice";
import applicationReducer from "./applicationSlice"; // Use default export
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
<<<<<<< HEAD
import applicationSlice from "./applicationSlice";
import notificationSlice from "./notificationSlice";
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
<<<<<<< HEAD
  job: jobSlice,
  jobs: jobSlice,
  company: companySlice.reducer,
  application: applicationSlice,
  notification: notificationSlice,
=======
  // Using 'job' as the main key for all job-related state from jobSlice
  job: jobReducer,
  // Using 'company' as the main key for all company-related state from companyslice
  company: companyReducer,
  // Using 'application' as the main key for applicant/application state
  application: applicationReducer,
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

<<<<<<< HEAD
export default store;
=======
export default store;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
