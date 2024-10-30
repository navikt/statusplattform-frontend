const apiPath = "/sp/api/teamkatalog";
import { Team } from "../types/types";



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
  
export const searchSimplifiedTeamsByName = async (name: string): Promise<Team> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/rest/teams/simplified/search/${name}`);
  
      if (!response.ok) {
        throw new Error(`Failed to search simplified teams with name: ${name}`);
      }
  
      const team: Team = await response.json();
      return team; // This should return a simplified team info object
    } catch (error) {
      console.error('Error searching simplified teams by name:', error);
      return null;
    }
};
  
export const getTeamById = async (id: string): Promise<Team> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/rest/teams/${id}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch team with ID: ${id}`);
      }
  
      const team: Team = await response.json();
      return team; // This should return a team info object
    } catch (error) {
      console.error('Error fetching team by ID:', error);
      return null;
    }
};
  
export const isUserInTeam = async (teamId, userId): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/rest/teams/check-user?team_id=${teamId}&user_id=${userId}`);
  
      if (!response.ok) {
        throw new Error('Failed to check if user is in team');
      }
  
      const isMember: boolean = await response.json();
      return isMember; 
        
    } catch (error) {
      console.error('Error checking if user is in team:', error);
      return false;
    }
  };
