export const maxDuration = 30;
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.token !== process.env.PAGE_REVALIDATION_TOKEN) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }

  try {
    const path = decodeURI(req.query?.path as string);
    await res.revalidate(path);
    return res.json({ revalidated: true });
  } catch (error: unknown) {
    return res
      .status(500)
      .json({ error: `Error revalidating: ${error as string}` });
  }
}
