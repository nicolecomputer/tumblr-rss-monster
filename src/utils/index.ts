export function ucfirst(potentialString) {
  const s = `${potentialString}`
  return `${s.charAt(0).toUpperCase()}${s.substr(1)}`
}

export function howmany(count, singular, plural) {
  return `${count} ${count === 1 ? singular : (plural || `${singular}s`)}`
}

export function img(src: string, width: number, height: number, opts = null) {
  if (!opts) { opts = {} }
  opts.src = src
  opts.width = width
  opts.height = height
  return (
    `<img ${Object
      .keys(opts)
      .map(k => opts[k] ? `${k}=\"${opts[k]}\"` : '')
      .join(' ')
    }>`
  )
}

export function getTimeDiffString(t, p) {
  let timeInt = Math.abs(t)
  const pfx = p ? ` ${p}` : ''

  if (t <= 1000) { return '' }

  if ((timeInt /= 1000) < 60) return `${Math.round(timeInt * 10) / 10} seconds${pfx}`
  if ((timeInt /= 60) < 60) return `${Math.round(timeInt * 10) / 10} minutes${pfx}`
  if ((timeInt /= 60) < 24) return `${Math.round(timeInt * 10) / 10} hours${pfx}`
  if ((timeInt /= 24) < 7) return `${Math.round(timeInt * 10) / 10} days${pfx}`

  return `${Math.round((t / 7) * 10) / 10} weeks${pfx}`
}

// look at me, parsing HTML with regular expressions
export function wrapHTMLMaybe(text, tag) {
  text = `${text}`.trim()

  // Text starts/ends with HTML tags
  const rStart = /^\<(\w+)\>/
  const rEnd = /\<\/(\w+)\>$/

  // End tags exist in text
  // const rTag = /\<\/(?:p|a|em|strong|blockquote|h1|h2|h3|h4|h5|h6)\>/

  const openingTag = text.match(rStart)
  const closingTag = text.match(rEnd)

  console.log('Text:', text)
  console.log('- tag:', tag)
  console.log('- openingTag:', (openingTag && openingTag[1]) || '(none)')
  console.log('- closingTag:', (closingTag && closingTag[1]) || '(none)')

  // if rTag.test(text)
  if (openingTag && openingTag[1] === tag) {
    return text
  } else {
    return `<${tag}>\n\n${text}\n\n</${tag}>`
  }
}
