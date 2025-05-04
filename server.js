// server.js
import express from 'express'
import next from 'next'
import { parse } from 'url'

const dev  = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT || '3000', 10)
const app  = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // 1) JSON body parsing for your APIs
  server.use(express.json())

  // 2) Example custom API route(s)
  //    You can move these into their own modules/files if you like.
  server.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express + Next!' })
  })

  // 3) All other requests → let Next.js handle (pages, static, etc.)
  server.use((req, res) => {
    // If you need to pass a parsedUrl to Next, you can do:
    const parsedUrl = parse(req.url, true)
    return handle(req, res, parsedUrl)
  })

  // 4) Start listening
  server.listen(port, (err) => {
    if (err) throw err
    console.log(
      `> 🚀 Server ready at http://localhost:${port} [${dev ? 'dev' : 'prod'}]`
    )
  })
})
