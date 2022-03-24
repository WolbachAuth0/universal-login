
# Auth0 - North America Commercial CIAM Specialist Management API 

This repository contains a collection of scripts which access the Auth0 Management API to perform various tasks. The initial intent was to provide functionality which is not currently available via the Auth0 dashboard, but may require demonstration to customers. Examples include, bulk loading of users and customization of the new universal login experience.

## Installation

0. Ensure that you have [Node.js](https://nodejs.org/en/) installed on your system

1. Clone this repository

```bash
git clone https://github.com/auth0/se-corp-na-samples.git
cd se-corp-na-samples
```

2. Install dependencies with npm

```bash
npm install
```

3. In each tenant you wish to synchronize with source control, follow the instructions for setting up the 
[Auth0 Deploy CLI](https://auth0.com/docs/deploy/deploy-cli-tool/install-and-configure-the-deploy-cli-tool).

## Environment Variables

To run this project, you need to set up a seperate environment file (`.env`) for each tenant you want this project
to talk to. For each tenant, create a folder in the `./tenants` directory and give that folder the same name as your tenant.
Then, in the tenant folder create a new file called `.env`.

In the `.env` file, you should add the values shown below.
```txt
AUTH0_DOMAIN=<url-to-the-tenant-domain>
AUTH0_CLIENT_SECRET=<auth0-deploy-cli-secret>
AUTH0_CLIENT_ID=<auth0-deploy-cli-client-id>
```
The domain will be the domain associated to your tenant (e.g. \<your domain>.us.auth0.com). To get the client id and client secret, you need to go into tenant's dashboard and navigate to Applications -- > APIs --> Auth0 Managment API -- > Machine to Machine Applications. Then select the application associated to this repository (e.g. auth0-deploy-cli-extension). Copy the client ID and secret, ensure that the app is authorized (green switch) and make sure to select all of the required scopes.

## Usage

### New Universal Login

This command will use the management API to update the html template and the branding colors of the New Universal Login experience. For these commands to work, the M2M application which was setup above must have the following scopes

* read:branding
* update:branding
* delete:branding

##### Read Branding
Get the current settings and the new universal login template.
```bash
npm run get:universal-login
```

##### Update Branding
Updates the HTML template for the new universal login.

```bash
npm run set:universal-login
```

NOTE: Before you run this command, you can create 


##### Delete Branding
Delete the existing html template for the new universal login.
```bash
npm run reset:universal-login
```
<!-- 
### Users

These are the scripts that search for, update and add users to Auth0. In order to run them, your M2M application must have the following scopes;

* read:users
* read:user_idp_tokens
* create:users

##### Find User(s) by Email
Get an array of users in the Auth0 tenant which are associated to the email address passed into the command.
```bash
npm run find:users email="aaron.wolbach@gmail.com"
```

##### Find User by ID
Get the user the Auth0 tenant which is associated to the user_id passed into the command.
```bash
npm run find:users id="auth0|YWFyb24ud29sYmFjaEBnbWFpbC5jb200d29sYmFjaC0zNDY4"
``` -->

## Acknowledgements
 - [Auth0 Deploy CLI Documentation](https://auth0.com/docs/deploy/deploy-cli-tool/install-and-configure-the-deploy-cli-tool)
 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)
