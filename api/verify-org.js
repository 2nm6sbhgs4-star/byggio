export default async function handler(req, res) {
  const orgNumber = req.query.orgNumber

  if (!orgNumber) {
    return res.status(400).json({ error: 'Organisationsnummer saknas' })
  }

  const cleanOrgNumber = orgNumber.replace(/[\s-]/g, '')

  try {
    const response = await fetch(`https://apiverket.se/v1/companies/${cleanOrgNumber}`, {
      headers: {
        Authorization: `Bearer ${process.env.APIVERKET_KEY}`,
      },
    })

    if (!response.ok) {
      return res.status(200).json({ verified: false, reason: 'Företaget hittades inte' })
    }

    const data = await response.json()

    return res.status(200).json({
      verified: true,
      companyName: data.name ?? null,
      status: data.status ?? null,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Kunde inte verifiera organisationsnummer' })
  }
}
