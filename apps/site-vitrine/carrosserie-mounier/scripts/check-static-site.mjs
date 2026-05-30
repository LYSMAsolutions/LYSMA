import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const htmlFiles = ['index.html']

for (const entry of await readdir('pages', { withFileTypes: true }).catch(() => [])) {
  if (entry.isFile() && entry.name.endsWith('.html')) {
    htmlFiles.push(path.join('pages', entry.name))
  }
}

async function collectIndexFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true }).catch(() => [])) {
    const filePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      await collectIndexFiles(filePath)
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(filePath)
    }
  }
}

await collectIndexFiles('prestations')

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
