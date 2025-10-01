import { ActionType } from "./action";

export function postsReducer(states = [], action) {
  switch (action.type) {
    case ActionType.SET_POSTS:
      return action.payload;
    default:
      return states;
  }
}

export function postReducer(state = null, action) {
  switch (action.type) {
    case ActionType.SET_POST:
      return action.payload;
    default:
      return state;
  }
}

export function isPostReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_POST:
      return action.payload;
    default:
      return state;
  }
}

export function isPostAddReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_POST_ADD:
      return action.payload;
    default:
      return state;
  }
}

export function isPostAddedReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_POST_ADDED:
      return action.payload;
    default:
      return state;
  }
}

export function isPostChangeReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_POST_CHANGE:
      return action.payload;
    default:
      return state;
  }
}

export function isPostChangedReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_POST_CHANGED:
      return action.payload;
    default:
      return state;
  }
}

export function isPostChangeCoverReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_POST_CHANGE_COVER:
      return action.payload;
    default:
      return state;
  }
}

export function isPostChangedCoverReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_POST_CHANGED_COVER:
      return action.payload;
    default:
      return state;
  }
}

export function isPostDeleteReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_POST_DELETE:
      return action.payload;
    default:
      return state;
  }
}

export function isPostDeletedReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_POST_DELETED:
      return action.payload;
    default:
      return state;
  }
}
