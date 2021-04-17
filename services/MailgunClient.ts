import Mailgun from 'mailgun-js';

export default class MailGunClient extends Mailgun {
  // private readonly domain = 'sandboxa0e011abaa70432c9e8dbcbf44304ff2.mailgun.org';
  private readonly domain = 'mg.scarce.city';

  constructor() {
    super({ apiKey: process.env.MAILGUN_API_KEY, domain: 'mg.scarce.city' });
  }

  private postTemplate = async (
    templateName: string,
    description: string,
    htmlTemplate: string
  ) => {
    return this.post(`/${this.domain}/templates`, {
      name: templateName,
      description,
      template: htmlTemplate,
    });
  };

  private putTemplateVersion = async (
    templateName: string,
    versionTag: string,
    htmlTemplate: string
  ) => {
    return this.put(`/${this.domain}/templates/${templateName}/versions/${versionTag}`, {
      template: htmlTemplate,
      version: versionTag,
    });
  };

  upsertTemplate = async (
    templateName: string,
    description: string,
    versionTag: string,
    htmlTemplate: string
  ) => {
    try {
      await this.putTemplateVersion(templateName, versionTag, htmlTemplate);
    } catch (err) {
      await this.postTemplate(templateName, description, htmlTemplate);
    }
  };
}
