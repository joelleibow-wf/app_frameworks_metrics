import Axios from "axios";

import { DynamoDB } from "aws-sdk";

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
        TableName: process.env.DYNAMODB_TABLE
      };

      return await this.dynamoDB.deleteItem(deleteParams).promise();
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
      TableName: process.env.DYNAMODB_TABLE
    };

    return await this.dynamoDB.getItem(getParams).promise();
  }

  private createDynamoDb() {
    if (!this.dynamoDB) {
      this.dynamoDB = new DynamoDB();
    }
  }
}
