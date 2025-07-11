const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  // L'URL de base de votre script Google Apps
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzh4VC8-wv-WEdkZsQh0C5HyGAHryf2gX0_nssDU2oWrDp-KwlGD0UTe1rv6vjL9mzf/exec'; // <-- VÉRIFIEZ BIEN CETTE URL

  // On ajoute le token à l'URL
  const initialUrl = new URL(GOOGLE_SCRIPT_URL);
  initialUrl.searchParams.append('token', 'jdsbqurhv23dka');

  // --- ÉTAPE 1 : Obtenir l'URL de redirection de Google ---
  // On fait un premier appel mais on dit à fetch de ne PAS suivre la redirection automatiquement.
  const redirectResponse = await fetch(initialUrl.toString(), {
    method: 'POST',
    redirect: 'manual', // Très important !
    body: event.body,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // On récupère la vraie URL de destination depuis l'en-tête "location".
  const finalUrl = redirectResponse.headers.get('location');

  // Si Google n'a pas redirigé (cas rare), on s'arrête là.
  if (!finalUrl) {
    console.error("Google n'a pas fourni d'URL de redirection. Réponse reçue :", await redirectResponse.text());
    // On renvoie quand même OK à LeadByte pour ne pas bloquer le flux.
    return { statusCode: 200, body: 'OK (but Google redirect failed)' };
  }

  // --- ÉTAPE 2 : Envoyer les données à l'URL finale ---
  // On fait le vrai appel POST à l'URL de redirection avec les données du lead.
  // On n'attend pas la réponse finale pour renvoyer OK à LeadByte.
  fetch(finalUrl, {
    method: 'POST',
    body: event.body,
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(err => {
    console.error("Erreur lors de l'appel à l'URL de redirection finale :", err);
  });

  // On renvoie immédiatement la réponse 200 à LeadByte.
  return {
    statusCode: 200,
    body: 'OK',
  };
};
