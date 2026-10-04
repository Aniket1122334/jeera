import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import orgReducer from "../slices/orgSlice";
import tasksReducer from "../slices/taskSlice";
import teamsReducer from "../slices/teamSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    org: orgReducer,
    tasks: tasksReducer,
    teams: teamsReducer,
  },
});

export default store;
