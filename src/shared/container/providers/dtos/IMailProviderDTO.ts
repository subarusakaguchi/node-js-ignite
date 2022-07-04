interface IMailProviderDTO {
  to: string;
  subject: string;
  variables: {
    name: string;
    link: string;
  };
  path: string;
}

export { IMailProviderDTO };
