import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const htmlFiles = ['index.html']

for (const entry of await readdir('pages', { withFileTypes: true }).catch(() => [])) {
  if (entry.isFile() && entry.name.endsWith('.html')) {
    htmlFiles.push(path.join('pages', entry.name))
  }
}

const errors = []

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')

  if (html.includes('```')) {
    errors.push(`${file} contient des marqueurs Markdown \`\`\``)
  }

  if (!html.includes('</html>')) {
    errors.push(`${file} ne contient pas de balise </html>`)
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log('Static site check OK')
