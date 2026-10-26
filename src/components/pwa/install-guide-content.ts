import {
  AppWindow,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Compass,
  Copy,
  Download,
  Ellipsis,
  EllipsisVertical,
  ExternalLink,
  type LucideIcon,
  Plus,
  Share,
  SquarePlus,
} from "lucide-react";

import type { InstallPlatform } from "@/lib/install-platform";

export type InstallGuideToolbarItem = LucideIcon | "address";

export type InstallGuidePointer = "top-right" | "bottom-center" | "bottom-right";

export type InstallGuide = {
  title: string;
  description: string;
  steps: { icon: LucideIcon; text: string }[];
  toolbar: {
    position: "top" | "bottom";
    items: InstallGuideToolbarItem[];
    targetIndex: number;
  } | null;
  pointer: { position: InstallGuidePointer; label: string } | null;
  hint: string | null;
  action: "open-chrome" | "copy-link" | null;
};

const confirmStep = { icon: CircleCheck, text: "Pulsa «Añadir» y listo." };
const addToHomeStep = {
  icon: SquarePlus,
  text: "Elige «Añadir a pantalla de inicio». Si no lo ves, desliza hacia abajo.",
};
const safariHint = "Si no ves la barra del navegador, toca la parte inferior de la pantalla.";

export const installGuides: Record<InstallPlatform, InstallGuide> = {
  "ios-safari": {
    title: "Instala Diariamente en tu iPhone",
    description: "Safari no instala apps con un solo botón, pero son pocos toques:",
    steps: [
      { icon: Ellipsis, text: "Pulsa ··· en la barra de abajo, a la derecha." },
      { icon: Share, text: "Pulsa «Compartir»." },
      addToHomeStep,
      confirmStep,
    ],
    toolbar: {
      position: "bottom",
      items: [ChevronLeft, "address", Ellipsis],
      targetIndex: 2,
    },
    pointer: { position: "bottom-right", label: "Pulsa ···" },
    hint: safariHint,
    action: null,
  },
  "ios-safari-legacy": {
    title: "Instala Diariamente en tu iPhone",
    description: "Safari no instala apps con un solo botón, pero son pocos toques:",
    steps: [
      { icon: Share, text: "Pulsa Compartir en la barra de abajo, en el centro." },
      addToHomeStep,
      confirmStep,
    ],
    toolbar: {
      position: "bottom",
      items: [ChevronLeft, ChevronRight, Share, BookOpen, Copy],
      targetIndex: 2,
    },
    pointer: { position: "bottom-center", label: "Pulsa Compartir" },
    hint: safariHint,
    action: null,
  },
  "ipad-safari": {
    title: "Instala Diariamente en tu iPad",
    description: "Safari no instala apps con un solo botón, pero son pocos toques:",
    steps: [
      { icon: Share, text: "Pulsa Compartir arriba a la derecha." },
      addToHomeStep,
      confirmStep,
    ],
    toolbar: {
      position: "top",
      items: ["address", Share, Plus, Copy],
      targetIndex: 1,
    },
    pointer: { position: "top-right", label: "Pulsa Compartir" },
    hint: null,
    action: null,
  },
  "ios-chrome": {
    title: "Instala Diariamente en tu iPhone",
    description: "Chrome en iPhone no instala apps con un solo botón, pero son pocos toques:",
    steps: [
      { icon: Share, text: "Pulsa Compartir en la barra de dirección, arriba a la derecha." },
      {
        icon: SquarePlus,
        text: "Elige «Añadir a pantalla de inicio». Si no aparece, pulsa «Más».",
      },
      confirmStep,
    ],
    toolbar: {
      position: "top",
      items: ["address", Share],
      targetIndex: 1,
    },
    pointer: { position: "top-right", label: "Pulsa Compartir" },
    hint: null,
    action: null,
  },
  "ios-in-app": {
    title: "Ábrela en Safari",
    description:
      "Estás navegando dentro de otra app y desde aquí no se puede instalar Diariamente.",
    steps: [
      {
        icon: Ellipsis,
        text: "Pulsa ··· y elige «Abrir en Safari» o «Abrir en el navegador».",
      },
      { icon: Copy, text: "Si no aparece, copia el enlace y pégalo en Safari." },
      { icon: Compass, text: "En Safari, vuelve a pulsar «Descargar app»." },
    ],
    toolbar: null,
    pointer: null,
    hint: null,
    action: "copy-link",
  },
  "ios-other": {
    title: "Instala Diariamente",
    description:
      "Tu navegador puede añadirla a la pantalla de inicio desde su menú. En Safari es más sencillo.",
    steps: [
      { icon: Share, text: "Abre el menú del navegador y pulsa «Compartir»." },
      addToHomeStep,
      { icon: Compass, text: "Si no aparece, copia el enlace y ábrelo en Safari." },
    ],
    toolbar: null,
    pointer: null,
    hint: null,
    action: "copy-link",
  },
  "mac-safari": {
    title: "Instala Diariamente en tu Mac",
    description: "Safari la añade al Dock como una app más:",
    steps: [
      { icon: Share, text: "Pulsa Compartir arriba a la derecha." },
      { icon: AppWindow, text: "Elige «Añadir al Dock»." },
      confirmStep,
    ],
    toolbar: {
      position: "top",
      items: ["address", Share, Plus, Copy],
      targetIndex: 1,
    },
    pointer: { position: "top-right", label: "Pulsa Compartir" },
    hint: null,
    action: null,
  },
  "android-chrome": {
    title: "Instala Diariamente",
    description: "Puedes instalarla desde el menú de Chrome:",
    steps: [
      { icon: EllipsisVertical, text: "Pulsa ⋮ arriba a la derecha." },
      {
        icon: Download,
        text: "Elige «Instalar aplicación» o «Añadir a pantalla de inicio».",
      },
      { icon: CircleCheck, text: "Confirma con «Instalar»." },
    ],
    toolbar: {
      position: "top",
      items: ["address", Copy, EllipsisVertical],
      targetIndex: 2,
    },
    pointer: { position: "top-right", label: "Pulsa ⋮" },
    hint: null,
    action: null,
  },
  "android-other": {
    title: "Ábrela en Chrome para instalarla",
    description:
      "Este navegador no permite instalar Diariamente. En Chrome se instala con un solo toque.",
    steps: [
      { icon: ExternalLink, text: "Pulsa «Abrir en Chrome»." },
      { icon: Download, text: "En Chrome, vuelve a pulsar «Descargar app»." },
    ],
    toolbar: null,
    pointer: null,
    hint: null,
    action: "open-chrome",
  },
  unknown: {
    title: "Instala Diariamente",
    description: "Tu navegador no muestra el instalador automático.",
    steps: [
      { icon: EllipsisVertical, text: "Abre el menú del navegador." },
      {
        icon: Download,
        text: "Elige «Instalar aplicación» o «Añadir a pantalla de inicio».",
      },
      { icon: ExternalLink, text: "Si no aparece, abre Diariamente en Chrome." },
    ],
    toolbar: null,
    pointer: null,
    hint: null,
    action: "copy-link",
  },
};
