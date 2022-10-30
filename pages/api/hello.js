// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// API Routes lets create an API endpoint inside a Next.js app
// by creating a function inside the pages / api directory.
// That has the following format:

export default function handler(req, res) {
  res.status(200).json({ text: 'Hello' })
}

// These functions can be deployed as Serverless Functions (also known as Lambdas).
// Try http://localhost:3000/api/hello.
// Response should show {"text": "Hello"}
// Note how response is changed from the start
// - req is an instance of http.IncomingMessage, plus some pre-built middlewares.
// - res is an instance of http.ServerResponse, plus some helper functions.
