Package.describe({
  name: 'pyrax:meteor-deezer-oauth',
  version: '1.0.0',
  summary: 'Deezer OAuth flow',
  git: 'https://github.com/pyrax/meteor-deezer-oauth.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use('ecmascript');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', ['server']);
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.addFiles('deezer_client.js', 'client');
  api.addFiles('deezer_server.js', 'server');

  api.export('Deezer');
});