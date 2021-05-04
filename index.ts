import dotenv from 'dotenv';
import fs from 'fs';
import mjml2html from 'mjml';
import util from 'util';
import MailGunClient from './services/MailgunClient';

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

dotenv.config();

const domains = [
  'sandboxa0e011abaa70432c9e8dbcbf44304ff2.mailgun.org', //dev
  'mg.scarce.city', // prod
];
async function main() {
  const mjmlFileNames = await readDir('./templates');

  domains.forEach((d) => {
    const mailgunClient = new MailGunClient(d);
    console.log(`uploading to ${d}...`);
    mjmlFileNames.forEach(async (fileName) => {
      console.log(`uploading ${fileName}`);
      const mjml = await getFileContents(`./templates/${fileName}`);
      const { html } = mjml2html(mjml);
      const [templateName] = fileName.split('.');
      await mailgunClient.upsertTemplate(templateName, templateName, 'initial', html);
      console.log(`${fileName} uploaded`);
    });
  });
}

async function getFileContents(filePath: string) {
  const fileBuffer = await readFile(filePath);
  return fileBuffer.toString();
}

main();
