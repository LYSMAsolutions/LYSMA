import { cp, mkdir, rm } from 'node:fs/promises'

const entries = ['index.html', 'pages', 'css', 'js', 'assets', 'content', 'public']

await rm('dist', { recursive: true, force: true })
await mkdir('dist', { recursive: true })

for (const entry of entries) {
  await cp(entry, `dist/${entry}`, { recursive: true, force: true }).catch((error) => {
    if (error?.code !== 'ENOENT') throw error
  })
}

console.log('Static site built in dist/')
