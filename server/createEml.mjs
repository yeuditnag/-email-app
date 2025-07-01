import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createEml({ to, subject, body, attachment }) {
  const boundary = "----=_NextPart_000_001";
  const base64File = fs.readFileSync(attachment.path).toString("base64");

  const emlContent = `
From: 
To: ${to}
Subject: ${subject}
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="${boundary}"

--${boundary}
Content-Type: text/plain; charset="utf-8"
Content-Transfer-Encoding: 7bit

${body}

--${boundary}
Content-Type: application/pdf; name="${attachment.originalname}"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="${attachment.originalname}"

${base64File}
--${boundary}--
`;

  const filename = `${Date.now()}_${to.replace(/[@.]/g, "_")}.eml`;
  const filePath = path.join(__dirname, "out", filename);
  fs.writeFileSync(filePath, emlContent.trim());
  return filename;
}
