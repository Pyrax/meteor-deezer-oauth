# meteor-deezer-oauth
Deezer OAuth flow for Meteor applications

## Usage
##### As authentication for accounts:
You can use this package with [meteor-accounts-deezer](https://github.com/Pyrax/meteor-accounts-deezer)
to use Deezer OAuth as a login-method. Just follow the instructions of that URL.

##### For standalone usage:
- Add the package to your Meteor application: `meteor add pyrax:meteor-deezer-oauth`
- Configure your app in the Deezer developers backend - the redirect URL should be: _http&#58;//<example.app>/\_oauth/deezer_
- Configure the service:
```javascript
ServiceConfiguration.configurations.update(
  { 'service': 'deezer' },
  {
    $set: {
      'clientId': '<application_ID>',
      'secret': '<secret_key>',
    }
  },
  { upsert: true },
);
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.