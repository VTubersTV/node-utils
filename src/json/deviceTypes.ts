export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceTypesConfig {
  deviceTypes: DeviceType[];
  deviceRegex: Record<DeviceType, string>;
}

export const deviceTypesConfig: DeviceTypesConfig = {
  deviceTypes: ['mobile', 'tablet', 'desktop'],
  deviceRegex: {
    mobile: 'Mobile|Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry',
    tablet: 'iPad|Tablet|PlayBook|Silk|Android(?!.*Mobile)',
    desktop: 'Windows NT|Macintosh|Linux|X11|Ubuntu|Fedora|Chrome OS'
  }
};