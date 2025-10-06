// Backend API Endpoints Configuration
// This file centralizes all API endpoint definitions for consistency

export const endpoints = {
  auth: {
    basic: {
      login: '/login',
      logout: '/logout',
      register: '/register',
    },
    google: {
      init: '/google/init',
      callback: '/google/callback',
      exchange: '/google/token',
    },
    email: {
      verify: '/email/verify',
      resend: '/email/resend',
      confirm: '/email/confirm/',
    },
    password: {
      change: '/password/change',
      reset: '/password/reset',
      confirm: '/password/reset/confirm',
    },
    phone: {
      verify: '/phone/verify',
      resend: '/phone/resend',
      confirm: '/phone/confirm',
    },
    profile: '/profile',
    token: {
      refresh: '/token/refresh',
      verify: '/token/verify',
    },
    account: {
      delete: '/account/delete',
      confirm: '/account/delete/confirm',
      request: '/account/delete/request',
    },
  },

  admin: {
    pickups: {
      all: '/admin/pickups',
      assign: '/admin/pickups/assign',
      detail: '/admin/pickups/:id',
    },
    drivers: {
      all: '/admin/drivers',
      detail: '/admin/drivers/:id',
    },
    dashboard: {
      stats: '/admin/dashboard/stats',
    },
    users: {
      all: '/admin/users',
    },
  },

  customer: {
    pickups: {
      all: '/pickups',
      request: '/pickups/request',
      my: '/pickups/my',
      detail: '/pickups/:id',
      cancel: '/pickups/:id/cancel',
      photos: '/pickups/:id/photos',
      tracking: '/pickups/:id/tracking',
      rate: '/pickups/:id/rate',
      contactDriver: '/pickups/:id/contact-driver',
      stats: '/pickups/stats',
      recurring: {
        all: '/pickups/recurring',
        create: '/pickups/recurring/create',
        detail: '/pickups/recurring/:id',
        toggle: '/pickups/recurring/:id/toggle',
      },
    },
  },

  portfolio: {
    get: '/portfolio',
    projects: {
      get: '/projects',
      getById: '/projects/:id',
    },
    skills: {
      get: '/skills',
    },
    services: {
      get: '/services',
    },
    intro: {
      get: '/intro',
    },
    contact: {
      get: '/contact',
    },
    social: {
      get: '/social',
    },
    logotext: {
      get: '/logotext',
    },
  },

  // API versioning
  api: {
    v1: '/api/v1',
  },

  // Health check
  health: '/health',
};

export default endpoints;
