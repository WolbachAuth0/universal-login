
# Auth0 - North America Corporate S.E. Sample Scripts



## Installation

1. Clone this repository

```bash
git clone https://github.com/auth0/se-corp-na-samples.git
cd se-corp-na-samples
```

2. Install dependencies with npm

```bash
npm install
```

3. In each tenant you wish to synchronize with source control,
follow the instructions for setting up the 
[Auth0 Deploy CLI](https://auth0.com/docs/deploy/deploy-cli-tool/install-and-configure-the-deploy-cli-tool).
## Environment Variables

To run this project, you will need to create the following 
environment file(s) - one for each environment you happen to 
be synchronizing.

```txt
.env.dev
.env.staging
.env.prod
```

In each .env file, you should add the values shown below.

```txt
AUTH0_DOMAIN=<url-to-the-tenant-domain>
AUTH0_CLIENT_SECRET=<auth0-deploy-cli-secret>
AUTH0_CLIENT_ID=<auth0-deploy-cli-client-id>
```
The domain will be the domain associated to your tenant (e.g. <your domain>.us.auth0.com). To get the client id and client secret, you need to go into tenant's dashboard and navigate to Applications -- > APIs --> Auth0 Managment API -- > Machine to Machine Applications. Then select the application associated to this repository (e.g. auth0-deploy-cli-extension). Copy the client ID and secret, ensure that the app is authorized (green switch) and make sure to select all of the required scopes.

## Instructions for Use

This repo permits you to import the settings you have configured
in the Auth0 Tenant into (.js/.yaml/.json) files which can
be stored in your source control.

### Update New Universal Login HTML

This command will use the management API to update the html template of the New Universal Login experience.
For these commands to work, the M2M application must have the following scopes

* read:branding
* update:branding
* delete:branding

To get the current settings and HTML template, call the "get" command
```bash
npm run get:universal-login
```

To update the HTML template, call the "set" command. Be sure to create a new .html file in the /tasks directory containing the desired HTML template. Use the [liquid syntax](https://shopify.github.io/liquid/basics/introduction/) in your template. See the [documentation](https://auth0.com/docs/brand-and-customize/universal-login-page-templates) to be sure you include the required Auth0 login widget.
```bash
npm run set:universal-login
```

To delet the existing html template for the new universal login, call the "reset" command.
```bash
npm run reset:universal-login
```

## Acknowledgements
 - [Auth0 Deploy CLI Documentation](https://auth0.com/docs/deploy/deploy-cli-tool/install-and-configure-the-deploy-cli-tool)
 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)

  