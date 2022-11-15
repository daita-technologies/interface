import { useEffect } from "react";
import { Prompt } from "react-router-dom";
import { BeforeUnloadProps } from "./type";

const BeforeUnload = function ({
  message,
  isActive = false,
}: BeforeUnloadProps) {
  useEffect(() => {
    const handleBeforeUnload = () =>
      message || "Changes you made may not saved.";
    if (isActive) {
      window.onbeforeunload = handleBeforeUnload;
    } else {
      window.onbeforeunload = null;
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [isActive]);

  return (
    <Prompt
      when={isActive}
      message={message || "Changes you made may not saved."}
    />
  );
};

export default BeforeUnload;
