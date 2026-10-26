import type { GrammaticalGender, MoodQuadrant } from "@/db/schema";
import { getTreeEmotionQuadrant, type EmotionTreeRoot } from "@/lib/emotion-tree";
import { getEmotionLabel, type MoodTone } from "@/lib/emotions";

const BRANCH_SIZE = 150;
const CHILD_SIZE = 124;
const CLUSTER_GAP = 6;
const CHILD_GAP = 8;
const CHILD_SPREAD = (40 * Math.PI) / 180;
const RELAX_ITERATIONS = 60;

const IDLE_POSITIONS = [
  { x: -78, y: -136 },
  { x: 78, y: -136 },
  { x: 0, y: 0 },
  { x: -78, y: 136 },
  { x: 78, y: 136 },
];

export type EmotionTreeNodeKind = "branch" | "child";

export type EmotionTreeLayoutNode = {
  key: string;
  cluster: string;
  name: string;
  label: string;
  quadrant: MoodQuadrant;
  kind: EmotionTreeNodeKind;
  tone: MoodTone;
  selected: boolean;
  size: number;
  x: number;
  y: number;
  origin: { x: number; y: number };
  delay: number;
};

type Point = { x: number; y: number };

type Circle = Point & { radius: number; fixed: boolean };

export type EmotionTreePositions = Record<string, Point>;

export function getTreeNodeMotion(node: EmotionTreeLayoutNode) {
  return {
    variants: {
      hidden: { x: node.origin.x, y: node.origin.y, scale: 0.3, opacity: 0 },
      visible: {
        x: node.x,
        y: node.y,
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 170, damping: 15, delay: node.delay },
      },
      exit: (positions: EmotionTreePositions) => ({
        x: positions[node.cluster]?.x ?? node.origin.x,
        y: positions[node.cluster]?.y ?? node.origin.y,
        scale: 0,
        opacity: 0,
        transition: { duration: 0.26, ease: "easeIn" as const },
      }),
    },
    style: {
      width: node.size,
      height: node.size,
      marginLeft: -node.size / 2,
      marginTop: -node.size / 2,
    },
  } as const;
}

function getChildPositions(branch: Point, centroid: Point): Point[] {
  const dx = branch.x - centroid.x;
  const dy = branch.y - centroid.y;
  const angle = Math.hypot(dx, dy) < 1 ? Math.PI / 2 : Math.atan2(dy, dx);
  const distance = BRANCH_SIZE / 2 + CHILD_SIZE / 2 + CHILD_GAP;

  return [angle - CHILD_SPREAD, angle + CHILD_SPREAD].map((childAngle) => ({
    x: branch.x + Math.cos(childAngle) * distance,
    y: branch.y + Math.sin(childAngle) * distance,
  }));
}

function relax(circles: Circle[]) {
  for (let iteration = 0; iteration < RELAX_ITERATIONS; iteration++) {
    circles.forEach((a, i) => {
      circles.slice(i + 1).forEach((b) => {
        if (a.fixed && b.fixed) {
          return;
        }

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy) || 1;
        const overlap = a.radius + b.radius + CLUSTER_GAP - distance;

        if (overlap <= 0) {
          return;
        }

        const share = a.fixed || b.fixed ? 1 : 0.5;
        const pushX = (dx / distance) * overlap * share;
        const pushY = (dy / distance) * overlap * share;

        if (!a.fixed) {
          a.x -= pushX;
          a.y -= pushY;
        }

        if (!b.fixed) {
          b.x += pushX;
          b.y += pushY;
        }
      });
    });
  }
}

export function getEmotionTreeLayout(
  root: EmotionTreeRoot,
  openBranch: string | null,
  emotion: string | null,
  gender: GrammaticalGender,
) {
  const centroid = {
    x: IDLE_POSITIONS.reduce((sum, point) => sum + point.x, 0) / IDLE_POSITIONS.length,
    y: IDLE_POSITIONS.reduce((sum, point) => sum + point.y, 0) / IDLE_POSITIONS.length,
  };
  const openIndex = root.branches.findIndex((branch) => branch.name === openBranch);
  const open = root.branches[openIndex];
  const branchCircles: Circle[] = root.branches.map((_, index) => ({
    ...IDLE_POSITIONS[index],
    radius: BRANCH_SIZE / 2,
    fixed: index === openIndex,
  }));
  const childCircles: Circle[] = open
    ? getChildPositions(IDLE_POSITIONS[openIndex], centroid).map((point) => ({
        ...point,
        radius: CHILD_SIZE / 2,
        fixed: true,
      }))
    : [];

  relax([...branchCircles, ...childCircles]);

  function getTone(name: string, fallback: MoodTone): MoodTone {
    return emotion === name ? 3 : fallback;
  }

  const branchNodes = root.branches.map<EmotionTreeLayoutNode>((branch, index) => {
    const { x, y } = branchCircles[index];

    return {
      key: branch.name,
      cluster: branch.name,
      name: branch.name,
      label: getEmotionLabel(branch.name, gender),
      quadrant: getTreeEmotionQuadrant(branch.name, root),
      kind: "branch",
      tone: getTone(branch.name, index === openIndex ? 3 : 2),
      selected: emotion === branch.name,
      size: BRANCH_SIZE,
      x,
      y,
      origin: { x, y },
      delay: open ? 0 : index * 0.05,
    };
  });

  const childNodes = open
    ? open.children.map<EmotionTreeLayoutNode>((child, index) => ({
        key: `${open.name}/${child}`,
        cluster: open.name,
        name: child,
        label: getEmotionLabel(child, gender),
        quadrant: getTreeEmotionQuadrant(child, root),
        kind: "child",
        tone: getTone(child, 1),
        selected: emotion === child,
        size: CHILD_SIZE,
        x: childCircles[index].x,
        y: childCircles[index].y,
        origin: IDLE_POSITIONS[openIndex],
        delay: 0.04 + index * 0.07,
      }))
    : [];

  const nodes = [...branchNodes, ...childNodes];
  const left = Math.min(...nodes.map((node) => node.x - node.size / 2));
  const right = Math.max(...nodes.map((node) => node.x + node.size / 2));
  const top = Math.min(...nodes.map((node) => node.y - node.size / 2));
  const bottom = Math.max(...nodes.map((node) => node.y + node.size / 2));

  const positions: EmotionTreePositions = Object.fromEntries(
    branchNodes.map((node) => [node.cluster, { x: node.x, y: node.y }]),
  );

  return {
    nodes,
    positions,
    bounds: {
      width: right - left,
      height: bottom - top,
      centerX: (left + right) / 2,
      centerY: (top + bottom) / 2,
    },
  };
}
