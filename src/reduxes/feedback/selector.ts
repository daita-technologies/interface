import { RootState } from "reduxes";

export const selectorContentFeedback = (state: RootState) =>
  state.feedbackReducer.content;
