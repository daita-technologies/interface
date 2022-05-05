export const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
  outline: "none",
  borderRadius: 2,
};

export const modalCloseStyle = {
  padding: 0,
  position: "absolute" as "absolute",
  width: 40,
  height: 40,
  right: -20,
  top: -20,
  color: "text.primary",
};

export const limitTwoLineStyle = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  maxWidth: 240,
  lineHeight: 1.3,
};

const generalStyle = { modalStyle };

export default generalStyle;
