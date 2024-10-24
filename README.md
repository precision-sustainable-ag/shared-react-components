# PSA Shared Components Library

**Date Created:** 9/04/24

**Date Last Modified:** 10/17/2024

This repository contains a collection of reusable React components which is used across our DST projects. This library is developed using [Storybook](https://storybook.js.org/).

## Table of Contents:

- [Setup](#setup)
- [Development](#development)

### Setup

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

### Development

##### 1. Create New Component

To create a new component run the following code:

```
npm run create-new-component -- --name=componentName
```

You don't need to include the `PSA` prefix in the `componentName` here since it'll be automatically generated.

##### 2. Integrate Component to Current Project

To update a component to current project, first add this repo to `package.json` of the project:

```
"dependencies": {
  ...,
  "shared-react-components": "github:precision-sustainable-ag/shared-react-components#version",
}
```

If the repo is already imported in the project, run `npm install shared-react-component --force` to update the codes, then run `npm start -- --force` to rebuild the project.
