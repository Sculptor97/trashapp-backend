import express from 'express';
import { portfolioController } from '../controllers/portfolioController.js';
import { endpoints } from '../config/endpoints.js';

const router = express.Router();

router.get(endpoints.portfolio.get, portfolioController.getPortfolio);
router.get(endpoints.portfolio.projects.get, portfolioController.getProjects);
router.get(
  endpoints.portfolio.projects.getById,
  portfolioController.getProjectById
);
router.get(endpoints.portfolio.skills.get, portfolioController.getSkills);
router.get(endpoints.portfolio.services.get, portfolioController.getServices);
router.get(endpoints.portfolio.intro.get, portfolioController.getIntroData);
router.get(
  endpoints.portfolio.contact.get,
  portfolioController.getContactConfig
);
router.get(
  endpoints.portfolio.social.get,
  portfolioController.getSocialProfils
);
router.get(endpoints.portfolio.logotext.get, portfolioController.getLogotext);

export default router;
