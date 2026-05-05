/**
 * Générateur de code-barres Code128 en SVG pur
 * Pas de dépendance externe — utilisé pour le PDF
 */

// Encodage Code128B
const CODE128B_TABLE: Record<string, number> = {
  ' ': 0, '!': 1, '"': 2, '#': 3, '$': 4, '%': 5, '&': 6, "'": 7,
  '(': 8, ')': 9, '*': 10, '+': 11, ',': 12, '-': 13, '.': 14, '/': 15,
  '0': 16, '1': 17, '2': 18, '3': 19, '4': 20, '5': 21, '6': 22, '7': 23,
  '8': 24, '9': 25, ':': 26, ';': 27, '<': 28, '=': 29, '>': 30, '?': 31,
  '@': 32, 'A': 33, 'B': 34, 'C': 35, 'D': 36, 'E': 37, 'F': 38, 'G': 39,
  'H': 40, 'I': 41, 'J': 42, 'K': 43, 'L': 44, 'M': 45, 'N': 46, 'O': 47,
  'P': 48, 'Q': 49, 'R': 50, 'S': 51, 'T': 52, 'U': 53, 'V': 54, 'W': 55,
  'X': 56, 'Y': 57, 'Z': 58, '[': 59, '\\': 60, ']': 61, '^': 62, '_': 63,
  '`': 64, 'a': 65, 'b': 66, 'c': 67, 'd': 68, 'e': 69, 'f': 70, 'g': 71,
  'h': 72, 'i': 73, 'j': 74, 'k': 75, 'l': 76, 'm': 77, 'n': 78, 'o': 79,
  'p': 80, 'q': 81, 'r': 82, 's': 83, 't': 84, 'u': 85, 'v': 86, 'w': 87,
  'x': 88, 'y': 89, 'z': 90,
}

// Patterns Code128 (11 bits each)
const PATTERNS = [
  '11011001100', '11001101100', '11001100110', '10010011000', '10010001100',
  '10001001100', '10011001000', '10011000100', '10001100100', '11001001000',
  '11001000100', '11000100100', '10110011100', '10011011100', '10011001110',
  '10111001100', '10011101100', '10011100110', '11001110010', '11001011100',
  '11001001110', '11011100100', '11001110100', '11101101110', '11101001100',
  '11100101100', '11100100110', '11101100100', '11100110100', '11100110010',
  '11011011000', '11011000110', '11000110110', '10100011000', '10001011000',
  '10001000110', '10110001000', '10001101000', '10001100010', '11010001000',
  '11000101000', '11000100010', '10110111000', '10110001110', '10001101110',
  '10111011000', '10111000110', '10001110110', '11101110110', '11010001110',
  '11000101110', '11011101000', '11011100010', '11011101110', '11101011000',
  '11101000110', '11100010110', '11101101000', '11101100010', '11100011010',
  '11101111010', '11001000010', '11110001010', '10100110000', '10100001100',
  '10010110000', '10010000110', '10000101100', '10000100110', '10110010000',
  '10110000100', '10011010000', '10011000010', '10000110100', '10000110010',
  '11000010010', '11001010000', '11110111010', '11000010100', '10001111010',
  '10100111100', '10010111100', '10010011110', '10111100100', '10011110100',
  '10011110010', '11110100100', '11110010100', '11110010010', '11011011110',
  '11011110110', '11110110110', '10101111000', '10100011110', '10001011110',
  '10111101000', '10111100010', '11110101000', '11110100010', '10111011110',
  '10111101110', '11101011110', '11110101110',
  // Special
  '11010000100', // START B = 104
  '11000111010', // STOP = 106
]

const START_B = 104
const STOP = 106

export function generateBarcodeSVG(text: string, height = 40): string {
  const chars = text.toUpperCase().split('')
  
  // Calculer checksum
  let checksum = START_B
  chars.forEach((char, i) => {
    const val = CODE128B_TABLE[char] ?? 0
    checksum += val * (i + 1)
  })
  checksum = checksum % 103

  // Construire les barres
  const bars: string[] = []
  bars.push(PATTERNS[START_B]) // Start B
  chars.forEach(char => {
    const val = CODE128B_TABLE[char] ?? 0
    bars.push(PATTERNS[val])
  })
  bars.push(PATTERNS[checksum]) // Checksum
  bars.push(PATTERNS[STOP])     // Stop

  const barsStr = bars.join('')
  const moduleWidth = 2
  const totalWidth = barsStr.length * moduleWidth + 20 // padding

  let x = 10
  let rects = ''
  for (const bit of barsStr) {
    if (bit === '1') {
      rects += `<rect x="${x}" y="0" width="${moduleWidth}" height="${height}" fill="black"/>`
    }
    x += moduleWidth
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height + 16}" viewBox="0 0 ${totalWidth} ${height + 16}">
  <rect width="${totalWidth}" height="${height + 16}" fill="white"/>
  ${rects}
  <text x="${totalWidth / 2}" y="${height + 12}" text-anchor="middle" font-family="Helvetica" font-size="10" fill="black">${text}</text>
</svg>`
}

export function barcodeSVGToDataURL(text: string, height = 40): string {
  const svg = generateBarcodeSVG(text, height)
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}
