export interface InstallableResource {
  capabilitiesUrl: string;
  groupId: number;
  installedOn?: string;
  oauthId: string;
  oauthSecret: string;
  roomId: number;
}

export class Installable {
  private resourceJson: InstallableResource;

  constructor(resourceJson: InstallableResource) {
    this.resourceJson = resourceJson;
  }

  public get capabilitiesUrl(): string {
    return this.resourceJson.capabilitiesUrl;
  }

  public get groupId(): number {
    return this.resourceJson.groupId;
  }

  public get installedOn(): string {
    return this.resourceJson.installedOn;
  }

  public get oauthId(): string {
    return this.resourceJson.oauthId;
  }

  public get oauthSecret(): string {
    return this.resourceJson.oauthSecret;
  }

  public get roomId(): number {
    return this.resourceJson.roomId;
  }
}
