const LAST_ACTIVITY_KEY = "diariamente-last-activity";

type LastActivity = {
  userId: string;
  sessionId: string;
  at: number;
};

export function readLastActivity(): LastActivity | null {
  try {
    const value = localStorage.getItem(LAST_ACTIVITY_KEY);

    return value ? (JSON.parse(value) as LastActivity) : null;
  } catch {
    return null;
  }
}

export function writeLastActivity(value: LastActivity) {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, JSON.stringify(value));
  } catch {}
}

export function clearLastActivity() {
  try {
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  } catch {}
}
