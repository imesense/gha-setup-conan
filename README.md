# Setup Conan

[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Release](https://img.shields.io/github/v/release/imesense/gha-setup-conan?include_prereleases&label=Release)](https://github.com/imesense/gha-setup-conan/releases/tag/v0.1)
[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/imesense/gha-setup-conan)
[![Run action](https://github.com/imesense/gha-setup-conan/actions/workflows/run-action.yml/badge.svg)](https://github.com/imesense/gha-setup-conan/actions/workflows/run-action.yml)

Action for installing and configuring __Conan__ package manager to `PATH` of the runner

## Inputs

### `version`

- Requested version of Conan
- Default value `latest`

## Example usage

```yaml
uses: imesense/gha-setup-conan@v0.1
with:
  version: '2.5.0'
```

## License

Contents of this repository licensed under terms of the __MIT license__ unless otherwise specified. See [this](./LICENSE) file for details
