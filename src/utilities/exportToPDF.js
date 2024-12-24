import dayjs from 'dayjs'
import jsPDF from 'jspdf'

export function exportToPDF(data, fileName = 'cv.pdf') {
  const pdf = new jsPDF()
  const urlRegex = /^(https?:\/\/)?([a-z0-9.-]+)\.([a-z]{2,})([/\w .-]*)*\/?$/

  const hexToRgb = (hex) => {
    if (!/^#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(hex)) {
      console.error(`Invalid hex color: ${hex}`)
      return [63, 77, 103]
    }

    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    } else if (hex.length === 5) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}${hex[4]}${hex[4]}`
    }

    const bigint = parseInt(hex.slice(1, 7), 16)
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
  }

  const margin = 20
  const leftWidth = 70
  const lineHeight = 8
  let yPosition = margin

  const sidebarColor = data.color ? hexToRgb(data.color) : hexToRgb('#3F4D67')
  const secondaryColor = [227, 97, 55]
  const lightGrey = [240, 240, 240]

  const capitalizeFirstLetter = (text) =>
    text
      ? text
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : ''

  const addLabeledText = (
    title,
    value,
    x = margin,
    fontSizeTitle = 12,
    fontSizeValue = 10,
    colorTitle = [0, 0, 0],
    colorValue = [50, 50, 50],
  ) => {
    if (title) {
      pdf.setFont('Helvetica', 'bold')
      pdf.setFontSize(fontSizeTitle)
      pdf.setTextColor(...colorTitle)
      pdf.text(`${capitalizeFirstLetter(title)}:`, x, yPosition)
    }

    if (value) {
      yPosition += lineHeight - 2
      pdf.setFont('Helvetica', 'normal')
      pdf.setFontSize(fontSizeValue)
      pdf.setTextColor(...colorValue)
      pdf.text(value, x, yPosition)
    }

    yPosition += lineHeight

    // Handle page overflow
    if (yPosition > pdf.internal.pageSize.height - margin) {
      pdf.addPage()
      yPosition = margin
    }
  }
  const addText = (
    text,
    x = margin,
    fontSize = 12,
    isBold = false,
    color = [0, 0, 0],
    link = '',
  ) => {
    if (!text) return

    let displayText = text
    let url = link || text

    if (urlRegex.test(url)) {
      displayText = displayText || 'Click here'
    }

    if (typeof displayText !== 'string') {
      console.warn('Non-string data passed to addText:', displayText)
      displayText = String(displayText)
    }

    pdf.setFont('Helvetica', isBold ? 'bold' : 'normal')
    pdf.setFontSize(fontSize)
    pdf.setTextColor(...color)

    // Display the text with underline for links
    if (urlRegex.test(url)) {
      // Underline the text for clickable links
      pdf.text(displayText, x, yPosition)
      const textWidth = pdf.getTextWidth(displayText) // Get width of the text for the underline
      const underlineY = yPosition + 1 // Position the underline just below the text

      // Draw an underline just below the text
      pdf.setDrawColor(...color)
      pdf.line(x, underlineY, x + textWidth, underlineY) // Underline the text
    } else {
      // Regular text, no link
      pdf.text(displayText, x, yPosition)
    }

    // Handle page overflow
    yPosition += lineHeight
    if (yPosition > pdf.internal.pageSize.height - margin) {
      pdf.addPage()
      yPosition = margin
    }

    // Create a clickable link area if it's a valid URL
    if (urlRegex.test(url)) {
      const textWidth = pdf.getTextWidth(displayText) // Width of the text
      pdf.link(x, yPosition - fontSize, textWidth, fontSize, { url }) // Set clickable area over the text only
    }
  }

  const renderMainContent = () => {
    const rightStartX = leftWidth + margin
    yPosition = margin

    pdf.setTextColor(0, 0, 0)
    addText(capitalizeFirstLetter(data.name) || 'Your Name', rightStartX, 18, true)
    if (data.position)
      addText(capitalizeFirstLetter(data.position), rightStartX, 12, false, secondaryColor)

    if (data.profile) {
      addText('PROFILE', rightStartX, 12, true)
      const profileLines = pdf.splitTextToSize(data.profile, 120)
      profileLines.forEach((line) => addText(line, rightStartX))
    }

    renderDynamicSection('WORK EXPERIENCE', 'work', [
      'organization',
      'position',
      'duration',
      'description',
    ])
    renderDynamicSection('PROJECTS', 'project', ['title', 'link', 'project-description'])
    renderDynamicSection('EDUCATION', 'education', [
      'college',
      'year',
      'qualification',
      'education-description',
    ])

    if (data.achievements?.length) {
      addText('ACHIEVEMENTS', rightStartX, 12, true)
      data.achievements.forEach((achievement) =>
        addText(`• ${capitalizeFirstLetter(achievement)}`, rightStartX, 10),
      )
    }

    if (data.certificates?.length) {
      addText('CERTIFICATES', rightStartX, 12, true)
      data.certificates.forEach((certificate) =>
        addText(`• ${capitalizeFirstLetter(certificate)}`, rightStartX, 10),
      )
    }

    pdf.save(fileName)
  }
  const renderSidebarContent = () => {
    addText(capitalizeFirstLetter(data.name) || 'Your Name', margin, 16, true, [255, 255, 255])

    if (data.position) {
      addText(capitalizeFirstLetter(data.position), margin, 12, false, [255, 255, 255])
    }

    addText('CONTACT', margin, 12, true, [255, 255, 255])

    if (data.email) {
      addText(data.email, margin, 10, false, [255, 255, 255])
    }

    if (data.mobile) {
      addText(data.mobile, margin, 10, false, [255, 255, 255])
    }

    if (data.city && data.country && data.street) {
      addText(
        `${(capitalizeFirstLetter(data.street), capitalizeFirstLetter(data.city))}, ${capitalizeFirstLetter(data.country)}`,
        margin,
        10,
        false,
        [255, 255, 255],
      )
    }

    if (data.linkedin) {
      addText('LinkedIn', margin, 10, true, [255, 255, 255], data.linkedin)
    }

    if (data.github) {
      addText('GitHub', margin, 10, true, [255, 255, 255], data.github)
    }

    if (data.skills?.length) {
      addText('Skills', margin, 12, true, [255, 255, 255])
      data.skills.forEach((skill) =>
        addText(`• ${capitalizeFirstLetter(skill)}`, margin, 10, false, [255, 255, 255]),
      )
    }

    pdf.setTextColor(0, 0, 0)
    renderMainContent()
  }

  const renderDynamicSection = (title, prefix, fields) => {
    let index = 0
    let found = false

    while (data[`${fields[0]}-${index}`]) {
      if (!found) {
        addText(title, leftWidth + margin, 12, true)
        found = true
      }

      fields.forEach((field) => {
        let value = data[`${field}-${index}`]

        if (value && dayjs.isDayjs(value)) {
          value = value.format('YYYY-MM')
        } else if (Array.isArray(value)) {
          value = value.map((v) => (dayjs.isDayjs(v) ? v.format('YYYY-MM') : '')).join(' to ')
        }

        if (value) {
          const label = field.split('-')[0]
          addLabeledText(label, value, leftWidth + margin)

          if (field === 'link' && value) {
            if (urlRegex.test(value)) {
              addText('Click here', leftWidth + margin, 10, false, [0, 0, 255], value)
            }
          }
        }
      })

      yPosition += 5
      index++
    }

    if (found) yPosition += 10
  }

  const drawRect = (x, y, width, height, color = lightGrey) => {
    pdf.setFillColor(...color)
    pdf.rect(x, y, width, height, 'F')
  }

  // Draw sidebar
  drawRect(0, 0, leftWidth, pdf.internal.pageSize.height, sidebarColor)

  pdf.setTextColor(255, 255, 255)

  // Add image in sidebar
  if (data.personalImage && data.personalImage.file) {
    const imageFile = data.personalImage.file

    const reader = new FileReader()

    reader.onload = (event) => {
      const imageDataUrl = event.target.result

      try {
        const imageSize = 30
        const shiftAmount = 20
        const imageX = margin + (leftWidth - imageSize) / 2 - shiftAmount
        yPosition -= 10

        const imageType = imageDataUrl.split(';')[0].split('/')[1] // Extract type from data URL
        if (['jpeg', 'jpg', 'png', 'gif'].includes(imageType)) {
          pdf.addImage(
            imageDataUrl,
            imageType.toUpperCase(),
            imageX,
            yPosition,
            imageSize,
            imageSize,
          )
          yPosition += imageSize + 2
        } else {
          console.error('Unsupported image format:', imageType)
        }

        yPosition += 10
      } catch (error) {
        console.error('Error adding image to PDF:', error)
        addText('Profile Image (Error loading)', margin, 12, true)
      }
      renderSidebarContent()
    }

    reader.onerror = (error) => {
      console.error('Error reading image file:', error)
      addText('Profile Image (Error loading)', margin, 12, true)
      renderSidebarContent()
    }

    reader.readAsDataURL(imageFile)
  } else {
    renderSidebarContent()
  }
}
