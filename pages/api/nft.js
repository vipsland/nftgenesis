
import fetch from 'node-fetch';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {

  try {
    const queryString = req.query;
    const apiUrl = `https://ipfs.vipsland.com/nft/col/pfp/jsn/?${new URLSearchParams(queryString)}`;

    const response = await fetch(apiUrl);
    console.log(`???`, { queryString, apiUrl });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched data:', data);

    res.status(200).json({ data })
  } catch (error) {
    throw new Error(`Error fetching data: ${error}`);
  }
}
