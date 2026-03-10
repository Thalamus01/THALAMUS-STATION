/**
 * THALAMUS Mock Data
 * Used for offline/development mode to bypass API quotas.
 */

export const MOCK_TEMPLE_DATA = {
  residentsCount: 612,
  openDoorsCount: 12482,
  pricing: {
    monthly: 79,
    yearly: 790,
    yearlyDiscount: -17
  },
  formSteps: [
    {
      id: 'STEP1',
      question: "Pourquoi trades-tu ?",
      placeholder: "Écrivez ici...",
      minChars: 100,
      hint: "Réfléchis. Le Temple lit chaque mot."
    },
    {
      id: 'STEP2',
      question: "Ta plus grande faiblesse émotionnelle ?",
      placeholder: "Écrivez ici...",
      minChars: 0,
      hint: "Sois honnête. C'est ta première protection."
    },
    {
      id: 'STEP3',
      question: "Que signifie 'discipline' pour toi ?",
      placeholder: "Écrivez ici...",
      minChars: 0,
      hint: "Le serment final avant l'étude."
    }
  ]
};

export const MOCK_USER_STATS = {
  disciplineScore: 78,
  conformityRate: 73,
  currentPrice: 67.15,
  activeDiscount: 15
};
