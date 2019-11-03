# xMatters Signal Generator

Signal xMatters when Crashlytics has detected issues with your mobile applications.

Crashlytics is a crash reporter for Firebase.

Note: This assumes that you have Crashlytics in Firebase. [Learn more about Crashlytics](https://firebase.google.com/docs/crashlytics/)


## Setting up the sample

 Create and setup the Firebase project:
  1. Create a Firebase project using the [Firebase Developer Console](https://console.firebase.google.com).
  1. Enable Billing on your Firebase the project by switching to the **Blaze** plan, this is currently needed to be able to perform HTTP requests to external services from a Cloud Function.
  1.Include [Crashlytics in your project](https://firebase.google.com/docs/crashlytics/get-started).

 Configuring the sample
  1. Clone or download this repo and open the `crashlytics-integration/xmatters-signal` directory.
  1. You must have the Firebase CLI installed. If you don't have it, install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
  1. Configure the CLI locally by using `firebase use --add` and select your project in the list.
  1. Install `npm` dependencies in the functions directory locally, by running: `cd functions; npm install;`

 Integrating with xMatters
  1. Configure the required environment variables for xMatters: `firebase functions:config:set xmatters.inbound_trigger_url="https://yourdomain.xmatters.com/api/integration/1/functions/XX/triggers" xmatters.api_key="username" xmatters.secret="password"`
  1. Import the Workflow (crashlytics.zip) into xMatters

## Deploy and test

 1. Deploy your project using `firebase deploy`
 1. Simulate a test crash. [Instructions](https://firebase.google.com/docs/crashlytics/force-a-crash)


## Contributing

We'd love that you contribute to the project. Before doing so please read our [Contributor guide](../CONTRIBUTING.md).


## License

© Google, 2017. Licensed under an [Apache-2](../LICENSE) license.
