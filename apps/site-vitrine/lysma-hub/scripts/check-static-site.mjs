import { readFile } from 'node:fs/promises'

const html = await readFile('index.html', 'utf8')
const errors = []

if (!html.includes('<!DOCTYPE html>') && !html.includes('<!doctype html>')) {
  errors.push('index.html doit commencer par un doctype HTML')
}

if (html.includes('```')) {
  errors.push('index.html contient des marqueurs Markdown ```')
}

if (!html.includes('</html>')) {
  errors.push('index.html ne contient pas de balise </html>')
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log('Static site check OK')
