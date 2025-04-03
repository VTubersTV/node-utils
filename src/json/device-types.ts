export interface DeviceTypesConfig {
  deviceTypes: string[];
  deviceRegex: {
    [key: string]: string;
  };
}

export const deviceTypesConfig: DeviceTypesConfig = {
  deviceTypes: ["mobile", "tablet", "desktop"],
  deviceRegex: {
    mobile: "Mobile|Android|iPhone|iPad|iPod|Windows Phone",
    tablet: "iPad|Tablet|PlayBook|Silk",
    desktop: "Windows NT|Macintosh|Linux"
  }
}; 