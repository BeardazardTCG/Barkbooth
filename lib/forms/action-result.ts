export type ActionResult = {
  status: "idle" | "success" | "error";
  message?: string;
  redirectTo?: string;
  reset?: boolean;
};

export const initialActionResult: ActionResult = { status: "idle" };
