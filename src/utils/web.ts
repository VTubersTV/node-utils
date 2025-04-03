import deviceTypesData from '../json/device-types.json';

/**
 * Gets device information including user agent, device type, browser details, and screen properties
 * @returns {Promise<{
 *   userAgent: string,
 *   deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown',
 *   browser: {
 *     name: string,
 *     version: string,
 *     language: string,
 *     platform: string,
 *     vendor: string,
 *     cookiesEnabled: boolean,
 *     doNotTrack: string
 *   },
 *   screen: {
 *     width: number,
 *     height: number,
 *     colorDepth: number,
 *     pixelRatio: number,
 *     orientation: string
 *   }
 * }>} Device information object
 */
async function getDeviceInfo() {
  const userAgent = navigator.userAgent;
  type DeviceType = 'mobile' | 'tablet' | 'desktop';
  const deviceTypes = deviceTypesData.deviceTypes as DeviceType[];
  const deviceRegex: Record<DeviceType, RegExp> = {
    mobile: new RegExp(deviceTypesData.deviceRegex.mobile, 'i'),
    tablet: new RegExp(deviceTypesData.deviceRegex.tablet, 'i'),
    desktop: new RegExp(deviceTypesData.deviceRegex.desktop, 'i')
  };

  const deviceType = deviceTypes.find(type => deviceRegex[type].test(userAgent)) || 'unknown';

  return {
    userAgent,
    deviceType,
    browser: {
      name: navigator.appName,
      version: navigator.appVersion,
      language: navigator.language,
      platform: navigator.platform,
      vendor: navigator.vendor,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || 'unknown'
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      orientation: window.screen.orientation?.type || 'unknown'
    }
  };
}
