Deezer = {};

// Request Deezer credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Deezer.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'deezer'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  var credentialToken = Random.secret();

  var permissions = (options && options.requestPermissions) || ['basic_access', 'email'];
  var flatPermissions = _.map(permissions, encodeURIComponent).join(',');

  var loginStyle = OAuth._loginStyle('deezer', config, options);

  var loginUrl =
    'https://connect.deezer.com/oauth/auth.php' +
    '?app_id=' + config.clientId +
    '&redirect_uri=' + OAuth._redirectUri('github', config) +
    '&perms=' + flatPermissions;

  OAuth.launchLogin({
    loginService: 'deezer',
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
};