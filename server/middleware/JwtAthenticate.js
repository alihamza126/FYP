export function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" })
  }

  const token = auth.split(" ")[1]
  if (!token) {
    console.error("JWT verification failed:", err)
    return res.status(403).json({ error: "Invalid or expired token" })
  }
  console.log(token)
  req.user = { id: token }
  next()
}
