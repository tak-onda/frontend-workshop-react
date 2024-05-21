# フロントエンド入門ワークショップ React 応用編

## 持ち帰って欲しいこと

フロントエンド開発でも、プログラミングという観点では特別なことはなく、設計やテストの基本原則は共通していることを体感として知ってもらいたいです。

- ロジックとコンポーネントを分離する
  - フロントエンドのチュートリアルに従って作るとコンポーネントに全部書いてしまいがち
  - バックエンドで言うファットコントローラーのような状態になる
  - フロントエンドではまだクリーンアーキテクチャのようなレイヤリングが浸透していないが、バックエンド同様にロジックとコンポーネントを分離することで保守性の高いコードが書ける
- ロジック部分を中心に単体テストを書く
- Reactive Programming の考え方を知る
  - TC39 という JavaScript の標準化委員会で [Signal](https://github.com/tc39/proposal-signals) が提案されている



## 概要

v1 ブランチで作成した単純なアプリケーションを構造化していきます。

具体的には:

 - 単体テストの導入
 - ロジックをコンポーネントから独立させる

を行っていきます。

## 単体テストの導入

[vitest](https://vitest.dev/) という単体テストフレームワークを導入します。

### ライブラリの追加

テスト用フレームワークを導入します。

```bash
$ pnpm add -D vitest vite-tsconfig-paths
```

> [!NOTE]
> Node.js における依存ライブラリは、実行時依存 (dependencies) と開発時依存 (devDependencies) を分けて管理します。
> `-D` オプションは開発時依存に追加するためのオプションです。

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
function addN(a: number): number {
  return function(b: number) {
    return add(a, b)
  }
}
const addOne = addN(1)
// const addOne = add.bind(null, 1)

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

## ロジックの分離

### フロントエンドにおける状態

リクエスト・レスポンスモデルで完結するバックエンドと違い、フロントエンドではグローバルな状態を管理します。

ブラウザのタブは単一のセッションに対応し、状態の寿命はタブが閉じられるまでです(SPA 遷移の場合)。

バックエンドと異なり複数のユーザーの情報を並行して管理することはありませんが、寿命の長いデータを管理する必要があります。
複雑なアプリケーションでは、データのスコープやライフサイクルをどう管理するかが設計のポイントになります。

### Jotai の導入

[Jotai](https://jotai.org/) という状態管理ライブラリを導入します。

Reactive Programming というプログラミングパラダイムを実現したライブラリで、その概念の一端を知っていただくことが目的です。

Jotai は React に依存していないため単体テストが行いやすいというメリットがあります。


### Reactive Programming とは？

ものすごく雑に説明すると[スプレッドシート](https://docs.google.com/spreadsheets/d/1HygprZZLdjU-apyTpWDOcXlMRV1BewYJQCr_bdtvl_c/edit?hl=ja#gid=0)の計算モデルです。

Jotai では値を直接入力するセルに相当する値を primitive atom, 計算式に相当するセルを derived atom と呼びます。


### ライブラリの追加

ライブラリを追加します。

```bash
$ pnpm add jotai
```

### primitive atom の作成

`src/atom.ts` の作成

```ts
import { atom } from 'jotai'

const a = atom(0)
const b = atom('hello')
```

テストコードの追加

```ts
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('atom', () => {
    it('has initial value', () => {
      const store = createStore()
      expect(store.get(a)).toBe(0)
      expect(store.get(b)).toBe('hello')
    })

    it('value change: a', () => {
      const store = createStore()
      expect(store.get(a)).toBe(0)
      store.set(a, 1)
      expect(store.get(a)).toBe(1)
    })

    it('value change: b', () => {
      const store = createStore()
      expect(store.get(b)).toBe('hello')
      store.set(b, (current) => current + ' world')
      expect(store.get(b)).toBe('hello world')
    })
  })
}
```

> [!NOTE]
> Jotai では atom は雛形で、実際の値は store の中に保持されます。
> (React だと Context で store を管理します)
> 
> ```ts
> describe('jotai store', () => {
>   it('dependant', () => {
>     const store1 = createStore()
>     const store2 = createStore()
>     expect(store1.get(a)).toBe(0)
>     store1.set(a, 1)
>     expect(store1.get(a)).toBe(1)
>     expect(store2.get(a)).toBe(0)
>   })
> })
> ```

### derived atom の作成

derived atom を追加してみましょう。

```ts
const aPlus1 = atom((get) => get(a) + 1)

describe('derived atom', () => {
  it('dependant', () => {
    const store = createStore()
    expect(store.get(a)).toBe(0)
    expect(store.get(aPlus1)).toBe(1)
    store.set(a, 10)
    expect(store.get(a)).toBe(10)
    expect(store.get(aPlus1)).toBe(11)
  })
})
```
 
 
## 実践

TODO のロジックを下記リポジトリを参考に分離してみましょう。

https://github.com/tak-onda/frontend-workshop-react/tree/v2 

1. `state.ts` を作成します
2. `state.test.ts` に振舞いを確認するテストを追加
3. `hooks.ts` を作成
4. コンポーネントから利用

