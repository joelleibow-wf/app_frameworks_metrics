import { createWriteStream, WriteStream } from "fs";
import { Parser } from "json2csv";

import PaginatedResourceServiceHelper from "./utils/paginated_resource_service_helper";

import { MessageResource } from "../resources/message";
import { RoomHistoryResource } from "../resources/room";
import { RoomHistoryService } from "../services/room";

const supportRooms = [
  {
    apiId: 2751222,
    name: "Support: App Intelligence"
  },
  {
    apiId: 2752715,
    name: "Support: H5 / Dart"
  },
  {
    apiId: 823785,
    name: "Support: UI Platform (UIP)"
  },
  {
    apiId: 4240765,
    name: "Support: Unified Wdesk"
  },
  {
    apiId: 2750828,
    name: "Support: Wdesk SDK"
  }
];

const date = "2018-07-16T23:59:59.000";
const endDate = "2017-12-13T00:00:00.000";

supportRooms.forEach(room => {
  const supportRoomCSVArchive = createWriteStream(
    `output/${room.name.toLowerCase().replace(/(\:\s)|\s/g, "_")}.csv`
  );

  supportRoomCSVArchive.on("open", async () => {
    await createSupportRoomArchive(room.apiId, supportRoomCSVArchive);
  });
});

async function createSupportRoomArchive(
  supportRoomApiId: number,
  supportRoomCSVArchive: WriteStream
) {
  const paginatedResourceServiceHelper = new PaginatedResourceServiceHelper<
    RoomHistoryService,
    RoomHistoryResource
  >(new RoomHistoryService(supportRoomApiId), {
    date,
    "end-date": endDate
  });

  await paginatedResourceServiceHelper.fetchAll();

  // tslint:disable-next-line:no-console
  console.log(
    `Completed fetching of ${
      paginatedResourceServiceHelper.fetchedPages
    } page(s)!`
  );

  const supportArchiveFields = [
    { label: "id", value: "id" },
    {
      label: "support_room_api_id",
      stringify: false,
      value: () => supportRoomApiId.toString()
    },
    { label: "date", value: "date" },
    { label: "type", value: "type" },
    { label: "from_user_id", value: "from.id" },
    { label: "from_user_mention_name", value: "from.mention_name" },
    { label: "from_user_name", value: "from.name" },
    { label: "message", value: "message" },
    {
      label: "raw_json",
      value: (row: MessageResource) => {
        return JSON.stringify(row);
      }
    }
  ];

  try {
    const parser = new Parser({
      fields: supportArchiveFields
    });

    // tslint:disable-next-line:no-console
    console.log(`Writing the support room archive...`);

    const supportRoomMessages = paginatedResourceServiceHelper.resourceItems;
    supportRoomCSVArchive.write(parser.parse(supportRoomMessages), () => {
      // tslint:disable-next-line:no-console
      console.log(
        `Archive complete. Wrote ${
          supportRoomMessages.length
        } messages to archive`
      );
    });
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
  }
}
