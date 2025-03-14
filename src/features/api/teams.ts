import { Team } from "../../shared/models/Team";
import api from "./api";

export const fetchTeams = async (
    league: string,
    season: string
): Promise<Team[]> => {
    const response = await api.get<Team[]>("football/teams", {
        params: { league, season },
    });
    return response.data;
};

export const fetchTeamLogo = async (team: Team): Promise<File> => {
    const response: Response = await fetch(team?.logo);
    const blob: Blob = await response.blob();
    return new File([blob], `${team?.code}_logo.png`, { type: 'image/png' });
};