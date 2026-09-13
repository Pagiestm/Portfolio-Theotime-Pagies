import { handler } from '@portfolio/api';

/**
 * Point d'entrée Vercel : toute URL sous `/api/` arrive ici et repart vers
 * l'application `@portfolio/api`. Rien d'autre ne vit dans ce dossier.
 */
export default handler;
