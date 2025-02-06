import fs from 'fs/promises';
import mjml2html from 'mjml';
import MailGunClient from './services/MailgunClient.ts';

const domains = [
  'sandboxa0e011abaa70432c9e8dbcbf44304ff2.mailgun.org', // dev
  process.env.NODE_ENV !== 'development' ? 'mg.scarce.city' : '', // prod
].filter(Boolean);

async function main() {
  const mjmlFileNames = await fs.readdir('./templates');

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
  const fileBuffer = await fs.readFile(filePath);
  return fileBuffer.toString();
}

main();
