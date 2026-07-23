export type ActionResult = {
  status: "idle" | "success" | "error";
  message?: string;
  redirectTo?: string;
  reset?: boolean;
};

export const initialActionResult: ActionResult = { status: "idle" };

export function visibleActionResult(state: ActionResult, editedAfterSuccess: boolean): ActionResult {
  return state.status === "success" && editedAfterSuccess ? initialActionResult : state;
}

export function confirmDestructiveAction(message: string | undefined, confirm: (message: string) => boolean) {
  return !message || confirm(message);
}

export function formStatusMessage(pending: boolean, pendingMessage: string, state: ActionResult, dirty: boolean) {
  return pending ? pendingMessage : state.message || (dirty ? "Unsaved changes" : "No unsaved changes");
}

export type FileFieldState = { filename: string; error: string };
export const emptyFileFieldState: FileFieldState = { filename: "No file selected", error: "" };

export function fileFieldState(file: Pick<File, "name" | "size"> | undefined, maxBytes: number) {
  return {
    filename: file?.name || emptyFileFieldState.filename,
    error: file && file.size > maxBytes ? `File must be smaller than ${Math.round(maxBytes / 1024 / 1024)} MB.` : "",
  };
}
