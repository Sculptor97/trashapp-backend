import asyncHandler from 'express-async-handler';
import {
  meta,
  dataabout,
  dataportfolio,
  worktimeline,
  skills,
  services,
  introdata,
  contactConfig,
  socialprofils,
  logotext,
} from '../data/portfolio.js';

export const portfolioController = {
  // @desc    Get portfolio data
  // @route   GET /api/v1/portfolio
  // @access  Public
  getPortfolio: asyncHandler(async (req, res) => {
    res.success(
      {
        meta,
        dataabout,
        dataportfolio,
        worktimeline,
        skills,
        services,
        introdata,
        contactConfig,
        socialprofils,
        logotext,
      },
      'Portfolio data retrieved successfully'
    );
  }),

  // @desc    Get portfolio projects
  // @route   GET /api/v1/portfolio/projects
  // @access  Public
  getProjects: asyncHandler(async (req, res) => {
    res.success(dataportfolio, 'Portfolio projects retrieved successfully');
  }),

  // @desc    Get portfolio project by id
  // @route   GET /api/v1/portfolio/projects/:id
  // @access  Public
  getProjectById: asyncHandler(async (req, res) => {
    const project = dataportfolio.find(project => project.id === req.params.id);
    res.success(project, 'Portfolio project retrieved successfully');
  }),

  // @desc    Get portfolio skills
  // @route   GET /api/v1/portfolio/skills
  // @access  Public
  getSkills: asyncHandler(async (req, res) => {
    res.success(skills, 'Portfolio skills retrieved successfully');
  }),

  // @desc    Get portfolio services
  // @route   GET /api/v1/portfolio/services
  // @access  Public
  getServices: asyncHandler(async (req, res) => {
    res.success(services, 'Portfolio services retrieved successfully');
  }),

  // @desc    Get portfolio intro data
  // @route   GET /api/v1/portfolio/intro
  // @access  Public
  getIntroData: asyncHandler(async (req, res) => {
    res.success(introdata, 'Portfolio intro data retrieved successfully');
  }),

  // @desc    Get portfolio contact config
  // @route   GET /api/v1/portfolio/contact
  // @access  Public
  getContactConfig: asyncHandler(async (req, res) => {
    res.success(
      contactConfig,
      'Portfolio contact config retrieved successfully'
    );
  }),

  // @desc    Get portfolio social profils
  // @route   GET /api/v1/portfolio/social
  // @access  Public
  getSocialProfils: asyncHandler(async (req, res) => {
    res.success(
      { ...socialprofils },
      'Portfolio social profils retrieved successfully'
    );
  }),

  // @desc    Get portfolio logotext
  // @route   GET /api/v1/portfolio/logotext
  // @access  Public
  getLogotext: asyncHandler(async (req, res) => {
    res.success(logotext, 'Portfolio logotext retrieved successfully');
  }),
};
