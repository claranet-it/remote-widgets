import type { NextApiRequest, NextApiResponse } from 'next';
import initFirebase from "../../src/firebase";
import { ref, child, get, getDatabase } from "firebase/database";
import { vanillaCompass } from '../../src/compass/useCompass';
import genereateSVG from '../../src/compass/generateSVG';
import sharp from 'sharp';

type Extension = "svg" | "png";

type RequestInfo = {
  id: string;
  ext: Extension;
}

type ResponseHandlers = {
  [ext in Extension]: ResponseHandler
}

type ResponseHandler = (svg: string, res: NextApiResponse) => void;

const svgHandler = (svg: string, res: NextApiResponse) => {
  res
    .setHeader('Content-Type', 'image/svg+xml')
    .setHeader('Cache-Control', 'no-cache')
    .status(200)
    .send(svg);
};

const pngHandler = (svg: string, res: NextApiResponse) => {
    sharp(Buffer.from(svg, "utf8"))
      .resize(3000)
      .png()
      .toBuffer()
      .then((buffer: Buffer) => {
        res
          .setHeader("Content-Type", "image/png")
          .setHeader("Cache-Control", "public, max-age=31536000")
          .status(200)
          .send(buffer);
      });
};

const handlers : ResponseHandlers = {
  svg: svgHandler,
  png: pngHandler
};

const idParser = (id: string) : RequestInfo | undefined => {
  if(id.indexOf('.') === -1) return undefined;
  const idParts = id.split('.');
  if (idParts.length !== 2) return undefined;
  if(idParts[1] !== "svg" && idParts[1] !== "png") return undefined;
  return {
    id: idParts[0],
    ext: idParts[1]
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const requestInfo = idParser(req.query.id as string);

  if(!requestInfo) {
    res.status(400).json("Invalid request");
    return;
  }

  const {
    id,
    ext
  } = requestInfo;

  const app = initFirebase();
  const db = getDatabase(app);
  const dbRef = ref(db);
  let compass = vanillaCompass;
  const snapshot = await get(child(dbRef, `compass/${id}`));
  if (snapshot.exists() && snapshot.val() && snapshot.val().compass) {
    compass = snapshot.val().compass;
  }

  const svg = genereateSVG(compass);

  const handler = handlers[ext];

  handler(svg, res);
}
