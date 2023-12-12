// import crypto from "crypto";

// async function encrypt(text: string, secret: string) {
//   return new Promise((resolve, reject) => {
//     const algorithm = "aes-256-ctr";
//     const secretKey = secret;
//     const iv = crypto.randomBytes(16);

//     const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

//     const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

//     resolve({
//       iv: iv.toString("hex"),
//       content: encrypted.toString("base64"),
//     });
//   });
// }

// async function decrypt(hash: any, secret: string) {
//   return new Promise((resolve, reject) => {
//     const algorithm = "aes-256-ctr";
//     const secretKey = secret;

//     const decipher = crypto.createDecipheriv(
//       algorithm,
//       secretKey,
//       Buffer.from(hash.iv, "hex")
//     );

//     const decrpyted = Buffer.concat([
//       decipher.update(Buffer.from(hash.content, "base64")),
//       decipher.final(),
//     ]);

//     resolve(decrpyted.toString());
//   });
// }

// const generateKey = (): crypto.ECDH => {
//   const keyExchange = crypto.createECDH("prime192v1");
//   return keyExchange;
// };

// const processMessage = async () => {
//   const aliceSecret = alice.computeSecret(bobKey);
//   const bobSecret = bob.computeSecret(aliceKey);

//   const a = aliceSecret.toString("base64");
//   const encryptedMessage = await encrypt(
//     "Hello việt nam",
//     aliceSecret.toString("base64")
//   );
//   console.log(aliceSecret === bobSecret);

//   const decryptedMessage = await decrypt(
//     encryptedMessage,
//     bobSecret.toString("base64")
//   );
//   console.log(decryptedMessage);
// };

// export { generateKey };
