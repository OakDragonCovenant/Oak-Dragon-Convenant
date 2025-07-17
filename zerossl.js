// zerossl.js
// Utility for interacting with ZeroSSL API to create SSL certificates
// Usage: Set ZERO_SSL_KEY in your environment variables

const axios = require('axios');

const ZERO_SSL_API_URL = 'https://api.zerossl.com/certificates';

/**
 * Create a new SSL certificate via ZeroSSL API
 * @param {string} domains - Comma-separated list of domains (first must match CSR CN)
 * @param {string} csr - PEM-encoded CSR string
 * @param {number} validityDays - Validity in days (90 or 365)
 * @param {number} [strictDomains=1] - 1 to limit SANs to provided domains
 * @returns {Promise<object>} API response
 */
async function createZeroSSLCertificate(domains, csr, validityDays, strictDomains = 1) {
  const params = { access_key: process.env.ZERO_SSL_KEY };
  const data = {
    certificate_domains: domains,
    certificate_csr: csr,
    certificate_validity_days: validityDays,
    strict_domains: strictDomains
  };
  try {
    const response = await axios.post(ZERO_SSL_API_URL, data, { params });
    return response.data;
  } catch (err) {
    if (err.response) {
      throw new Error(`ZeroSSL API error: ${JSON.stringify(err.response.data)}`);
    }
    throw err;
  }
}

// Example usage (uncomment and fill in your values to use):
// (async () => {
//   try {
//     const result = await createZeroSSLCertificate(
//       'example.com,www.example.com',
//       '-----BEGIN CERTIFICATE REQUEST-----\n...CSR DATA...\n-----END CERTIFICATE REQUEST-----',
//       90
//     );
//     console.log('Certificate created:', result);
//   } catch (e) {
//     console.error(e.message);
//   }
// })();

/**
 * Get certificate status/details by ID
 * @param {string} certId - Certificate ID
 * @returns {Promise<object>} API response
 */
async function getZeroSSLCertificate(certId) {
  const params = { access_key: process.env.ZERO_SSL_KEY };
  try {
    const response = await axios.get(`${ZERO_SSL_API_URL}/${certId}`, { params });
    return response.data;
  } catch (err) {
    if (err.response) {
      throw new Error(`ZeroSSL API error: ${JSON.stringify(err.response.data)}`);
    }
    throw err;
  }
}

/**
 * Trigger domain verification for a certificate (e.g., HTTP, CNAME, email)
 * @param {string} certId - Certificate ID
 * @param {string} validationMethod - 'EMAIL', 'CNAME_CSR_HASH', or 'HTTP_CSR_HASH'
 * @returns {Promise<object>} API response
 */
async function verifyZeroSSLCertificate(certId, validationMethod) {
  const params = { access_key: process.env.ZERO_SSL_KEY };
  const data = { validation_method: validationMethod };
  try {
    const response = await axios.post(`${ZERO_SSL_API_URL}/${certId}/challenges`, data, { params });
    return response.data;
  } catch (err) {
    if (err.response) {
      throw new Error(`ZeroSSL API error: ${JSON.stringify(err.response.data)}`);
    }
    throw err;
  }
}

/**
 * Renew a certificate by ID
 * @param {string} certId - Certificate ID
 * @returns {Promise<object>} API response
 */
async function renewZeroSSLCertificate(certId) {
  const params = { access_key: process.env.ZERO_SSL_KEY };
  try {
    const response = await axios.post(`${ZERO_SSL_API_URL}/${certId}/renew`, {}, { params });
    return response.data;
  } catch (err) {
    if (err.response) {
      throw new Error(`ZeroSSL API error: ${JSON.stringify(err.response.data)}`);
    }
    throw err;
  }
}

module.exports = {
  createZeroSSLCertificate,
  getZeroSSLCertificate,
  verifyZeroSSLCertificate,
  renewZeroSSLCertificate
};
