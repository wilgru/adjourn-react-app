import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { getColour } from "src/colours/utils/getColour";
import type { RecordModel } from "pocketbase";
import type { Journal } from "src/journals/Journal.type";

dayjs.extend(utc);

export const mapJournal = (journal: RecordModel): Journal => {
  return {
    id: journal.id,
    title: journal.title,
    icon: journal.icon,
    colour: getColour(journal.colour),
    created: dayjs.utc(journal.created).local(),
    updated: dayjs.utc(journal.updated).local(),
  };
};
