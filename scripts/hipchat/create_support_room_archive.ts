import { config } from "dotenv";
import { createWriteStream, WriteStream } from "fs";
import { Parser } from "json2csv";

import PaginatedResourceServiceHelper from "../utils/paginated_resource_service_helper";

import { MessageResource } from "../../libs/hipchat/resources/message";
import { RoomHistoryResource } from "../../libs/hipchat/resources/room";
import { RoomHistoryService } from "../../libs/hipchat/services/room";

config();

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
    console.log(`Writing the archive...`);

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

interface SupportRoomConfig {
  apiId: number;
  name: string;
}

/*
*
* To avoid hitting Hipchat REST API rate limits, it is recommended to run
*   this script once per room!!!
*
*/
const supportRooms = [
  {
    admin: "Rob Sheehy",
    apiId: 2751222,
    name: "Support: App Intelligence"
  },
  {
    admin: "Trent Grover",
    apiId: 2752715,
    name: "Support: H5 / Dart"
  },
  {
    admin: "Behdad Shayegan",
    apiId: 823785,
    name: "Support: UI Platform (UIP)"
  },
  {
    admin: "Max Peterson",
    apiId: 4240765,
    name: "Support: Unified Wdesk"
  },
  {
    admin: "Trent Grover",
    apiId: 2750828,
    name: "Support: Wdesk SDK"
  }
];

/*
*
* Modify these to adjust what dates of messages within the support room
*   will be included within the archive!!!
*
*/
const now = Date.now();
const nowDate = new Date(now);

const date = nowDate.toISOString();
const endDate = "2018-07-17T00:00:00.000";

asyncForEach<SupportRoomConfig, Promise<void>>(supportRooms, async room => {
  const month = padTimeUnit(nowDate.getUTCMonth(), 8, 1);
  const dayOfMonth = padTimeUnit(nowDate.getUTCDate());
  const hours = padTimeUnit(nowDate.getHours());
  const minutes = padTimeUnit(nowDate.getUTCMinutes());

  const supportRoomCSVArchive = createWriteStream(
    `output/${nowDate.getUTCFullYear()}${month}${dayOfMonth}${hours}${minutes}_${room.name
      .toLowerCase()
      .replace(/\s/g, "_")
      .replace(/(\W\s?)/g, "")}.csv`
  );

  await createSupportRoomArchive(room.apiId, supportRoomCSVArchive);
});

function padTimeUnit(
  timeUnit: number,
  greaterThanOrEqualTo = 9,
  incrementBy = 0
) {
  return timeUnit <= greaterThanOrEqualTo
    ? `0${timeUnit + incrementBy}`
    : timeUnit;
}

// Use this to avoid that Node can't support async/await at the top level
//   within a script.
async function asyncForEach<I, R>(
  array: I[],
  callback: (item: I, index: number, array: I[]) => R
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
