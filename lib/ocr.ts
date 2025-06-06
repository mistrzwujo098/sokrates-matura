import Tesseract from 'tesseract.js'

export async function processImage(file: File): Promise<string> {
  try {
    // Create image URL
    const imageUrl = URL.createObjectURL(file)
    
    // Initialize Tesseract worker
    const result = await Tesseract.recognize(
      imageUrl,
      'pol+eng', // Polish and English
      {
        logger: (m) => {
          // You can use this to show progress
          console.log('OCR Progress:', m)
        }
      }
    )
    
    // Clean up
    URL.revokeObjectURL(imageUrl)
    
    // Process the text to clean up math expressions
    let text = result.data.text
    
    // Basic cleaning
    text = text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
    
    // Try to detect and format common math patterns
    text = formatMathExpressions(text)
    
    return text
  } catch (error) {
    console.error('OCR Error:', error)
    throw new Error('Nie udało się rozpoznać tekstu z obrazu')
  }
}

function formatMathExpressions(text: string): string {
  // Replace common OCR mistakes in math
  let formatted = text
    .replace(/\bx\s*2\b/g, 'x²')
    .replace(/\bx\s*3\b/g, 'x³')
    .replace(/\^(\d+)/g, '^{$1}')
    .replace(/sqrt\s*\(/g, '\\sqrt{')
    .replace(/sin\s*\(/g, '\\sin(')
    .replace(/cos\s*\(/g, '\\cos(')
    .replace(/tan\s*\(/g, '\\tan(')
    .replace(/log\s*\(/g, '\\log(')
    .replace(/ln\s*\(/g, '\\ln(')
    
  // Try to wrap math expressions in $ delimiters
  // This is a simple heuristic - in production you'd want something more sophisticated
  const mathPatterns = [
    /\b[a-z]\s*[=<>]\s*.+/gi, // equations like x = 2y + 3
    /\b\d+[a-z]\b/g, // terms like 3x
    /[a-z]\^\{?\d+\}?/g, // powers like x^2
    /\\[a-z]+\{[^}]+\}/g, // LaTeX commands
  ]
  
  mathPatterns.forEach(pattern => {
    formatted = formatted.replace(pattern, (match) => {
      // Don't double-wrap if already in $
      if (formatted.includes(`$${match}$`)) return match
      return `$${match}$`
    })
  })
  
  return formatted
}

// Alternative: Use Google Vision API (requires API key)
export async function processImageWithGoogleVision(file: File, apiKey: string): Promise<string> {
  const base64 = await fileToBase64(file)
  
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64.split(',')[1], // Remove data:image/jpeg;base64, prefix
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1,
              },
            ],
          },
        ],
      }),
    }
  )
  
  const data = await response.json()
  
  if (data.responses?.[0]?.fullTextAnnotation?.text) {
    return formatMathExpressions(data.responses[0].fullTextAnnotation.text)
  }
  
  throw new Error('Nie udało się rozpoznać tekstu')
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}
