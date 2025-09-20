/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'markdown-it' {
  interface MarkdownIt {
    render(markdown: string): string
  }
  const MarkdownIt: {
    new (): MarkdownIt
  }
  export = MarkdownIt
}