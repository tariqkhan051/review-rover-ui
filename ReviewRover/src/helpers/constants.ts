export const BASE_API_URL = 'http://dev-35/reviewapi';

export const ENDPOINTS = {
  LOGIN: BASE_API_URL + '/api/auth/signin',
  LOGOUT: BASE_API_URL + '/api/auth/signout',
  REVIEWS: BASE_API_URL + '/api/test/reviews',
  DEPT_REVIEWS: BASE_API_URL + '/api/test/reviews/departments',
  PENDING_REVIEWS: BASE_API_URL + '/api/test/reviews/pending',
  PENDING_REVIEWS_USER: BASE_API_URL + '/api/test/reviews/pending/user',
  PENDING_REVIEWS_MANAGER: BASE_API_URL + '/api/test/reviews/pending/manager',
  RANKING: BASE_API_URL + '/api/test/reviews/ranking',
  USER: BASE_API_URL + '/api/test/users',
  USER_DETAILS: BASE_API_URL + '/api/test/userdetails',
  SIGN_UP: BASE_API_URL + '/api/auth/signup',
  TEAM: BASE_API_URL + '/api/test/teams',
  JOBS: BASE_API_URL + '/api/test/jobs',
  DEPARTMENT: BASE_API_URL + '/api/test/departments',
  REFRESH_TOKEN: BASE_API_URL + '/api/auth/refreshtoken'
};

export const MONTHS_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const MONTHS = MONTHS_FULL.map((month) => month.slice(0, 3));

export const FONT_SIZE = 14;
export const FONT_FAMILY = 'Manrope';
export const APP_TITLE = 'Review App';
export const SNACK_BAR_DURATION = 3000;
export const SNACK_BAR_X_POSITION = 'end';
export const SNACK_BAR_Y_POSITION = 'top';
export const TEXT_FIELDS_MAX_LENGTH = 30;
export const CHART_THEME_COLOR_DARK = 'rgba(4, 51, 109, 1)';
export const CHART_THEME_COLOR_LIGHT = 'rgba(4, 51, 109, 0.3)';

export const CHART_COLORS = [
  {
    DARK: 'rgba(230, 115, 80, 1)',
    LIGHT: 'rgba(230, 115, 80, 0.5)'
  },
  {
    DARK: 'rgba(79, 105, 55, 1)',
    LIGHT: 'rgba(79, 105, 55, 0.5)'
  },
  {
    DARK: 'rgba(235, 170, 80, 1)',
    LIGHT: 'rgba(235, 170, 80, 0.5)'
  },
  {
    DARK: 'rgba(235, 170, 189, 1)',
    LIGHT: 'rgba(235, 170, 189, 0.5)'
  },
  {
    DARK: 'rgba(102, 166, 207, 1)',
    LIGHT: 'rgba(102, 166, 207, 0.5)'
  },
  {
    DARK: 'rgba(231, 103, 4, 1)',
    LIGHT: 'rgba(231, 103, 4, 0.5)'
  },
  {
    DARK: 'rgba(102, 166, 93, 1)',
    LIGHT: 'rgba(102, 166, 93, 0.5)'
  },
  {
    DARK: 'rgba(201, 139, 135, 1)',
    LIGHT: 'rgba(201, 139, 135, 0.5)'
  },
  {
    DARK: 'rgba(69, 112, 63, 1)',
    LIGHT: 'rgba(69, 112, 63, 0.5)'
  },
  {
    DARK: 'rgba(68, 189, 160, 1)',
    LIGHT: 'rgba(68, 189, 160, 0.5)'
  },
  {
    DARK: 'rgba(163, 41, 18, 1)',
    LIGHT: 'rgba(163, 41, 18, 0.5)'
  },
  {
    DARK: 'rgba(232, 225, 52, 1)',
    LIGHT: 'rgba(232, 225, 52, 0.5)'
  },
  {
    DARK: 'rgba(106, 71, 107, 1)',
    LIGHT: 'rgba(106, 71, 107, 0.5)'
  },
  {
    DARK: 'rgba(235, 110, 5, 1)',
    LIGHT: 'rgba(235, 110, 5, 0.5)'
  },
  {
    DARK: 'rgba(97, 189, 43, 1)',
    LIGHT: 'rgba(97, 189, 43, 0.5)'
  },
  {
    DARK: 'rgba(136, 207, 196, 1)',
    LIGHT: 'rgba(136, 207, 196, 0.5)'
  },
  {
    DARK: 'rgba(62, 107, 14, 1)',
    LIGHT: 'rgba(62, 107, 14, 0.5)'
  }
];

export const PAGINATION_SETTING = Object.freeze({
  DEFAULT_PAGE_SIZE: 10,
  HIDE_PAGE_SIZE: true
});

export enum MESSAGES {
  INVALID_USERNAME_PASSWORD = 'Invalid username or password.',
  DESIGNATION_DELETED = 'Designation deleted successfully!',
  DEPARTMENT_DELETED = 'Department deleted successfully!',
  RATE_REQUIRED = 'Please rate the selected user.',
  RATE_REQUIRED_FIELDS = 'Please rate the user and fill the required fields.',
  REVIEW_STATUS_UPDATED = 'Review status updated successfully.',
  REVIEW_SUBMITTED = 'Review submitted successfully.',
  TEAM_DELETED = 'Team deleted successfully!',
  USER_DELETED = 'User deleted successfully!',
  USER_NOT_SELECTED = 'Please select a user.',
  MAX_LENGTH = 'should not exceed 30 characters.',
  MIN_LENGTH = 'should be at least 3 characters.',
  REGEX = 'cannot contain special/numeric characters.',
  REQUIRED = 'is required.',
  INVALID_EMAIL = 'Please provide a valid email address.',
  USERNAME_REGEX = 'Username can only contain alphabets, numbers and underscore.',
  PASSWORD_TOOLTIP = 'Password must be at least six characters, including at least one letter and one number.',
  RESTRICTED_WORDS = 'Your text contains restricted words. Please update.',
  DELETE_USER_MESSAGE = 'This will also delete all review records associated with this user. Are you sure you want to proceed?',
  WHITE_SPACES = 'White spaces are not allowed.',
  ERROR_FROM_API = 'Error received from API.'
}

export const RATING_TOOLTIPS = [
  'Poor',
  'Unsatisfactory',
  'Satisfactory',
  'Very Satisfactory',
  'Outstanding'
];

export enum REVIEW_TYPES {
  MONTHLY = 'MONTHLY',
  RANDOM = 'RANDOM',
  COMBINED = ''
}

export const REVIEW_TYPE_MAPPING: Record<REVIEW_TYPES, string> = {
  [REVIEW_TYPES.MONTHLY]: 'Monthly',
  [REVIEW_TYPES.RANDOM]: 'Random',
  [REVIEW_TYPES.COMBINED]: 'Combined'
};

export const SESSION_KEYS = Object.freeze({
  ACCESS_TOKEN: 'accessToken',
  AUTH_STATUS: 'authStatus',
  EMAIL: 'email',
  EXPIRES_AT: 'expiresAt',
  ID: 'id',
  IS_ADMIN: 'isAdmin',
  IS_MANAGER: 'isManager',
  REFRESH_TOKEN: 'refreshToken',
  ROLES: 'roles',
  TOKEN_TYPE: 'tokenType',
  USERNAME: 'username',
  USER_NAME: 'user',
  TEAM: 'team'
});
