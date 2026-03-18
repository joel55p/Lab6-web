const extractImageUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)(\?[^\s]*)?)/i
    const match = text.match(urlRegex)
    return match ? match[0] : null
}

const getMessages = async () => {
    const ul = document.getElementById("messages")
    const isAtBottom = ul.scrollHeight - ul.scrollTop - ul.clientHeight < 80

    const response = await fetch("/api/messages")
    const messages = await response.json()

    ul.innerHTML = ''
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i]
        const li = document.createElement('li')
        const imageUrl = extractImageUrl(message.text)
        if (imageUrl) {
            li.innerHTML = `<strong>${message.user}:</strong> ${message.text}<br><img src="${imageUrl}" class="img-preview">`
        } else {
            li.innerHTML = `<strong>${message.user}:</strong> ${message.text}`
        }
        ul.append(li)
    }

    if (isAtBottom) {
        ul.scrollTop = ul.scrollHeight
    }
}

const postMessages = async (message) => {
    await fetch("/api/messages", {
        method: 'POST',
        body: JSON.stringify(message)
    })
    // después de enviar, siempre bajar al fondo
    await getMessages()
    const ul = document.getElementById("messages")
    ul.scrollTop = ul.scrollHeight
}

const handleSend = () => {
    const messageEl = document.getElementById('message')
    const text = messageEl.value.trim()
    if (!text) return
    postMessages({ user: 'Joelito Nerlini', text: text })
    messageEl.value = ''
}

getMessages()
setInterval(getMessages, 3000)

document.getElementById('send').addEventListener('click', handleSend)

document.getElementById('message').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
    }
})
