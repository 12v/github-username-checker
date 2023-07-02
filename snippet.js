[].forEach(async (candidate, i) => {

  await new Promise(resolve => setTimeout(() => resolve(), i * 1000));

  fetch("https://github.com/account/rename_check?suggest_usernames=true", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-GB,en;q=0.6",
      "cache-control": "no-cache",
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryrs6aR5UVprDnBAiU",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Brave\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1"
    },
    "referrer": "https://github.com/settings/admin",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": `------WebKitFormBoundaryrs6aR5UVprDnBAiU\r\nContent-Disposition: form-data; name=\"authenticity_token\"\r\n\r\nZJbYXEwjTxZoJ4YIAnckvfdAi9BRxYtS6bg34gFcz7HYYjhQYe_QxVBMSECGnTJChLCX1jUtE1FQcEHQQX2Icw\r\n------WebKitFormBoundaryrs6aR5UVprDnBAiU\r\nContent-Disposition: form-data; name=\"value\"\r\n\r\n${candidate}\r\n------WebKitFormBoundaryrs6aR5UVprDnBAiU--\r\n`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then(response => {
    if (!response.ok) {
      console.log(candidate, response.status);
    } else {
      return response.text();
    }
  })
    .then(text => console.log(text))
})
