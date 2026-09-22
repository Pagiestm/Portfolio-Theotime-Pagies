/**
 * Réglages de la scène 3D.
 *
 * Tout ce qui relève de l'identité - nom, adresse, liens, URL du site - vit dans
 * les réglages Sanity et se lit par `useSettings()` : le dupliquer ici le
 * ferait diverger au premier changement.
 */
export const scene = {
  density: 700,
  backgroundDensity: 380,
  cardTilt: true,
};
