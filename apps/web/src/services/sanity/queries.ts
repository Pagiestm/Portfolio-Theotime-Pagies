import groq from 'groq';

/**
 * Requêtes GROQ.
 *
 * Chaque requête projette exactement les champs consommés par les vues : le
 * document brut n'atteint jamais les composants, et ajouter un champ dans le
 * Studio ne change rien tant qu'il n'est pas demandé ici.
 */

const LOCALE = '{ fr, en }';
const HEADER = `{ kicker ${LOCALE}, title ${LOCALE}, body ${LOCALE} }`;
const TECH = '{ label, iconKey }';

/** Les réalisations, de la plus récente à la plus ancienne. */
export const PROJECTS_QUERY = groq`
  *[_type == "project" && defined(slug.current)] | order(endDate desc) {
    "id": slug.current,
    title,
    kicker ${LOCALE},
    period ${LOCALE},
    endDate,
    summary ${LOCALE},
    cover,
    "stack": stack[]->${TECH},
    links {
      site, github, api, figma,
      "pdfUrl": pdf.asset->url
    }
  }
`;

/** Une réalisation complète, contenu riche et galerie inclus. */
export const PROJECT_QUERY = groq`
  *[_type == "project" && slug.current == $slug][0] {
    "id": slug.current,
    title,
    kicker ${LOCALE},
    period ${LOCALE},
    endDate,
    summary ${LOCALE},
    content { fr, en },
    cover,
    gallery,
    "stack": stack[]->${TECH},
    links {
      site, github, api, figma,
      "pdfUrl": pdf.asset->url
    }
  }
`;

/** Slugs voisins, pour le lien « Projet suivant ». */
export const PROJECT_SLUGS_QUERY = groq`
  *[_type == "project" && defined(slug.current)] | order(endDate desc) {
    "id": slug.current,
    title
  }
`;

export const HOME_QUERY = groq`
  *[_type == "homePage"][0] {
    chapters[] { kicker ${LOCALE}, title ${LOCALE}, bubble ${LOCALE} },
    marquee[] { label ${LOCALE}, value ${LOCALE} },
    selectionKicker ${LOCALE},
    indexTitle ${LOCALE},
    closingTitle ${LOCALE},
    closingCta ${LOCALE}
  }
`;

export const WORK_PAGE_QUERY = groq`*[_type == "workPage"][0] { header ${HEADER} }`;
export const SKILLS_PAGE_QUERY = groq`*[_type == "skillsPage"][0] { header ${HEADER} }`;
export const CONTACT_PAGE_QUERY = groq`*[_type == "contactPage"][0] { header ${HEADER} }`;

export const PATH_PAGE_QUERY = groq`
  *[_type == "pathPage"][0] {
    header ${HEADER},
    corridorHint ${LOCALE}
  }
`;

export const ABOUT_QUERY = groq`
  *[_type == "aboutPage"][0] {
    header ${HEADER},
    portrait,
    "paragraphs": paragraphs[] ${LOCALE},
    facts[] { label ${LOCALE}, value ${LOCALE} }
  }
`;

export const JOURNEY_QUERY = groq`
  *[_type == "journeyEntry"] | order(startDate desc) {
    kind, org,
    period ${LOCALE},
    role ${LOCALE},
    detail ${LOCALE}
  }
`;

export const SKILL_GROUPS_QUERY = groq`
  *[_type == "skillGroup"] | order(order asc) {
    title ${LOCALE},
    items[] {
      "tech": tech->${TECH},
      label ${LOCALE}
    }
  }
`;

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    name,
    role ${LOCALE},
    email, github, linkedin, siteUrl
  }
`;
