/**
 * THALAMUS Email System
 * Templates for the "Temple" resident lifecycle.
 */

const BASE_STYLE = `
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: #0A0A0A;
  color: #F5F5F0;
  margin: 0;
  padding: 40px 20px;
  line-height: 1.6;
`;

const CONTAINER_STYLE = `
  max-width: 600px;
  margin: 0 auto;
  background-color: #0A0A0A;
  border: 1px solid #1A1A1A;
  padding: 40px;
`;

const GOLD_TEXT = '#D4AF37';

export const EmailTemplates = {
  /**
   * EMAIL 1 — Confirmation demande
   */
  confirmation: (firstName: string) => `
    <div style="${BASE_STYLE}">
      <div style="${CONTAINER_STYLE}">
        <h1 style="font-family: 'Cinzel', serif; color: ${GOLD_TEXT}; font-size: 24px; margin-bottom: 30px;">THALAMUS</h1>
        <p>Bonjour ${firstName},</p>
        <p>Vos mots ont été déposés devant les portes de THALAMUS.</p>
        <p>Nous les lisons. Chacun d'eux.</p>
        <p>Le Temple ne s'ouvre pas à ceux qui pressent. Il s'ouvre à ceux qui réfléchissent.</p>
        <p>Vous recevrez notre réponse dans les 48 heures.</p>
        <p style="font-style: italic; color: ${GOLD_TEXT};">Patience est le premier exercice du trader discipliné.</p>
        <div style="margin-top: 40px; border-top: 1px solid #1A1A1A; padding-top: 20px;">
          <p style="font-size: 12px; color: #555;">—<br/>Les Gardiens de THALAMUS</p>
        </div>
      </div>
    </div>
  `,

  /**
   * EMAIL 2 — Acceptation
   */
  acceptance: (firstName: string, userQuote: string) => `
    <div style="${BASE_STYLE}">
      <div style="${CONTAINER_STYLE}">
        <h1 style="font-family: 'Cinzel', serif; color: ${GOLD_TEXT}; font-size: 24px; margin-bottom: 30px;">THALAMUS</h1>
        <p>${firstName},</p>
        <p>Le Temple vous accepte.</p>
        <blockquote style="border-left: 2px solid ${GOLD_TEXT}; padding-left: 20px; font-style: italic; margin: 30px 0; color: #888;">
          "${userQuote}..."
        </blockquote>
        <p>Votre clé est active pendant 72 heures. Passé ce délai, elle se dissout.</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="#" style="background-color: ${GOLD_TEXT}; color: #0A0A0A; padding: 15px 40px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; text-transform: uppercase; letter-spacing: 2px;">Entrer dans THALAMUS</a>
        </div>
        <p>À l'intérieur :</p>
        <ul style="padding-left: 20px;">
          <li>Sentinel IA, votre garde du corps émotionnel</li>
          <li>La communauté des résidents</li>
          <li>Votre premier défi pour réduire votre abonnement</li>
        </ul>
        <p>Premier rendez-vous : coaching mardi 20h.</p>
        <p style="font-size: 12px; color: #555; margin-top: 40px;">PS : Écrivez votre serment dans votre profil.</p>
        <div style="margin-top: 20px; border-top: 1px solid #1A1A1A; padding-top: 20px;">
          <p style="font-size: 12px; color: #555;">—<br/>Les Gardiens</p>
        </div>
      </div>
    </div>
  `,

  /**
   * EMAIL 3 — Rappel expiration
   */
  expirationReminder: (firstName: string) => `
    <div style="${BASE_STYLE}">
      <div style="${CONTAINER_STYLE}">
        <h1 style="font-family: 'Cinzel', serif; color: ${GOLD_TEXT}; font-size: 24px; margin-bottom: 30px;">THALAMUS</h1>
        <p>${firstName},</p>
        <p>Vous avez demandé l'entrée. Nous avons ouvert. Vous n'êtes pas passé.</p>
        <p>Dans 24 heures, votre clé disparaît.</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="#" style="background-color: ${GOLD_TEXT}; color: #0A0A0A; padding: 15px 40px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; text-transform: uppercase; letter-spacing: 2px;">Activer maintenant</a>
        </div>
        <p>Ou laissez filer. D'autres attendent.</p>
        <div style="margin-top: 40px; border-top: 1px solid #1A1A1A; padding-top: 20px;">
          <p style="font-size: 12px; color: #555;">—<br/>THALAMUS</p>
        </div>
      </div>
    </div>
  `,

  /**
   * EMAIL 4 — Bienvenue post-inscription
   */
  welcome: (firstName: string, residentId: string) => `
    <div style="${BASE_STYLE}">
      <div style="${CONTAINER_STYLE}">
        <h1 style="font-family: 'Cinzel', serif; color: ${GOLD_TEXT}; font-size: 24px; margin-bottom: 30px;">THALAMUS</h1>
        <p>${firstName},</p>
        <p>Vous êtes maintenant à l'intérieur.</p>
        <p>Ce qui change :</p>
        <ul style="padding-left: 20px;">
          <li>Vous n'êtes plus seul avec vos émotions</li>
          <li>Chaque trade est observé, pas jugé</li>
          <li>Votre discipline est votre seul statut social</li>
        </ul>
        <div style="background-color: #111; border: 1px solid #222; padding: 20px; margin: 30px 0; border-radius: 10px;">
          <p style="margin: 0; font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 2px;">Votre premier défi commence :</p>
          <div style="height: 4px; background-color: #222; margin-top: 10px; border-radius: 2px;">
            <div style="height: 100%; width: 0%; background-color: ${GOLD_TEXT};"></div>
          </div>
          <p style="font-size: 11px; margin-top: 10px; color: #888;">Connectez-vous 30 jours. Gagnez 10% pour toujours.</p>
        </div>
        <p>Rendez-vous ce soir sur Discord. Votre voisin vous attend.</p>
        <p style="font-size: 14px; font-weight: bold; color: ${GOLD_TEXT}; margin-top: 40px;">Votre numéro de résident : #${residentId}</p>
        <div style="margin-top: 20px; border-top: 1px solid #1A1A1A; padding-top: 20px;">
          <p style="font-size: 12px; color: #555;">—<br/>THALAMUS, votre résidence</p>
        </div>
      </div>
    </div>
  `,

  /**
   * EMAIL 5 — Défi réussi
   */
  challengeSuccess: (firstName: string, condition: string, newPrice: string) => `
    <div style="${BASE_STYLE}">
      <div style="${CONTAINER_STYLE}">
        <h1 style="font-family: 'Cinzel', serif; color: ${GOLD_TEXT}; font-size: 24px; margin-bottom: 30px;">THALAMUS</h1>
        <p>Félicitations, ${firstName}.</p>
        <p>${condition}.</p>
        <p>Votre abonnement passe à <span style="color: ${GOLD_TEXT}; font-weight: bold;">${newPrice}€/mois</span>. Pour toujours.</p>
        <div style="background-color: #111; border: 1px solid #222; padding: 20px; margin: 30px 0; border-radius: 10px;">
          <p style="margin: 0; font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 2px;">Prochain défi :</p>
          <p style="font-size: 13px; margin-top: 10px; color: #F5F5F0;">0 alerte rouge ignorée → -15% supplémentaires</p>
          <p style="font-size: 11px; margin-top: 5px; color: #888;">Prix final possible : 47€/mois.</p>
        </div>
        <p>Le Temple récompense les constants.</p>
        <div style="margin-top: 40px; border-top: 1px solid #1A1A1A; padding-top: 20px;">
          <p style="font-size: 12px; color: #555;">—<br/>THALAMUS</p>
        </div>
      </div>
    </div>
  `
};
