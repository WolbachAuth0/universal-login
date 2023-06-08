
# Okta Customer Identity Cloud Universal Login Manager

This repository contains a collection of scripts which intended to manage customizations of the Auth0 Universal Login. 

## Installation

0. Ensure that you have [Node.js](https://nodejs.org/en/) installed on your system

1. Clone this repository

```bash
git clone https://github.com/WolbachAuth0/universal-login.git
cd se-corp-na-samples
```

2. Install dependencies with npm

```bash
npm install
```

3. In each tenant you wish to synchronize with source control, you must set up an M2M application for the management API of the tenant. Make sure that the M2M app has the following scopes

* read:branding
* read:prompts
* update:branding
* update:prompts
* delete:branding

Make a note of the CLIENT_ID and CLIENT_SECRET for this M2M application.

## Environment Variables

To run this project, you need to set up a seperate environment file (`.env`) for each tenant you want this project
to talk to. For each tenant, create a folder in the `./tenants` directory and give that folder the same name as your tenant.
Then, in the tenant folder create a new file called `.env`.

In the `.env` file, you should add the values shown below.
```txt
AUTH0_DOMAIN=<url-to-the-tenant-domain>
AUTH0_CLIENT_SECRET=<client-secret-of-management-api-m2m-app>
AUTH0_CLIENT_ID=<client-id-of-management-api-m2m-app>
```
The domain will be the domain associated to your tenant (e.g. \<your domain>.us.auth0.com). To get the client id and client secret, you need to go into tenant's dashboard and navigate to Applications -- > APIs --> Auth0 Managment API -- > Machine to Machine Applications. Then select the appropriate M2M application (See Step 3 of the Installation above). Copy the client ID and secret, ensure that the app is authorized (green switch) and make sure to select all of the required scopes.

## Usage

To READ, WRITE or RESET the customizations of the Universal Login for any tenant you have set up to this project, simply open a terminal, cd to this project and command

```bash
npm run start
```


NOTE: To create your own login screen, create a new folder in the `./tasks/themes` directory. Then create a `template.html` file and a `branding.json` file and add them to your new theme directory. For the html template, use the [liquid syntax](https://shopify.github.io/liquid/basics/introduction/). See the [documentation](https://auth0.com/docs/brand-and-customize/universal-login-page-templates). For example,

`template.html`
```html
<!DOCTYPE html>
<html>
  <head>
    {%- auth0:head -%}
  </head>
  <body class="_widget-auto-layout">
    {%- auth0:widget -%}
  </body>
</html>
```

## Acknowledgements
 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)
