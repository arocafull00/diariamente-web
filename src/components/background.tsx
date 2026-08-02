export function Background() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 bg-background"
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 540 960"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill="var(--background)" d="M0 0h540v960H0z" />
        <path
          fill="var(--secondary)"
          d="M540 297c-29.3-25.3-58.5-50.6-98-60.5-39.4-9.9-89.1-4.5-112-26.5-23-22-19.2-71.3-29.3-110.9-10-39.6-33.9-69.3-57.7-99.1h297Z"
        />
        <path
          fill="var(--secondary)"
          d="M0 663c33 15.9 66 31.9 105.2 42.9C144.5 717 190 723.1 210 750c20 26.8 14.4 74.4 24.7 112.8 10.2 38.4 36.3 67.8 62.3 97.2H0Z"
        />
      </svg>
    </div>
  );
}
