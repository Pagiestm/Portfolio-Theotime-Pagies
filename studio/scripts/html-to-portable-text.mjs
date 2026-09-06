/**
 * Convertit le HTML des anciens `modalContent` en Portable Text.
 *
 * Le corpus n'utilise que <div>, <p>, <ul> et <li>, avec deux particularités :
 * un <ul> commence souvent par un intitulé (<p> ou texte nu) avant ses <li>,
 * et certains <p class="attention"> portent un avertissement. On traite donc
 * ces intitulés comme des sous-titres et le reste comme des paragraphes.
 *
 * Écrit à la main plutôt qu'avec @sanity/block-tools : la structure est
 * connue et régulière, et cela évite d'embarquer JSDOM pour un script joué
 * une seule fois.
 */

let counter = 0;
const key = () => `k${(counter += 1).toString(36)}`;

const ENTITIES = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&eacute;': 'é',
  '&egrave;': 'è',
};

const decode = (text) =>
  Object.entries(ENTITIES)
    .reduce((acc, [entity, char]) => acc.split(entity).join(char), text)
    .replace(/\s+/g, ' ')
    .trim();

const block = (text, { style = 'normal', listItem } = {}) => {
  const node = {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  };
  if (listItem) {
    node.listItem = listItem;
    node.level = 1;
  }
  return node;
};

export const htmlToPortableText = (html) => {
  if (!html) return [];

  const blocks = [];
  let insideList = false;

  // Découpe le flux en balises et en texte nu, dans l'ordre du document.
  const tokens = html.match(/<\/?[a-zA-Z][^>]*>|[^<]+/g) ?? [];
  let pending = null; // { tag: 'p' | 'li', attrs, text }

  for (const token of tokens) {
    const openTag = token.match(/^<([a-zA-Z]+)([^>]*)>$/);
    const closeTag = token.match(/^<\/([a-zA-Z]+)>$/);

    if (openTag) {
      const [, tag, attrs] = openTag;
      if (tag === 'ul' || tag === 'ol') insideList = true;
      if (tag === 'p' || tag === 'li') pending = { tag, attrs, text: '' };
      continue;
    }

    if (closeTag) {
      const [, tag] = closeTag;
      if (tag === 'ul' || tag === 'ol') insideList = false;

      if ((tag === 'p' || tag === 'li') && pending) {
        const text = decode(pending.text);
        if (text) {
          if (pending.tag === 'li') blocks.push(block(text, { listItem: 'bullet' }));
          else if (insideList) blocks.push(block(text, { style: 'h4' }));
          else blocks.push(block(text));
        }
        pending = null;
      }
      continue;
    }

    // Texte : soit dans un <p>/<li> ouvert, soit nu (intitulé de liste).
    if (pending) {
      pending.text += token;
    } else {
      const text = decode(token);
      if (text) blocks.push(block(text, { style: insideList ? 'h4' : 'normal' }));
    }
  }

  return blocks;
};
