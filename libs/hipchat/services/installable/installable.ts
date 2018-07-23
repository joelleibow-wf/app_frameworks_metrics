import fetch from "node-fetch";

import { DynamoDB } from "aws-sdk";

import { InstallableResource } from "../../resources/installable";

export class Installable {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async fetch() {
    return await fetch(this.url);
  }

  public async delete() {
    const fetchResponse = await this.fetch();
    const installable: InstallableResource = await fetchResponse.json();

    const dyanmoDB = new DynamoDB();

    const deleteParams: DynamoDB.Types.DeleteItemInput = {
      Key: {
        oauthId: { S: installable.oauthId },
        roomId: { N: installable.roomId.toString() }
      },
      TableName: process.env.DYNAMODB_TABLE
    };

    return await dyanmoDB.deleteItem(deleteParams).promise();
  }
}
