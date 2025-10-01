import {
  showErrorDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";
import postApi from "../api/postApi";

export const ActionType = {
  SET_POSTS: "SET_POSTS",
  SET_POST: "SET_POST",
  SET_IS_POST: "SET_IS_POST",
  SET_IS_POST_ADD: "SET_IS_POST_ADD",
  SET_IS_POST_ADDED: "SET_IS_POST_ADDED",
  SET_IS_POST_CHANGE: "SET_IS_POST_CHANGE",
  SET_IS_POST_CHANGED: "SET_IS_POST_CHANGED",
  SET_IS_POST_CHANGE_COVER: "SET_IS_POST_CHANGE_COVER",
  SET_IS_POST_CHANGED_COVER: "SET_IS_POST_CHANGED_COVER",
  SET_IS_POST_DELETE: "SET_IS_POST_DELETE",
  SET_IS_POST_DELETED: "SET_IS_POST_DELETED",
};

export function setPostsActionCreator(posts) {
  return {
    type: ActionType.SET_POSTS,
    payload: posts,
  };
}

export function asyncSetPosts(is_finished = "") {
  return async (dispatch) => {
    try {
      const posts = await postApi.getPosts(is_finished);
      dispatch(setPostsActionCreator(posts));
    } catch (error) {
      dispatch(setPostsActionCreator([]));
    }
  };
}

export function setPostActionCreator(post) {
  return {
    type: ActionType.SET_POST,
    payload: post,
  };
}

export function setIsPostActionCreator(status) {
  return {
    type: ActionType.SET_IS_POST,
    payload: status,
  };
}

export function asyncSetPost(postId) {
  return async (dispatch) => {
    try {
      const post = await postApi.getPostById(postId);
      dispatch(setPostActionCreator(post));
    } catch (error) {
      dispatch(setPostActionCreator(null));
    }
    dispatch(setIsPostActionCreator(true));
  };
}

export function setIsPostAddActionCreator(isPostAdd) {
  return {
    type: ActionType.SET_IS_POST_ADD,
    payload: isPostAdd,
  };
}

export function setIsPostAddedActionCreator(isPostAdded) {
  return {
    type: ActionType.SET_IS_POST_ADDED,
    payload: isPostAdded,
  };
}

export function asyncSetIsPostAdd(title, description) {
  return async (dispatch) => {
    try {
      await postApi.postPost(title, description);
      dispatch(setIsPostAddedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsPostAddedActionCreator(false));
    }
    dispatch(setIsPostAddActionCreator(true));
  };
}

export function setIsPostChangeActionCreator(isPostChange) {
  return {
    type: ActionType.SET_IS_POST_CHANGE,
    payload: isPostChange,
  };
}

export function setIsPostChangedActionCreator(isPostChanged) {
  return {
    type: ActionType.SET_IS_POST_CHANGED,
    payload: isPostChanged,
  };
}

export function asyncSetIsPostChange(postId, title, description, is_finished) {
  return async (dispatch) => {
    try {
      const message = await postApi.putPost(
        postId,
        title,
        description,
        is_finished
      );
      showSuccessDialog(message);
      dispatch(setIsPostChangedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(setIsPostChangeActionCreator(true));
  };
}

export function setIsPostChangeCoverActionCreator(isPostChangeCover) {
  return {
    type: ActionType.SET_IS_POST_CHANGE_COVER,
    payload: isPostChangeCover,
  };
}

export function setIsPostChangedCoverActionCreator(status) {
  return {
    type: ActionType.SET_IS_POST_CHANGED_COVER,
    payload: status,
  };
}

export function asyncSetIsPostChangeCover(postId, cover) {
  return async (dispatch) => {
    try {
      const message = await postApi.postPostCover(postId, cover);
      showSuccessDialog(message);
      dispatch(setIsPostChangedCoverActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(setIsPostChangeCoverActionCreator(true));
  };
}

export function setIsPostDeleteActionCreator(isPostDelete) {
  return {
    type: ActionType.SET_IS_POST_DELETE,
    payload: isPostDelete,
  };
}

export function setIsPostDeletedActionCreator(isPostDeleted) {
  return {
    type: ActionType.SET_IS_POST_DELETED,
    payload: isPostDeleted,
  };
}

export function asyncSetIsPostDelete(postId) {
  return async (dispatch) => {
    try {
      const message = await postApi.deletePost(postId);
      showSuccessDialog(message);
      dispatch(setIsPostDeletedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(setIsPostDeleteActionCreator(true));
  };
}
