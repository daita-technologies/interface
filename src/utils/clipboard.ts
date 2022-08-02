export const copyStringToClipboard = (text: string) => {
  if (navigator.userAgent.match(/ipad|ipod|iphone|android/i)) {
    // save current contentEditable/readOnly status
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    document.body.appendChild(el);

    const editable = el.contentEditable;
    const { readOnly } = el;

    // convert to editable with readonly to stop iOS keyboard opening
    el.contentEditable = "true";
    el.readOnly = true;

    // create a selectable range
    const range = document.createRange();
    range.selectNodeContents(el);

    // select the range
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      el.setSelectionRange(0, 999999);

      // restore contentEditable/readOnly to original state
      el.contentEditable = editable;
      el.readOnly = readOnly;
      const isCopiedOnMobile = document.execCommand("copy");
      document.body.removeChild(el);

      return isCopiedOnMobile;
    }

    return false;
  }

  // Create new element
  const element = document.createElement("textarea");
  // Set value (text to be copied)
  element.value = text;

  // Set non-editable to avoid focus and move outside of view
  element.setAttribute("readonly", "false");
  element.setAttribute("contenteditable", "true");
  // element.style.display = 'none';
  document.body.appendChild(element);
  // Select text inside element
  element.select();
  // Copy text to clipboard
  const isCopiedOnDesktop = document.execCommand("copy");
  // Remove temporary element
  document.body.removeChild(element);

  return isCopiedOnDesktop;
};

type CopyFn = (text: string) => Promise<boolean>;

export const copy: CopyFn = async (text) => {
  if (!navigator?.clipboard) {
    return copyStringToClipboard(text);
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
};
