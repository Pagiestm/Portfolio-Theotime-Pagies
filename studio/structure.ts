import type { StructureResolver } from 'sanity/structure';

/**
 * Navigation du Studio.
 *
 * Les documents uniques (réglages, pages) sont épinglés en haut et ouverts
 * directement en édition : sans ça, Sanity les présenterait comme des listes
 * où l'on pourrait créer un second exemplaire par erreur.
 */
const SINGLETONS: Array<[type: string, title: string, icon: string]> = [
  ['siteSettings', 'Réglages du site', '⚙️'],
  ['homePage', 'Accueil', '🏠'],
  ['workPage', 'Réalisations', '📁'],
  ['pathPage', 'Parcours', '🧭'],
  ['skillsPage', 'Compétences', '🧰'],
  ['aboutPage', 'À propos', '👤'],
  ['contactPage', 'Contact', '✉️'],
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items(
              SINGLETONS.map(([type, title]) =>
                S.listItem()
                  .title(title)
                  .id(type)
                  .child(S.document().schemaType(type).documentId(type).title(title))
              )
            )
        ),
      S.divider(),
      S.documentTypeListItem('project').title('Réalisations'),
      S.documentTypeListItem('journeyEntry').title('Parcours'),
      S.documentTypeListItem('skillGroup').title('Groupes de compétences'),
      S.divider(),
      S.documentTypeListItem('technology').title('Technologies'),
    ]);
