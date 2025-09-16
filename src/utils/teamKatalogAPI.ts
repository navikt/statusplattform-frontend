const apiPath = "/api/teamkatalog";
import { Team } from "../types/types";
import { backendPath } from "../pages"
import { EndPathSpecificService } from "./apiHelper";




export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const fetchAllTeams = async (): Promise<Team[]> => {

    const request = new Request(apiPath)
    const response = await fetch(request)

    if (response.ok) {
        let retrievedTeams = await response.json()
        retrievedTeams = retrievedTeams.sort((a:Team,b:Team) =>{
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        })
        return retrievedTeams
    }
    throw new ResponseError("Failed to fetch from server", response)
}

export const searchTeamsByName = async (name: string): Promise<Team> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/rest/teams/search/${name}`);
  
      if (!response.ok) {
        throw new Error(`Failed to search teams with name: ${name}`);
      }
  
      const team: Team = await response.json();
      return team; // This should return a map with UUID and team name
    } catch (error) {
      console.error('Error searching teams by name:', error);
      return null;
    }
};
  
export const fetchSimplifiedTeamByName = async (name: string): Promise<Team> => {
  const response = await fetch(`/api/teams/searchSimplifiedByName?name=${name}`);

  if (response.ok) {
      const team: Team = await response.json();
      return team;
  }

  throw new Error(`Failed to fetch team with name: ${name}`);
};

export const checkUserMembershipInTeam = async (teamId: string, userId: string): Promise<boolean> => {
  const response = await fetch(`/api/teams/checkUserInTeam?teamId=${teamId}&userId=${userId}`);
  console.log("url: ", `/api/teams/checkUserInTeam?teamId=${teamId}&userId=${userId}`)
  if (response.ok) {
      const { isMember } = await response.json();
      return isMember;
  }
  console.log(await response.json())

  throw new Error(`Failed to check if user is in team ${teamId}`);
};
