// Ant Design Theme Configuration for BRAVOCARS
export const lightTheme = {
  token: {
    // Brand Colors
    colorPrimary: '#1976d2',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',

    // Typography
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

    // Spacing
    borderRadius: 8,
    paddingXS: 8,
    paddingSM: 12,
    padding: 16,
    paddingMD: 16,
    paddingLG: 24,
    paddingXL: 32,

    // Layout
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBgElevated: '#ffffff',

    // Text Colors
    colorText: 'rgba(0, 0, 0, 0.88)',
    colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
    colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
    colorTextQuaternary: 'rgba(0, 0, 0, 0.25)',
  },
  components: {
    Button: {
      controlHeight: 36,
      borderRadius: 8,
    },
    Input: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Card: {
      borderRadiusLG: 12,
    },
    Layout: {
      headerBg: '#1565c0',
      headerColor: '#ffffff',
      footerBg: '#f5f5f5',
      bodyBg: '#ffffff',
    },
  },
};

export const darkTheme = {
  token: {
    // Brand Colors (same as light)
    colorPrimary: '#1976d2',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',

    // Typography
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

    // Spacing (same as light)
    borderRadius: 8,
    paddingXS: 8,
    paddingSM: 12,
    padding: 16,
    paddingMD: 16,
    paddingLG: 24,
    paddingXL: 32,
  },
  components: {
    Button: {
      controlHeight: 36,
      borderRadius: 8,
    },
    Input: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Card: {
      borderRadiusLG: 12,
    },
    Layout: {
      headerBg: '#1E3A5F',
      headerColor: '#ffffff',
    },
  },
};
