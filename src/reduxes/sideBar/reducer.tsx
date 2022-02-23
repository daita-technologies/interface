import { SET_SIDEBAR_IS_OPEN } from "./constants";

const inititalState = {
  isOpen: true,
};

const sideBarReducer = (state = inititalState, action: any) => {
  const { payload } = action;
  const actionType = action.type;
  switch (actionType) {
    case SET_SIDEBAR_IS_OPEN:
      return { ...state, ...payload };
    default:
      return state;
  }
};

export default sideBarReducer;
