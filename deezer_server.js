Deezer = {};

Deezer.whitelistedFields = ['id', 'name', 'email', 'firstname', 'lastname'];

OAuth.registerService('deezer', 2, null, function (query) {
  var response = getAccessToken(query);
  var identity = getIdentity(response.accessToken);

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
          secret: OAuth.openSecret(config.secret)
        }
      });
  } catch (err) {
    throw _.extend(new Error('Failed to complete OAuth handshake with Deezer. ' + err.message),
      {response: err.response});
  }

  var decodedResponse = queryStringToJSON(response.content);

  if (decodedResponse.error) {
    throw new Error('Failed to complete OAuth handshake with Deezer. ' + decodedResponse.error);
  } else {
    return {
      accessToken: decodedResponse.access_token,
      expires: decodedResponse.expires
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

// Helper function which takes the content of a string formatted as HTTP query
// and encodes it to JSON.
// @param query {string} String of a query without the beginning '?'.
var queryStringToJSON = function (query) {
  var result = {};

  if (query) {
    query.split('&').map((item) => {
      var [k, v] = item.split('=');
      result[k] = v ? v : null;
    });
  }
  return result;
};

Deezer.retrieveCredential = function (credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};