# My Healthy Community -- Frontend

The NextJS frontend for Delaware's Public Health Tracking Network (DPHTN). See the backend repo here: https://github.com/greenriver/delaware-ephtn

## Application stack

- Next.JS 12
- React 17
- Typescript 4.6
- Apollo Graphql client 3
- Material UI 5
- GraphQL codegen
- [Storybook 6](https://storybook.js.org/) (requires webpack dep)
- [Chromatic](https://www.chromatic.com/) (UI tests tied to Storybook components)
- npm (not using yarn)
- prettier / eslint

## First time setup:

_NOTE_: for performance reasons, /app is a docker volume, not a bind mount volume. Therefore synchronization between docker and the host FS must be done manually.

```bash
# for better ergonomics you might want to add this as alias:
# alias dcr='docker-compose run --rm'

# From your host, start the runner which will build the container.
# Note /app will be empty initially
dcr runner

# Then from within the newly built container populate /app from your host's FS
$ rsync --no-compress -S -a --progress /host_fs/ /app

# Now install dependencies
$ npm install

# Get a copy of .env.local with env variables for the API access from a team member or figure it out based on env.sample
```

## Developer workflow

### Potential workflow using VS Code (and remote development extension):

1. Run `docker compose up` to start a container for VS Code
2. Use [VS Code's remote development extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) to connect to the the `delaware-ephtn-frontend` container (the name may be different depending on your docker compose configuration - running [`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/) on your machine will give you info about all the running containers)
3. Linting and type checking occurs on every commit using [husky](https://www.npmjs.com/package/husky). To check manually, run can `npm run lint && npm run check-types` (or check errors/warnings in vscode)
4. Commit changes within the container using [VS Code's terminal](https://code.visualstudio.com/docs/terminal/basics) (may require configuring root/.gitconfig). Doing so will check-in the changes made on the container's file system.
   _Note_: If changes to files ignored by git occur (e.g. `docker-compose.override.yml`) you'll probably need to manually copy them to the host file system. In the container (VS Code terminal) run `cp /app/docker-compose.override.yml /host_fs`

### Potential workflow in other IDEs/editors:

1. Run `docker compose up`
2. Use `./bin/rsync-to-host.sh` to copy changes on the container back to the host (careful! this will destroy any changes you have on the host FS)

## Working with the GraphQL API

### Next and Rails connectivity/communication

Setting up the next app to communicate with a locally running Rails API requires tweaking the hosting of your next app.

- **Configuring host**:
  - If using vscode, copy `docker-compose.override.yml.vscode` to `docker-compose.override.yml` and refer to the instructions in the file to make required changes to the configuration (mainly `extra_hosts`). You may also want to allow storybook to be available on port `6006` by uncommenting storybook service's `ports`.
  - If using another IDE/editor, use `docker-compose.override.yml.sample` as the source of your `docker-compose.override.yml`. You may also need to update your rails app's `.env.local` to contain `NEXT_APP_URL=https://dephtn-next.dev.test` which points the rails app to the next app.
  - Add `dephtn-next.dev.test` to `/etc/hosts`. Depends on your file but could looks this:
    ```
    127.0.0.1 dephtn.dev.test dephtn-next.dev.test
    ```
- **Certificate**:
  - Refer to nginx repo README on how to add a Certificate for the `dephtn-next.dev.test`
  - Add an environment variable (to `.env.local`) which tells Node to allow traffic from unsigned certificates:
    ```
      NODE_TLS_REJECT_UNAUTHORIZED=0
    ```
- You'll probably need to restart all the docker containers
- At this point you should be able to access the app at https://dephtn-next.dev.test
- Tell the next app to hit your local rails API by changing the following env vars in `.env.local`:
  ```
  GRAPHQL_API=https://dephtn.dev.test/api/graphql
  GRAPHQL_API_AUTH_KEY=123secret # What is declared in the rails app — the value of `GRAPHQL_API_AUTH_TOKEN` in the rails app's `.env.local`
  ```
- Restart the next app's dev service and ensure your rails server is running
- Now the next app should be pulling data from your locally running rails app. If not, and you are seeing authentication errors, you may need to setup a graphql user in your rails app — see the _Endpoints and authorization_ section

### Endpoints and authorization

`GRAPHQL_API` within `.env.local` controls the API endpoint (see `.env.example`). If you have a Rails server running locally, setting `GRAPHQL_API` to `https://dephtn.dev.test/api/graphql` (the host may differ depending on your docker-compose config) will setup the next app and codegen to communicate with the locally running Rails app's API. (It's important to check that you have a graphql user locally in the Rails app User table — there's a migration for this but could be added manually). You'll also need to set `GRAPHQL_API_AUTH_KEY` in `.env.local` to match `GRAPHQL_API_AUTH_TOKEN` in the rails app.
If you want to pull data from `demo`, the host would be `https://demo-myhealthycommunity.dhss.delaware.gov`.

### Recommended GraphQl Client: [Altair](https://altairgraphql.dev/)

Some devs have trouble connecting the [GraphQL Playground client](https://github.com/graphql/graphql-playground) to their locally running Rails app API. Altair works similarly and offers several helpful features like [_One-click Query Generation_](https://altairgraphql.dev/docs/features/add-queries-and-fragments.html), [autofill](https://altairgraphql.dev/docs/features/autofill-fields-at-cursor.html), [collections](https://altairgraphql.dev/docs/features/collections.html), [environments](https://sirmuel.design/altair-becomes-environment-friendly-%EF%B8%8F-f9b4e9ef887c), [import/export queries](https://altairgraphql.dev/docs/features/import-export-queries.html), [reviewing schema docs](https://altairgraphql.dev/docs/features/documentation.html), [browser extension](https://altairgraphql.dev/docs/features/multiple-platforms.html), [etc](https://altairgraphql.dev/docs/).

### Other notable points:

- Rails GraphQL API documentation can be found [here](https://github.com/greenriver/delaware-ephtn/blob/production/app/graphql/README.md).
- Graphql codegen introspects on the graphql schema to build properly typed methods/fragments that correspond to graphql queries. See `codegen.yml` and `src/graphqlApi/types.ts`
- Graphql queries and fragments should be kept in `.graphql` files to be discoverable by codegen and to get better formatting in VS Code (using the graphql extension)
- If you modify graphql statements or fragments OR the remote graphql schema changes then you should run codegen with `npm run codegen` - this command will regenerate `src/graphqlApi/types.ts` but may fail if there are problems in your graphql or issues with the remote API

## Deployment:

Pushing changes to main should trigger a production deployment via Vercel.
Pushing other branches will also build and deploy a "preview" instance. If you
wish to skip deployment, include "[skip-ci]" in your commit message.

Though all branches pushed will result in a build on Vercel, the staging and
demo branches are wired in to be used by the same respective deployed backend
environments (e.g. https://demo-myhealthycommunity.dhss.delaware.gov).

You can test compilation with `npm run build` locally (note that building may cause some issues if you are also running the dev server at the same time)

## Storybook

Start storybook on localhost:6006 (double check your docker-compose config to ensure this `6006` is declared as the port)

```bash
docker-compose up storybook
```

Storybook is built automatically on via GH actions on push to main and deployed to GH Pages at https://greenriver.github.io/delaware-ephtn-frontend

### Example/Fixture data for stories

Example/Fixture data is typically available in files/directories called `fixtures` or `fixtureData` or in `src/__test__/fixtures`. When adding new example/fixture data, please add it to `src/__test__/fixtures`. When making changes to existing fixtures outside of the `__test__` directory, please try to relocate it.

## Testing

### Frameworks/Tools

- [Jest](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Storybook Jest Addon](https://storybook.js.org/addons/@storybook/addon-jest)
- [Chromatic Visual Tests](https://www.chromatic.com/)

### When should tests be written?

- If a component as user interactions that change state or an obvious user interaction flow, this is a good candidate for interaction tests written within a Storybook component.
- If the component uses special logic, modifies data from the API in some way, or just requires non-interactive tests (e.g. confirm the existence of an element based on data) this is a good candidate for a jest test that runs outside of the Storybook context.
- Chromatic catches regressions based on visual diffs so most changes to rendered UI will get caught and flagged. This should be considered when determining if it makes sense to write a test for a component.

### Interaction Tests (_within_ Storybook components)

[Interaction tests](https://storybook.js.org/docs/react/writing-tests/interaction-testing) can be written in Storybook components (using [Testing Library](https://testing-library.com/docs/) and a little [Jest](https://jestjs.io/docs/getting-started).

[Here's an example from the docs to test a login form](https://storybook.js.org/docs/react/writing-tests/interaction-testing#snippet-login-form-with-play-function).

These tests should honor the following rules:

- File containing interaction tests should be named `ComponentNameInteractions.stories.tsx` and should not contain UI presentation — keep that in a separate file (e.g. different renderings of components based on different prop values).
- The `title` property of the storybook component's `Meta` object should be something like this `Components/Common/Charts/InvestigateChart/Interactions` so that it is separated from normal UI presentation.
  ```javascript
  // Example meta declaration
  const meta: Meta<typeof InvestigateChart> = {
    title: "Components/Common/Charts/InvestigateChart/Interactions",
    component: InvestigateChart,
    ...
  };
  ```
- File should be kept in the same directory as component.
- Group tests with a `step` function and provide a descriptive string for step name.
  ```javascript
    // Example play property declaration with steps
    // `step` function is available in the context arg
    {
      ...
      play: async ({ args, canvasElement, step }) => {
        await step("Description of step", async () => {...})
        await step("Description of another step", async () => {...})
      })
      ...
    }
  ```
- Keep logic and non-interaction tests in the vanilla jest tests (see below).

#### Running Interaction tests

Interaction tests run within the context of a component's story. To see a visual summary, navigate to the component in your locally running storybook (http://dephtn-storybook.dev.test or http://localhost:6006) then click "Interaction Tests" within the addons panel. You can replay or step through the tests using the controls in the addon pane.

Storybook component tests can also be run using [Test Runner](https://storybook.js.org/docs/react/writing-tests/test-runner).
There's a docker service that runs the tests, but depending on your network settings, the runner may not be able to access the Storybook instance.
If you struggle to run the tests using the docker service, test runner can be run on your machine with `npm run storybook-test`. You may need to install Playwright with `npx playwright install`. The npm script runs with the `--watch` flag. If you want to execute a one-off test of all components run `test-storybook --url http://dephtn-storybook.dev.test` (assuming the storybook docker service is running and available at the `http://dephtn-storybook.dev.test`).

### Jest Testing (_outside_ of Storybook components)

Sometimes we may want to test a component outside of Storybook — if there are no interactions, API data is changed within the component level, or there is special logic.
These tests can be added anywhere in the project with filename like: `ComponentName.test.tsx`. (add the file in the same directory as the component)
These tests should follow jest testing patterns and honor the following rules:

- Group tests with a `describe` - use the component name if it's a component test
- `test` or `it` names should be brief yet descriptive
- Keep integration-type or interaction tests in Storybook components

#### Example file structure with jest and interaction tests:

```
├── InvestigateChart.stories.tsx
├── InvestigateChart.test.tsx
└── InvestigateChartInteractions.stories.tsx
```

| Filename                                   | Description                                                                                         |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `InvestigateChart.stories.tsx`             | Storybook component containing variants for UI testing and general review                           |
| `InvestigateChart.test.tsx`                | File containing jest tests                                                                          |
| `InvestigateChartInteractions.stories.tsx` | Storybook component containing only interaction tests. Component name appended with _Interactions_. |

#### Running Jest tests

**Jest tests are run in the `Preflight` GH action**

```
npm run tests
```

Or if you'd like to watch files, run:

```
npm run tests -- --watch
```

### Fixture Data

Fixture data should be declared in `src/__test__/fixtures/` and the filenames should map to the object's type e.g. `MhcLocation` if possible.

### Common utility functions

Utility functions are located `src/__test__/utils/`.

## Deployment:

Pushing changes to main should trigger a production deployment via Vercel.
Pushing other branches will also build and deploy a "preview" instance. If you
wish to skip deployment, include "[skip-ci]" in your commit message.

Though all branches pushed will result in a build on Vercel, the staging and
demo branches are wired in to be used by the same respective deployed backend
environments (e.g. https://demo-myhealthycommunity.dhss.delaware.gov).

You can test compilation with `npm run build` locally (note that building may cause some issues if you are also running the dev server at the same time)

## Chromatic

### Notes and Workflow

Chromatic is the external service used for validating the development of design components. This tool adds a UI component check on every pull request, which is linked to a storybook of the source branch with all the modified components.

Chromatic will handle the validation of components to detect any new components or modifications to existing components. This means that every time a new branch is pushed, the `.github/workflows/chromatic.yml` action is executed. Looking for modifications to the existing storybook components and detecting if any new components were added to the storybook. And finally creating a build on Chromatic, where other team members can review these changes, and approve or reject them.

The reviews made directly on the Chromatic interface will be reflected as a check on the pull request where the branch is used as the source. This means that the QA done on the new or modified components is reflected as a passed or failed check on the GitHub pull request interface.

As a standard practice, if a pull request has failed checks it won't be merged, which means a new corrected version of the pull request Storybook components must be pushed, a new QA must be run on the updated components, and if accepted, the PR can be merged.

### Chromatic Integration

As mentioned before, Chromatic uses a GitHub action to keep the builds updated, notify about changes, and create a storybook for each new branch. The code for this GitHub action can be found here: [.github/workflows/chromatic.yml](.github/workflows/chromatic.yml). The documentation on how this GitHub action works can be found directly on [Chromatic](https://www.chromatic.com/docs/github-actions)

### Accessing Chromatic

By being part of this repository you should be able to enter the Chromatic app, which you can access [here](https://www.chromatic.com/start). ** Just remember to sign up using your GitHub account. **

### Navigating Chromatic

Chromatic navigation is really straight forward. After logging in, you'll be able to visualize all the builds in order, with the newest appearing on top. From there you'll be able to see the number of each build and which branch it belongs to, as well as the state of that build. This state is depicted by the color of the build:

- Yello: Under review
- Green: Accepted
- Red: Denied

You can read more about how to navigate the interface, and more details on the documentation on the official [Chromatic site](https://www.chromatic.com/docs/).

### Webpack Bundle Analyzer

A new service was added in order to allow bundle analysis, the service is called `wba`. And in order to be able to run it, you need to make sure you have all of the node modules installed on the `runner` container. With this you just need to run `docker-compose up wba` and this will create a new build, and afterwards create a static-page hosting in port `8888`. Which then can be accessed by your browser with `http://localhost:8888/client.html`. This contains a static page for you to analyze the client bundle.

It's important to increase Dockers resources since the webpack analyzer can
crash during the build because of lack of it.

## Google Analytics

See [Google Analytics event tracking documentation](src/app/util/googleAnalytics/readme.md)
