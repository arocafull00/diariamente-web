import { play } from "cuelume";

export function playCompletionSound() {
  play("success", { theme: "press", emphasis: "strong" });
}
