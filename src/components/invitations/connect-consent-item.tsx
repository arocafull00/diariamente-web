type ConnectConsentItemProps = {
  text: string;
};

export function ConnectConsentItem({ text }: ConnectConsentItemProps) {
  return (
    <li>{text}</li>
  );
}
