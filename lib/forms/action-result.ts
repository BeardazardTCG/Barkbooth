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
