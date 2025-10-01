import { configureStore } from "@reduxjs/toolkit";
import {
  isAuthLoginReducer,
  isAuthRegisterReducer,
} from "./features/auth/states/reducer";
import {
  isChangeProfilePasswordReducer,
  isChangeProfileReducer,
  isChangeProfilePhotoActionCreator,
  profileReducer,
  usersReducer,
  userReducer,
  isProfileReducer,
} from "./features/users/states/reducer";
import * as postReducer from "./features/posts/states/reducer";

const store = configureStore({
  reducer: {
    // Auth reducers
    isAuthLogin: isAuthLoginReducer,
    isAuthRegister: isAuthRegisterReducer,

    // Users reducers
    users: usersReducer,
    user: userReducer,
    profile: profileReducer,
    isProfile: isProfileReducer,
    isChangeProfile: isChangeProfileReducer,
    isChangeProfilePhoto: isChangeProfilePhotoActionCreator,
    isChangeProfilePassword: isChangeProfilePasswordReducer,

    // Posts reducers
    posts: postReducer.postsReducer,
    post: postReducer.postReducer,
    isPost: postReducer.isPostReducer,
    isPostAdd: postReducer.isPostAddReducer,
    isPostAdded: postReducer.isPostAddedReducer,
    isPostChange: postReducer.isPostChangeReducer,
    isPostChanged: postReducer.isPostChangedReducer,
    isPostChangeCover: postReducer.isPostChangeCoverReducer,
    isPostChangedCover: postReducer.isPostChangedCoverReducer,
    isPostDeleted: postReducer.isPostDeletedReducer,
  },
});

export default store;
