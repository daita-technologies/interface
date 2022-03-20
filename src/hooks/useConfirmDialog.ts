import { ConfirmDialogContext } from "components/ConfirmDialog";
import { useContext } from "react";

const useConfirmDialog = () => useContext(ConfirmDialogContext);
export default useConfirmDialog;
