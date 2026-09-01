import { useEffect, useState } from 'react';

/**
 * Affichage progressif d'une liste (« Voir plus »), remis à zéro dès que
 * la liste source change - sinon un filtre laisserait le compteur trop haut.
 */
export const usePagination = (items, step = 3) => {
  const [visible, setVisible] = useState(step);

  useEffect(() => setVisible(step), [items, step]);

  return {
    items: items.slice(0, visible),
    hasMore: visible < items.length,
    showMore: () => setVisible((count) => Math.min(count + step, items.length)),
  };
};
