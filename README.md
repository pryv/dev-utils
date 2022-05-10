# dev-utils

Small shared utilities for development at Pryv


## Usage

### Installing

```
npm install --save-dev github:pryv/dev-utils
```

(This is for internal use and thus not published on NPM.)

### Commands

```
components-run <command> <parameters>
```

Runs the given command in the context of each or one of the components (a.k.a. packages or workspaces) found in `components/`.
- A specific component can be targeted by setting the `COMPONENT` environment variable (e.g.). If `COMPONENT` is not set, or set to `all`, all components are targeted.
- If the command is `mocha`, components with no `test/` folder will be skipped.
