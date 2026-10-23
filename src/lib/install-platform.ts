export type InstallPlatform =
  | "ios-safari"
  | "ios-safari-legacy"
  | "ipad-safari"
  | "ios-chrome"
  | "ios-in-app"
  | "ios-other"
  | "mac-safari"
  | "android-chrome"
  | "android-other"
  | "unknown";

const IN_APP_PATTERN =
  /FBAN|FBAV|FB_IAB|Instagram|Line\/|TikTok|musical_ly|Snapchat|LinkedInApp|GSA\//i;
const IOS_OTHER_BROWSER_PATTERN = /FxiOS|EdgiOS|OPiOS|OPT\/|DuckDuckGo|YaBrowser/i;
const ANDROID_NON_CHROMIUM_PATTERN =
  /MiuiBrowser|XiaoMi|HeyTapBrowser|UCBrowser|HuaweiBrowser|Firefox|; wv\)/i;
const ANDROID_OTHER_CHROMIUM_PATTERN = /SamsungBrowser|EdgA|OPR\/|YaBrowser|Brave/i;
const SAFARI_MODERN_VERSION = 26;

function getIosPlatform(userAgent: string, isIpad: boolean): InstallPlatform {
  if (IN_APP_PATTERN.test(userAgent) || !/Safari\//.test(userAgent)) {
    return "ios-in-app";
  }

  if (/CriOS/.test(userAgent)) {
    return "ios-chrome";
  }

  if (IOS_OTHER_BROWSER_PATTERN.test(userAgent)) {
    return "ios-other";
  }

  if (isIpad) {
    return "ipad-safari";
  }

  const version = Number(/Version\/(\d+)/.exec(userAgent)?.[1] ?? 0);
  return version >= SAFARI_MODERN_VERSION ? "ios-safari" : "ios-safari-legacy";
}

function getAndroidPlatform(userAgent: string): InstallPlatform {
  if (
    IN_APP_PATTERN.test(userAgent) ||
    ANDROID_NON_CHROMIUM_PATTERN.test(userAgent) ||
    !/Chrome\/\d/.test(userAgent)
  ) {
    return "android-other";
  }

  if (ANDROID_OTHER_CHROMIUM_PATTERN.test(userAgent)) {
    return "unknown";
  }

  return "android-chrome";
}

export function getInstallPlatform(
  userAgent: string,
  maxTouchPoints: number,
): InstallPlatform {
  const isIpad =
    /iPad/.test(userAgent) ||
    (/Macintosh/.test(userAgent) && maxTouchPoints > 1);

  if (/iPhone|iPod/.test(userAgent) || isIpad) {
    return getIosPlatform(userAgent, isIpad);
  }

  if (/Android/.test(userAgent)) {
    return getAndroidPlatform(userAgent);
  }

  if (
    /Macintosh/.test(userAgent) &&
    /Version\/\d+.*Safari\//.test(userAgent) &&
    !/Chrome|Chromium|Firefox|Edg/.test(userAgent)
  ) {
    return "mac-safari";
  }

  return "unknown";
}

export function getOpenInChromeUrl(href: string) {
  const url = new URL(href);
  return `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(href)};end`;
}
