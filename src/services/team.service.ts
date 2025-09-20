import { authTokenAxios } from "./axios";

export const getTeam = () => authTokenAxios.get(`/team`);