import {
  BODY_REGION_IDS,
  getBodyRegionPhrase,
  type BodyRegionId,
} from "@/lib/body-sensations";

type BodyRegionListProps = {
  onSelect: (region: BodyRegionId) => void;
};

export function BodyRegionList({ onSelect }: BodyRegionListProps) {
  return (
    <ul className="sr-only" aria-label="Zonas del cuerpo">
      {BODY_REGION_IDS.map((id) => (
        <li key={id}>
          <button type="button" onClick={() => onSelect(id)}>
            {getBodyRegionPhrase(id)}
          </button>
        </li>
      ))}
    </ul>
  );
}
