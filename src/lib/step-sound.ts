import { play } from "cuelume";

export function playStepSound(previous: number, next: number) {
  if (next === previous) {
    return;
  }

  play("select", {
    emphasis: "subtle",
    direction: next > previous ? "forward" : "back",
  });
}
