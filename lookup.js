function lookupPostcode() {
  const input = document.getElementById('postcode');
  const result = document.getElementById('result');
  const postcode = input.value.trim().replace(/\s+/g, '').toUpperCase();

  if (!postcode) {
    result.textContent = 'Please enter a postcode.';
    return;
  }

  result.textContent = 'Looking up postcode...';

  fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(response => {
      if (!response.ok) throw new Error('Postcode not found');
      return response.json();
    })
    .then(data => {
      const laName = data.result.admin_district;
      const laCode = data.result.codes.admin_district;

      if (laName && laCode) {
        result.innerHTML = `
          <p><strong>Local Authority:</strong> ${laName}<br>
          <strong>Code:</strong> ${laCode}</p>
        `;
      } else {
        result.textContent = 'Local authority data not available for that postcode.';
      }
    })
    .catch(error => {
      result.textContent = 'Error: ' + error.message;
    });
}
