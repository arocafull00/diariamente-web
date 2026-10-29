import { play } from "cuelume";

export function playCompletionSound() {
  play("success", { emphasis: "strong" });
}
