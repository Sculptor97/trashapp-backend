// Backend API Endpoints Configuration
// This file centralizes all API endpoint definitions for consistency

export const endpoints = {
  auth: {
    basic: {
      login: '/login/',
      logout: '/logout/',
      register: '/register/',
    },
    google: {
      init: '/google/init/',
      callback: '/google/callback/',
      exchange: '/google/token/',
    },
    email: {
      verify: '/email/verify/',
      resend: '/email/resend/',
      confirm: '/email/confirm/',
    },
    password: {
      change: '/password/change/',
      reset: '/password/reset/',
      confirm: '/password/reset/confirm/',
    },
    phone: {
      verify: '/phone/verify/',
      resend: '/phone/resend/',
      confirm: '/phone/confirm/',
    },
    profile: '/profile/',
    token: {
      refresh: '/token/refresh/',
      verify: '/token/verify/',
    },
    account: {
      delete: '/account/delete/',
      confirm: '/account/delete/confirm/',
      request: '/account/delete/request/',
    },
  },

  admin: {
    pickups: {
      all: '/admin/pickups/',
      assign: '/admin/pickups/assign/',
      detail: pickupId => `/admin/pickups/${pickupId}`,
    },
    drivers: {
      all: '/admin/drivers/',
      detail: driverId => `/admin/drivers/${driverId}`,
    },
    dashboard: {
      stats: '/admin/dashboard/stats/',
    },
    users: {
      all: '/admin/users/',
    },
  },

  customer: {
    pickups: {
      all: '/customer/pickups',
      request: '/customer/pickups/request',
      my: '/customer/pickups/my',
      myWithFilters: params => `/customer/pickups/my?${params}`,
      detail: pickupId => `/customer/pickups/${pickupId}`,
      cancel: pickupId => `/customer/pickups/${pickupId}/cancel`,
      photos: pickupId => `/customer/pickups/${pickupId}/photos`,
      tracking: pickupId => `/customer/pickups/${pickupId}/tracking`,
      rate: pickupId => `/customer/pickups/${pickupId}/rate`,
      contactDriver: pickupId => `/customer/pickups/${pickupId}/contact-driver`,
      stats: '/customer/pickups/stats',
      recurring: {
        all: '/customer/pickups/recurring',
        create: '/customer/pickups/recurring/create',
        detail: scheduleId => `/customer/pickups/recurring/${scheduleId}`,
        toggle: scheduleId =>
          `/customer/pickups/recurring/${scheduleId}/toggle`,
      },
    },
  },

  // API versioning
  api: {
    v1: '/api/v1',
  },

  // Health check
  health: '/health',
};

// Helper function to get full API path
export const getApiPath = (endpoint, version = 'v1') => {
  return `${endpoints.api[version]}${endpoint}`;
};

// Helper function to get auth endpoints with full path
export const getAuthEndpoints = () => {
  const authEndpoints = {};

  // Basic auth
  authEndpoints.basic = {
    login: getApiPath(endpoints.auth.basic.login),
    logout: getApiPath(endpoints.auth.basic.logout),
    register: getApiPath(endpoints.auth.basic.register),
  };

  // Google auth
  authEndpoints.google = {
    init: getApiPath(endpoints.auth.google.init),
    callback: getApiPath(endpoints.auth.google.callback),
    exchange: getApiPath(endpoints.auth.google.exchange),
  };

  // Email
  authEndpoints.email = {
    verify: getApiPath(endpoints.auth.email.verify),
    resend: getApiPath(endpoints.auth.email.resend),
    confirm: getApiPath(endpoints.auth.email.confirm),
  };

  // Password
  authEndpoints.password = {
    change: getApiPath(endpoints.auth.password.change),
    reset: getApiPath(endpoints.auth.password.reset),
    confirm: getApiPath(endpoints.auth.password.confirm),
  };

  // Phone
  authEndpoints.phone = {
    verify: getApiPath(endpoints.auth.phone.verify),
    resend: getApiPath(endpoints.auth.phone.resend),
    confirm: getApiPath(endpoints.auth.phone.confirm),
  };

  // Profile and tokens
  authEndpoints.profile = getApiPath(endpoints.auth.profile);
  authEndpoints.token = {
    refresh: getApiPath(endpoints.auth.token.refresh),
    verify: getApiPath(endpoints.auth.token.verify),
  };

  // Account management
  authEndpoints.account = {
    delete: getApiPath(endpoints.auth.account.delete),
    confirm: getApiPath(endpoints.auth.account.confirm),
    request: getApiPath(endpoints.auth.account.request),
  };

  return authEndpoints;
};

// Helper function to get admin endpoints with full path
export const getAdminEndpoints = () => {
  return {
    pickups: {
      all: getApiPath(endpoints.admin.pickups.all),
      assign: getApiPath(endpoints.admin.pickups.assign),
      detail: pickupId => getApiPath(endpoints.admin.pickups.detail(pickupId)),
    },
    drivers: {
      all: getApiPath(endpoints.admin.drivers.all),
      detail: driverId => getApiPath(endpoints.admin.drivers.detail(driverId)),
    },
    dashboard: {
      stats: getApiPath(endpoints.admin.dashboard.stats),
    },
    users: {
      all: getApiPath(endpoints.admin.users.all),
    },
  };
};

// Helper function to get customer endpoints with full path
export const getCustomerEndpoints = () => {
  return {
    pickups: {
      all: getApiPath(endpoints.customer.pickups.all),
      request: getApiPath(endpoints.customer.pickups.request),
      my: getApiPath(endpoints.customer.pickups.my),
      myWithFilters: params =>
        getApiPath(endpoints.customer.pickups.myWithFilters(params)),
      detail: pickupId =>
        getApiPath(endpoints.customer.pickups.detail(pickupId)),
      cancel: pickupId =>
        getApiPath(endpoints.customer.pickups.cancel(pickupId)),
      photos: pickupId =>
        getApiPath(endpoints.customer.pickups.photos(pickupId)),
      tracking: pickupId =>
        getApiPath(endpoints.customer.pickups.tracking(pickupId)),
      rate: pickupId => getApiPath(endpoints.customer.pickups.rate(pickupId)),
      contactDriver: pickupId =>
        getApiPath(endpoints.customer.pickups.contactDriver(pickupId)),
      stats: getApiPath(endpoints.customer.pickups.stats),
      recurring: {
        all: getApiPath(endpoints.customer.pickups.recurring.all),
        create: getApiPath(endpoints.customer.pickups.recurring.create),
        detail: scheduleId =>
          getApiPath(endpoints.customer.pickups.recurring.detail(scheduleId)),
        toggle: scheduleId =>
          getApiPath(endpoints.customer.pickups.recurring.toggle(scheduleId)),
      },
    },
  };
};

export default endpoints;
