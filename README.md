# フロントエンド入門ワークショップ React 編

v1 ブランチで作成した単純なアプリケーションを構造化していきます。

具体的には:

 - ロジックをコンポーネントから独立させる
 - 単体テストの導入
 - コンポーネントの分割

を行っていきます。

## ロジックをコンポーネントから独立させる

[Jotai](https://jotai.org/) という状態管理ライブラリを導入します。

Reactive Programming をベースにしたライブラリで、その概念の一端を知っていただくことが目的です。

また、React に依存していないため単体テストが行いやすいというメリットがあります。

### ライブラリの追加

ライブラリを追加します。

```bash
$ pnpm add jotai
```

ロジックを書きながら単体テストも行うので、テスト用フレームワークも導入します。

```bash
$ pnpm add -D vitest vite-tsconfig-paths
```

### 設定ファイルの準備

`vitest.config.ts` を作成します。

```typescript
/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        includeSource: ['src/**/*.ts', 'src/**/*.tsx'],
        globals: true,
    },
})
```

vitest の型を解決できるようにTypeScript の設定ファイル `tsconfig.json` の `compilerOptions` に `types` を追加します。

```json
{
  "compilerOptions": {
    "types": ["vitest/importMeta"]
  }
}
```

`package.json` の `scripts` からテストを起動できるようにしましょう。

```json
"scripts": {
    "test": "vitest run",
    "test:watch": "vitest watch",
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
} 
```


最後に `vite.config.ts` に以下の設定を追加します。

デプロイ用のビルド時に in-source test を削除する設定です。

```typescript
  define: {
    'import.meta.vitest': false,
  },
```

単体テストが正しく実行できるかどうかを確認します。

`src/test.ts` を作成します。

```typescript
function add(a: number, b: number): number {
  return a + b
}
const addOne = add.bind(null, 1)
// in-source test
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('add', () => {
    it('adds two numbers', () => {
      expect(add(1, 2)).toBe(3)
    })
  })
}
```

`pnpm test` でテストが実行されることを確認します。

```bash
$ pnpm test

> frontend-workshop-react@0.0.0 test /Users/ondat/workspace/frontend-workshop-react
> vitest run


 RUN  v1.4.0 /Users/ondat/workspace/frontend-workshop-react

 ✓ src/test.ts (1)
   ✓ add (1)
     ✓ adds two numbers

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  07:53:38
   Duration  135ms (transform 15ms, setup 0ms, collect 6ms, tests 1ms, environment 0ms, prepare 38ms)
```

開発時は `pnpm test:watch` でコード変更の度に自動でテストを走らせておくことをお勧めします。

```bash
$ pnpm test:watch
```

サンプルのテストファイルに追記してみましょう。

```typescript
function add(a: number, b: number): number {
  return a + b
}
const addOne = add.bind(null, 1)

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('add', () => {
    it('adds two numbers', () => {
      expect(add(1, 2)).toBe(3)
    })
  })
  describe('addOne', () => {
    it('adds one to a number', () => {
      expect(addOne(2)).toBe(3)
    })
  })
}
```

自動でテストが走り、結果が表示されることを確認します。


```plaintext
 RERUN  src/test.ts x1

 ✓ src/test.ts (2)
   ✓ add (1)
     ✓ adds two numbers
   ✓ addOne (1)
     ✓ adds one to a number

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  07:55:48
   Duration  5ms


 PASS  Waiting for file changes...
       press h to show help, press q to quit

```

### ロジックの分離

https://github.com/tak-onda/frontend-workshop-react/tree/v2 を参考にロジックを分離してみましょう

1. `state.ts` を作成します
2. `state.test.ts` に振舞いを確認するテストを追加
3. `hooks.ts` を作成
4. コンポーネントから利用

