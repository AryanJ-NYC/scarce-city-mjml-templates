import Mailgun from 'mailgun-js';

export default class MailGunClient extends Mailgun {
  private readonly domain = 'mg.scarce.city';

  constructor() {
    super({ apiKey: process.env.MAILGUN_API_KEY, domain: 'mg.scarce.city' });
  }

  putTemplateVersion = async (templateName: string, versionTag: string, htmlTemplate: string) => {
    return this.put(`/${this.domain}/templates/${templateName}/versions/${versionTag}`, {
      template: htmlTemplate,
      version: versionTag,
    });
  };
}
