import { NextApiRequest, NextApiResponse } from "next";
import { Team } from "../../../types/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name } = req.query;

    if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Name parameter is required and should be a string" });
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/rest/teams/simplified/search/${name}`);

        if (!response.ok) {
            throw new Error(`Failed to search simplified teams with name: ${name}`);
        }

        const team: Team = await response.json();
        res.status(200).json(team); // Send back the simplified team info
    } catch (error) {
        console.error("Error searching simplified teams by name:", error);
        res.status(500).json({ error: "Failed to retrieve simplified team data" });
    }
}