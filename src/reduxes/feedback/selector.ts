import { RootState } from "reduxes";

export const selectorContentFeedback = (state: RootState) =>
  state.feedbackReducer.feedback.content;
export const selectorAttachedFilesFeedback = (state: RootState) =>
  state.feedbackReducer.feedback.attachedFiles;

export const selectorAttachedFileFeedback =
  (index: number) => (state: RootState) =>
    state.feedbackReducer.feedback.attachedFiles[index];

export const selectorFeedbackProcessingStastus = (state: RootState) =>
  state.feedbackReducer.status;
