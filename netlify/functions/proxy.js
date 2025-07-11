const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  // ▼▼▼ MODIFIEZ CETTE LIGNE ▼▼▼
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzh4VC8-wv-WEdkZsQh0C5HyGAHryf2gX0_nssDU2oWrDp-KwlGD0UTe1rv6vjL9mzf/exec'; 
  // ▲▲▲ MODIFIEZ CETTE LIGNE ▲▲▲

  // Ne pas toucher au reste
  fetch(GOOGLE_SCRIPT_URL + '?token=jdsbqurhv23dka', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: event.body,
  }).catch(err => console.error(err)); 

  return {
    statusCode: 200,
    body: 'OK',
  };
};
