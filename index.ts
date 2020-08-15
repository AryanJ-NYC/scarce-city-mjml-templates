import dotenv from 'dotenv';
import fs from 'fs';
import mjml2html from 'mjml';
import util from 'util';
import MailGunClient from './services/MailgunClient';

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

dotenv.config();

async function main() {
  const mailgunClient = new MailGunClient();
  const mjmlFileNames = await readDir('./templates');

  mjmlFileNames.forEach(async (fileName) => {
    const mjml = await getFileContents(`./templates/${fileName}`);
    const { html } = mjml2html(mjml);
    const [templateName] = fileName.split('.');
    await mailgunClient.updateTemplateVersion(templateName, 'initial', html);
  });
}

async function getFileContents(filePath: string) {
  const fileBuffer = await readFile(filePath);
  return fileBuffer.toString();
}

main();
