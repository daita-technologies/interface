## DAITA platform front end
React-based user interface for the DAITA platform.

## Main Used Libraries
1. UI: https://mui.com/
2. State management: https://redux.js.org/
3. Redux side effect manager: https://redux-saga.js.org/
4. AWS Client: [@aws-sdk/client-s3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html)
5. HTTP Client: https://www.npmjs.com/package/axios
 
## Folder Structure

```
public/
  ...
src/
  components/
    [ComponentName]/
      .tsx
    index.ts
  config/
    .ts
  constants/
    .ts
  hooks/
    .ts
  reduxes/
    [reducerName]/
      action.ts
      constants.ts
      reducer.ts
      selector.ts
      type.ts
  routes/
    [PageName]/
      index.tsx
      type.ts
    index.ts
  sagas/
    .ts
  services/
    .ts
  styles/
    .ts
    .css
  utils/
    .ts
```
All files and directories should be **camelCase** to separate words.

**public/**
Contains static files such as index. html, javascript library files, images, and other assets, etc.

**src/components/**
Contains components share between pages.

**src/config/**
Contains configurations of the app.

**src/contants/**
Contains all constants of the app.

**src/hooks/**
Contains shared react hook.

**src/reduxes/**
Contains redux's reducer of each app feature. Folder name base on feature's name.

**src/routes/**
Contains pages of the app. Filename base on page's name.

**src/sagas/**
Contains saga files of corresponding redux reducer.

**src/services/**
Contains API endpoints.

**src/styles/**
Contains custom styles for general sections.

**src/utils/**
Contains functions shared between app.


## Run & Build

*****You will need a `.env` file to run successfully. Contact administrator to get more information.***

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!


## A Note on Releases

The repository should be setup in the future in such a way that changes to the branch `release-staging` and `release-production` will trigger a rebuild of the Staging and the Production application, respectively.

The merge flow for changes should be as follows:

```bash
<feature_branch> -> <develop> -> <main> -> <release-staging> -> <release-production>
```

![Git Merge Flow](./docs/img/git_merge_flow.svg)
