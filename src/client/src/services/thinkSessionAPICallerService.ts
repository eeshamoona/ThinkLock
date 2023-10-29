import axios from "axios";
import {
  FailureResponse,
  SuccessResponse,
} from "../utils/models/responses.model";
import { ThinkSession } from "../utils/models/thinksession.model";
import { HeatmapData } from "../utils/models/heatmapdata.model";

const API_URL = "http://localhost:3000/thinksessions";

export async function getAllThinkSessions(): Promise<
  ThinkSession[] | FailureResponse
> {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data.thinksessions;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function getThinkSessionById(
  id: number
): Promise<ThinkSession | FailureResponse> {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.thinksession;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function getAllThinkSessionsByThinkFolderId(
  thinkFolderId: number
): Promise<ThinkSession[] | FailureResponse> {
  try {
    const response = await axios.get(`${API_URL}/all/${thinkFolderId}`);
    return response.data.thinksessions;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function getThinkSessionHeatMapByYear(
  year: number,
  thinkFolderId: number
): Promise<HeatmapData[] | FailureResponse> {
  try {
    const response = await axios.get(
      `${API_URL}/heatmap/${thinkFolderId}/${year}`
    );
    return response.data.heatmapData;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function getAllThinkSessionsByDate(
  date: Date
): Promise<ThinkSession[] | FailureResponse> {
  try {
    const response = await axios.get(
      `${API_URL}/all/date/${date.toISOString()}`
    );
    return response.data.thinksessions;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function createThinkSession(
  thinkSession: Partial<ThinkSession>
): Promise<number | FailureResponse> {
  try {
    const response = await axios.post(`${API_URL}/create`, thinkSession);
    return response.data.thinksession_id;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function updateThinkSession(
  id: number,
  thinkSession: Partial<ThinkSession>
): Promise<SuccessResponse | FailureResponse> {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, thinkSession);
    return response.data.response;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}
