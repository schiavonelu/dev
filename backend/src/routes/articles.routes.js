import { Router } from 'express';
import { listArticles, getArticle, createArticle, updateArticle, deleteArticle } from '../controllers/articles.controller.js';
import { requireAdmin } from '../utils/requireAdmin.js';

const router = Router();

// Lista / Dettaglio
router.get('/',        listArticles);
router.get('/:slug',   getArticle);

// Crea / Aggiorna / Elimina (protetti)
router.post('/',         requireAdmin, createArticle);
router.patch('/:slug',   requireAdmin, updateArticle);
router.delete('/:slug',  requireAdmin, deleteArticle);

export default router;




