function lookupPostcode() {
  const input = document.getElementById('postcode');
  const result = document.getElementById('result');
  const postcode = input.value.trim().replace(/\s+/g, '').toUpperCase();

  if (!postcode) {
    result.textContent = 'Please enter a postcode.';
    return;
  }

  result.textContent = 'Looking up postcode...';

  // Step 1: Get LA code from postcodes.io
  fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(response => {
      if (!response.ok) throw new Error('Postcode not found');
      return response.json();
    })
    .then(data => {
      const laCode = data.result.codes.admin_district;
      const laName = data.result.admin_district;

      result.innerHTML = `<p><strong>Local Authority:</strong> ${laName}<br><strong>Code:</strong> ${laCode}</p>`;

      // Step 2: Send LA code to Power Automate flow
      return fetch("https://prod-61.uksouth.logic.azure.com:443/workflows/f05ee7283e294d6e8702853fe8ce2bba/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=YOUR_SIG_HERE", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: laCode })
      });
    })
    .then(response => {
      if (!response.ok) throw new Error('No LA match in list');
      return response.json();
    })
    .then(laData => {
      result.innerHTML += `
        <hr>
        <p><strong>DFG Email:</strong> <a href="mailto:${laData.Email}">${laData.Email || 'Not available'}</a><br>
        <strong>DFG Phone:</strong> ${laData.Phone || 'Not available'}<br>
        <strong>Referral Email:</strong> <a href="mailto:${laData.Referral}">${laData.Referral || 'Not available'}</a><br>
        <strong>Website:</strong> ${laData.Website ? `<a href="${laData.Website}" target="_blank">${laData.Website}</a>` : 'Not available'}<br>
        <strong>Social Housing Type:</strong> ${laData.SocialHousing || 'Not available'}<br>
        <strong>Adult Contact:</strong> ${laData.AdultContact || 'Not available'}<br>
        <strong>Adult Phone:</strong> ${laData.AdultPhone || 'Not available'}</p>
      `;
    })
    .catch(error => {
      result.innerHTML += `<p style="color: red;">Error: ${error.message}</p>`;
    });
}
