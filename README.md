## Local Developments

### Env Vars

```
SITE_URL=http://localhost:3000
```

## Authentication

- Users allowed to access the app are stored in the Auth table

### Env Vars

```
CLIENT_ID=webappname
GOOGLE_CLIENT_ID=xxxxx-xxxxx.apps.googleusercontent.com # found in google cloud console > api & services > credentials
```

### Email Code Auth

### Google SSO

1. search for 'OAuth consent screen' in google cloud console
2. Default minimal settings, make external and add your test emails until you are ready to publish
3. Go to Credentials > Create Credentials > OAuth Client ID
4. Set 'Authorized JavaScript origins' to your site url i.e. http://localhost:3000 and cloudfront
5. Set your 'Authorized redirect URIs' to {auth function url}/google/callback
6. Set your GOOGLE_CLIENT_ID env var

### Notes

- The AUTH_PUBLIC_KEY to verify the JWT is created by sst.auth and stored in a secret in S3. It can also be accessed in the sst.config via auth.key.publicKeyPem
