import { DynamoDB as DynamoDBClient } from "aws-sdk";

export abstract class DynamoDB<I extends { [key: string]: any }> {
  protected abstract tableName: string;

  private dataStore: DynamoDBClient;

  constructor(private item: I) {}

  public async save() {
    this.createDataStore();

    const putItem = {
      Item: this.itemToDynamoItem(),
      TableName: this.tableName
    };

    try {
      await this.dataStore.putItem(putItem).promise();
    } catch (error) {
      throw error;
    }

    return this.item;
  }

  private createDataStore() {
    if (!this.dataStore) {
      this.dataStore = new DynamoDBClient();
    }
  }

  private itemToDynamoItem() {
    const dynamoItem: {
      [itemField: string]: DynamoDBClient.AttributeValue;
    } = {};

    Object.keys(this.item).forEach(
      itemField =>
        (dynamoItem[itemField] = this.getDynamoAttributeValue(
          this.item[itemField]
        ))
    );

    return dynamoItem;
  }

  // TODO: This needs to support types besides number and string.
  private getDynamoAttributeValue(
    itemFieldValue: any
  ): DynamoDBClient.AttributeValue {
    const typeToAttributeValueKey: { [type: string]: string } = {
      number: "N",
      string: "S"
    };

    const attributeValue: DynamoDBClient.AttributeValue = {
      [typeToAttributeValueKey[
        typeof itemFieldValue
      ]]: itemFieldValue.toString()
    };

    return attributeValue;
  }
}
