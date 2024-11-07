import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { teamId, userId } = req.query;

    if (!teamId || !userId || typeof teamId !== "string" || typeof userId !== "string") {
        return res.status(400).json({ error: "Both teamId and userId parameters are required and should be strings" });
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/rest/teams/check-user?team_id=${teamId}&user_id=${userId}`);

        if (!response.ok) {
            throw new Error("Failed to check if user is in team");
        }

        const isMember: boolean = await response.json();
        res.status(200).json({ isMember }); // Return isMember as JSON
    } catch (error) {
        console.error("Error checking if user is in team:", error);
        res.status(500).json({ error: "Failed to check user membership in team" });
    }
}