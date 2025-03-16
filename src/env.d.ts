/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
