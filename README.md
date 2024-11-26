# PSA Shared Components Library

**Date Created:** 9/04/24

**Date Last Modified:** 11/22/2024

This repository contains a collection of reusable React components which is used across our DST projects. This library is developed using [Storybook](https://storybook.js.org/).

## Table of Contents:

- [PSA Shared Components Library](#psa-shared-components-library)
  - [Table of Contents:](#table-of-contents)
  - [Setup](#setup)
  - [Development](#development)
    - [Create New Shared Component](#create-new-shared-component)
    - [Integrate Component to Current Project](#integrate-component-to-current-project)
  - [Common Issues](#common-issues)
    - [Not getting updated components](#not-getting-updated-components)
    - [Cannot get color properties](#cannot-get-color-properties)
    - [Not getting correct font](#not-getting-correct-font)
    - [Problem while import the repo to a project which is not using Vite](#problem-while-import-the-repo-to-a-project-which-is-not-using-vite)

## Setup

1. Clone the Repository

   First, clone the repository to your local machine:

   ```
   git clone https://github.com/precision-sustainable-ag/shared-react-components.git
   cd shared-react-components
   ```

2. Install Dependencies

   Navigate to the project directory and install the required dependencies using `npm install` or, if you're using yarn, `yarn install`

3. Start Storybook

   To begin developing and previewing your components, start the Storybook development server with `npm run storybook` or `yarn storybook`.

   This will open Storybook in your default browser at http://localhost:3000, where you can explore and interact with all the components in the library.

## Development

### Create New Shared Component

1. **Create a new component**

   To create a new component run the following code:

   ```
   npm run create-new-component -- --name=componentName
   ```

   All the components we're creating here follows a naming convention with a prefix of `PSA`. But you don't need to include the `PSA` prefix in the `componentName` here since it'll be automatically generated.

   This command will generate a folder of `componentName` under `src`, and 4 related files which you can develop.

2. **Develop on the component**

   Currently most of our components are based on MUI components, to create a new component, first check the projects that this component will be used in for usage.

   - If the component is being used same as the MUI component, simply create a wrapper with `...props` to pass all props and keep the usage same as the MUI component.

     ```
     const CustomButton = ({ children, ...props }) => {
     return <Button {...props}>{children}</Button>;
     };
     ```

   - If the component contains only custom stylings and have the same functionality of the MUI component, use [styled()](https://mui.com/system/styled/) to create custom stylings.

     ```
     const CustomButton = styled(Button)(({ theme }) => ({
      // custom styles
     }));
     ```

   - If the component is a combination of several other components, try to define clear and precise props for the parent component while allowing flexibility to customize the child components.

3. **Write stories for the component**

   [Storybook](https://storybook.js.org/docs) is a powerful tool for building and showcasing UI components, it provides a dedicated environment to develop, document, and visually test components, making it an ideal choice for shared component libraries.

   - To create a story for the component, firstly navigate to `component.stories.jsx` and follow the template format, take reference to other component's stories for guidance if needed.

   - After the stories are created, verify them in storybook to ensure it displays correctly and no errors or warnings appear in the console.

   - Switch back to `component.jsx` and define `propTypes` for each prop of the component.

   - Add a brief description for every prop of the component in [JSDoc](https://jsdoc.app/) format.

     ```
     /**
     * The title of the header.
     */
     title: PropTypes.string,
     ```

     After the `propTypes` are specified and documented, the component's story would be automatically generated with descriptions in storybook.

4. **Add component to `src/index.js`**

   After all development are done, add the component to `src/index.js` following the format of previous components.

### Integrate Component to Current Project

1. **Update changes to the project**

   To integrate a component to current project, first add this repo to `package.json` of the project:

   ```
   "dependencies": {
   ...,
   "shared-react-components": "github:precision-sustainable-ag/shared-react-components#version",
   ...,
   }
   ```

   If current work is on a specific branch and it's not been merged to `develop`, replace `#version` with `#branchName` ( e.g. `#feature/header` ). If all works have been merged to `develop`, remove the `#version`.

   If the repo is already imported in the project, run

   ```
   npm install shared-react-component --force
   ```

   to update the codes.

   To make sure all the changes have been updated, check `node_modules/shared-react-component/src` has all the updates of the component, if the updates are not shown, see [Common Issues](#common-issues).

2. **Replace previous component with shared component**

   After getting all updates, replace the previous component with shared component.

   To import the shared component, use

   ```
   import { componentName } from 'shared-react-components/src';
   ```

   Then replace the previous component, make sure all props are aligned and all functions should work as well. Please take care of the `data-test` tags and make sure that they are also applied to the shared component to maintain consistent testing functionality.

## Common Issues

#### Not getting updated components

If you're having problems getting the updated component, try find the updated component under `node_modules/shared-react-component/src`, if the updates are not listed, it means that the updates are not correctly downloaded. First check if the branch name in `package.json` is correct, then run

```
npm install shared-react-component --force
```

If this is not solving the problem, delete `node_modules` and run `npm install` again.

#### Cannot get color properties

If you are having problems like this ( or getting other colors ) :

```
figmaButton.jsx:31 Uncaught TypeError: Cannot read properties of undefined (reading 'greydark')
   at customStyles (figmaButton.jsx:31:1)

```

This is because some of the components are using a shared theme which is defined in `src/theme`, in order to solve this, you'll need to integrate the theme to your project.

If your project currently is not using a MUI theme from `<ThemeProvider>`, you'll need to create a `<ThemeProvider>` and pass the theme from `src/theme`. [Check for MUI documents about how to define the `<ThemeProvider>`](https://mui.com/material-ui/customization/theming/#themeprovider).

If your project already have a existed theme, you can utilize [MUI `deepmerge` function](https://mui.com/material-ui/customization/theming/#createtheme-options-args-theme) to merge the shared theme with you current theme.

```
import { deepmerge } from '@mui/utils';
import { createTheme } from '@mui/material/styles';
import { PSATheme } from 'shared-react-components/src';

const theme = createTheme(deepmerge(PSATheme, yourTheme));
```

Currently the components using the theme are: `FigmaButton`, `Header` and `TextField`.

#### Not getting correct font

Currently most of our shared components are using [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) font, if you have not getting the correct font in your app, add this line to your `App.js` :

```
import '@fontsource/ibm-plex-sans';
```

#### Problem while import the repo to a project which is not using Vite

If you are having this error when trying to import the repo into a project which is not using Vite:

```
ERROR in ./node_modules/shared-react-components/src/Accordion/accordion.jsx 32:4
Module parse failed: Unexpected token (32:4)
File was processed with these loaders:
 * ./node_modules/react-scripts/node_modules/source-map-loader/dist/cjs.js
You may need an additional loader to handle the result of these loaders.
| }) => {
|   return (
>     <Accordion
|       expanded={expanded}
|       onChange={onChange}
```

Please refer to [this article](https://medium.com/@duvvurukishore/how-i-resolved-you-may-need-additional-loader-to-handle-the-result-of-these-loaders-error-919a2e0356a0) to solve the problem.
