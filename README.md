# フロントエンド入門ワークショップ React 編

## 前準備

### 環境

本ワークショップは WSL2 または macOS 環境を前提とします

### Node.js のインストール

直接インストールしてもよいですが、これを機に [mise](https://mise.jdx.dev/getting-started.html) のようなバージョンマネージャーを導入することをお勧めします。

Node.js 最新 LTS の 20.x 系が使えることを確認してください。

```shell
$ node -v
v20.11.1
```

パッケージマネージャーは pnpm を利用します。
(様々なプロジェクトで pnpm を利用しているため)

```shell
$ corepack enable pnpm
```


## プロジェクトの作成

```shell
$ pnpm create vite frontend-workshop-react --template react-ts
../Library/pnpm/store/v3/tmp/dlx-13453   |   +1 +
../Library/pnpm/store/v3/tmp/dlx-13453   | Progress: resolved 1, reused 1, downloaded 0, added 1, done

Scaffolding project in /Users/ondat/workspace/frontend-workshop-react...

Done. Now run:

  cd frontend-workshop-react
  pnpm install
  pnpm run dev

$ cd frontend-workshop-react

$ pnpm install
Downloading registry.npmjs.org/typescript/5.4.3: 5.82 MB/5.82 MB, done
Packages: +211
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 245, reused 175, downloaded 36, added 211, done
node_modules/.pnpm/esbuild@0.20.2/node_modules/esbuild: Running postinstall script, done in 231ms

dependencies:
+ react 18.2.0
+ react-dom 18.2.0

devDependencies:
+ @types/react 18.2.69
+ @types/react-dom 18.2.22
+ @typescript-eslint/eslint-plugin 7.3.1
+ @typescript-eslint/parser 7.3.1
+ @vitejs/plugin-react 4.2.1
+ eslint 8.57.0
+ eslint-plugin-react-hooks 4.6.0
+ eslint-plugin-react-refresh 0.4.6
+ typescript 5.4.3
+ vite 5.2.6

Done in 18.6s
```

## 動作確認

```shell
$ pnpm dev

  VITE v5.2.6  ready in 113 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```  

ブラウザで `http://localhost:5173/` を開いて、以下の画面が表示されれば成功です。

![vite-react.png](img.png)


## デプロイ


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
