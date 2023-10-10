import axios from "axios";
import { StudyEvent } from "../utils/models/studyevent.model";

export async function getAllStudyEventsFromThinkSession(
  thinksession_id: number
): Promise<StudyEvent[] | string> {
  try {
    const response = await axios.get(`/studyevents/all/${thinksession_id}`);
    // Convert all the timestamps to Date objects
    response.data.studyEvents.forEach((studyEvent: StudyEvent) => {
      studyEvent.timestamp = new Date(studyEvent.timestamp);
    });
    return response.data.studyEvents;
  } catch (err) {
    return `${err}`;
  }
}

export async function addStudyEventToThinkSession(
  thinksession_id: number,
  event_type: string,
  details: string,
  reference_id: number
): Promise<number | string> {
  try {
    const response = await axios.post(`/studyevents/add`, {
      thinksession_id,
      event_type,
      details,
      reference_id,
    });
    return response.data.studyEventId as number;
  } catch (err) {
    return `${err}`;
  }
}
