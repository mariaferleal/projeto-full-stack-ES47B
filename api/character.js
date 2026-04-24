export default async function handler(req, res) {
  const params = new URLSearchParams(req.query).toString()
  const upstreamUrl = `https://rickandmortyapi.com/api/character${params ? `?${params}` : ''}`

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        Accept: 'application/json',
      },
    })

    const body = await upstream.text()

    res.status(upstream.status)
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')
    res.send(body)
  } catch (error) {
    res.status(502).json({
      error: 'Falha ao consultar a API do Rick and Morty.',
      detail: error.message,
    })
  }
}
