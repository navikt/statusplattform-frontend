import { NextApiRequest, NextApiResponse } from "next";
import { Team } from "../../../types/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { teamId } = req.query;

    if (!teamId || typeof teamId !== "string") {
        return res.status(400).json({ error: "TeamId parameter is required and should be a string" });
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/rest/teams/${teamId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch team with ID: ${teamId}`);
        }

        const team: Team = await response.json();
        res.status(200).json(team);
    } catch (error) {
        console.error(`Error fetching team by ID ${teamId}:`, error);
        res.status(500).json({ error: "Failed to retrieve team data" });
    }
}