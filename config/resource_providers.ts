interface ResourceProviderConfiguration {
  origin: string;
}

interface ResourceProviders {
  [key: string]: ResourceProviderConfiguration;
}

export const resourceProviders: ResourceProviders = {
  hipchat: {
    origin: "https://workiva.hipchat.com"
  }
};
