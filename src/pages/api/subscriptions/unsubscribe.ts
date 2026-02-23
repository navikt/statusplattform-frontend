import { NextApiRequest, NextApiResponse } from "next";

const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ error: "Token required" });
    }

    try {
        const response = await fetch(`${backendPath}/rest/Subscription/Unsubscribe/${token}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const responseBody = await response.json();
        res.status(response.status).json(responseBody);
    } catch (error) {
        console.error("Error unsubscribing:", error);
        res.status(500).json({ error: "Failed to unsubscribe" });
    }
};
