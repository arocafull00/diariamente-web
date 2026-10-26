export type FaceId =
  | "01_gradiente"
  | "02_azul_rosa"
  | "03_verde_morado"
  | "04_naranja_amarillo"
  | "05_rosa_verde"
  | "alegria"
  | "ansiedad"
  | "rabia"
  | "tristeza";

export function getFaceUrl(faceId: FaceId): string {
  return `/caras/${faceId}.svg`;
}
