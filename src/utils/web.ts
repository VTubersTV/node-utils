import { deviceTypesConfig } from '../json/device-types';

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
export async function getDeviceInfo() {
  const userAgent = navigator.userAgent;
  type DeviceType = 'mobile' | 'tablet' | 'desktop';
  const deviceTypes = deviceTypesConfig.deviceTypes as DeviceType[];
  const deviceRegex: Record<DeviceType, RegExp> = {
    mobile: new RegExp(deviceTypesConfig.deviceRegex.mobile, 'i'),
    tablet: new RegExp(deviceTypesConfig.deviceRegex.tablet, 'i'),
    desktop: new RegExp(deviceTypesConfig.deviceRegex.desktop, 'i')
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
