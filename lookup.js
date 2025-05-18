function lookupPostcode() {
  const input = document.getElementById('postcode');
  const result = document.getElementById('result');
  const postcode = input.value.trim().replace(/\s+/g, '').toUpperCase();

  result.textContent = 'Looking up postcode...';

  fetch(`https://findthatpostcode.uk/postcodes/${postcode}.json`)
    .then(response => {
      if (!response.ok) throw new Error('Postcode not found');
      return response.json();
    })
    .then(data => {
      const la = data.postcode.local_authority;
      if (la && la.name && la.code) {
        result.innerHTML = `<p>Local Authority: <strong>${la.name}</strong><br>Code: <strong>${la.code}</strong></p>`;
      } else {
        result.textContent = 'Local authority info not available for that postcode.';
      }
    })
    .catch(() => {
      result.textContent = 'Could not find a match for that postcode.';
    });
}
