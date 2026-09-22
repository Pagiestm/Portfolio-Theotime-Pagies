import { useState } from 'react';

export const usePagination = (items, step = 3) => {
  const [visible, setVisible] = useState(step);
  const [source, setSource] = useState(items);

  if (source !== items) {
    setSource(items);
    setVisible(step);
  }

  return {
    items: items.slice(0, visible),
    hasMore: visible < items.length,
    showMore: () => setVisible((count) => Math.min(count + step, items.length)),
  };
};
