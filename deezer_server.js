Deezer = {};

Deezer.whitelistedFields = [];

OAuth.registerService('deezer', 2, null, function (query) {
  var response = getAccessToken(query);
  var identity = getIdentity(reponse.accessToken);

  var serviceData = {
    accessToken: OAuth.sealSecret(response.accessToken),
    // calculate expiration date by adding the seconds to expire to the timestamp (in milliseconds)
    expiresAt: (+new Date) + (1000 * response.expires)
  };

  var fields = _.pick(identity, Deezer.whitelistedFields);
  // Provide fields through profile and also through serviceData
  _.extend(serviceData, fields);

  return {
    serviceData: serviceData,
    options: {profile: fields}
  };
});

var getAccessToken = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'deezer'});
  if (!config) {
    throw new ServiceConfiguration.ConfigError();
  }

  var response;
  try {
    response = HTTP.post(
      'https://connect.deezer.com/oauth/access_token.php', {
        params: {
          code: query.code,
          app_id: config.clientId,
          secret: OAuth.openSecret(config.secret),
          output: 'json'
        }
      });
  } catch (err) {
    throw _.extend(new Error('Failed to complete OAuth handshake with Deezer. ' + err.message),
      {response: err.response});
  }

  if (response.data.error) {
    throw new Error('Failed to complete OAuth handshake with Deezer. ' + response.data.error);
  } else {
    return {
      accessToken: response.data.access_token,
      expires: response.data.expires
    };
  }
};

var getIdentity = function (accessToken) {
  try {
    return HTTP.get(
      'https://api.deezer.com/user/me', {
        params: {
          access_token: accessToken
        }
      }).data;
  } catch (err) {
    throw _.extend(new Error('Failed to fetch identity from Deezer. ' + err.message),
      {response: err.response});
  }
};

Deezer.retrieveCredential = function (credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};