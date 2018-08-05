import Axios from "axios";

import { DynamoDB } from "aws-sdk";

import { InstallableModel } from "../../models";
import { InstallableResource } from "../../resources/installable";

export class Installable {
  private dynamoDB: DynamoDB;
  private urlInternal: string;

  public set url(val: string) {
    this.urlInternal = val;
  }

  constructor(url?: string) {
    if (url) {
      this.urlInternal = url;
    }
  }

  public async delete() {
    if (this.urlInternal) {
      this.createDynamoDb();

      const fetchResponse = await this.fetch();
      const installable: InstallableResource = await fetchResponse.data;

      const deleteParams: DynamoDB.Types.DeleteItemInput = {
        Key: {
          oauthId: { S: installable.oauthId }
        },
        TableName: process.env.DYNAMODB_INSTALLS_TABLE
      };

      try {
        await this.dynamoDB.deleteItem(deleteParams).promise();
        return installable;
      } catch (error) {
        throw error;
      }
    }

    return;
  }

  public async fetch() {
    if (this.urlInternal) {
      return await Axios.get<InstallableResource>(this.urlInternal);
    }

    return;
  }

  public async get(oauthId: InstallableResource["oauthId"]) {
    this.createDynamoDb();

    const getParams: DynamoDB.Types.GetItemInput = {
      Key: {
        oauthId: { S: oauthId }
      },
      TableName: process.env.DYNAMODB_INSTALLS_TABLE
    };

    return await this.dynamoDB.getItem(getParams).promise();
  }

  public async createFromResource(installableResource: InstallableResource) {
    const newInstallableModel = new InstallableModel(installableResource);
    return await newInstallableModel.save();
  }

  private createDynamoDb() {
    if (!this.dynamoDB) {
      this.dynamoDB = new DynamoDB();
    }
  }
}
