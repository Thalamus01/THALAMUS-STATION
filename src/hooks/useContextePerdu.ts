import { useState, useEffect, useCallback } from 'react';

const FALLBACK_FACTS = [
  "Les pieuvres ont trois cœurs.",
  "Un nuage pèse environ 500 tonnes.",
  "Les bananes sont des baies.",
  "Les escargots dorment 3 ans.",
  "Les hippocampes mâles portent les bébés.",
  "Le miel ne périme jamais.",
  "Les requins existent depuis avant les arbres.",
  "Votre cerveau consomme 20% de votre énergie.",
  "Il y a plus d'étoiles que de grains de sable sur Terre.",
  "Les tortues peuvent respirer par leur derrière.",
  "Une journée sur Vénus dure plus qu'une année.",
  "Les éléphants ne peuvent pas sauter.",
  "Le verre est un liquide qui coule très lentement.",
  "Les dauphins ont des noms pour s'appeler.",
  "Votre estomac se remet à zéro tous les 3 jours.",
  "Il y a des planètes en diamant dans l'espace.",
  "Les koalas ont des empreintes digitales.",
  "Les fourmis ne dorment jamais.",
  "Un jour sur Mercure dure 176 jours terrestres.",
  "Les flamants roses sont blancs à la naissance."
];

const CACHE_KEY = 'thalamus_fact_timestamp';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const useContextePerdu = () => {
  const [fact, setFact] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const getRandomFallback = () => {
    return FALLBACK_FACTS[Math.floor(Math.random() * FALLBACK_FACTS.length)];
  };

  const fetchFact = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=fr');
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setFact(data.text);
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        text: data.text,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to fetch fact, using fallback:', error);
      setFact(getRandomFallback());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { text, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setFact(text);
      } else {
        fetchFact();
      }
    } else {
      fetchFact();
    }

    const interval = setInterval(fetchFact, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [fetchFact]);

  return { fact, loading, refresh: fetchFact };
};
