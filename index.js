require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.static('static'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const baseUrl = process.env.URL // Set to ngrok url to test
const discordWebhook = process.env.DISCORD_WEBHOOK
const username = process.env.USERNAME
const password = process.env.PASSWORD
const key = Buffer.from(username + ':' + password).toString('base64')

app.get('/', function (req, res) {
  res.status(200)
  res.json({
    hello: 'world',
  })
  res.end()
})

app.post('/incomingCalls', function (req, res) {
  res.status(200)

  res.json({
    play: `${baseUrl}/welcome.mp3`,
    next: `${baseUrl}/recordCall`,
  })
  res.end()
})

app.post('/recordCall', function (req, res) {
  res.status(200)

  res.json({
    record: `${baseUrl}/recordedCall`,
  })
  res.end()
})

app.post('/recordedCall', async function (req, res) {
  res.status(200)
  const link = req.body.wav

  const data = {
    content: `**New recording**: ${link} \r\n**Created**: ${new Date().toLocaleString()} \r\n**Duration**: ${
      req.body.duration
    } seconds \r\n**From**: ${req.body.from}`,
  }

  if (discordWebhook) {
    await fetch(discordWebhook, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((err) => console.log('err', err))
  } else {
    console.log(data)
  }

  res.end()
})

const port = process.env.PORT || 3000

console.log('listening on port', port)

app.listen(port)
