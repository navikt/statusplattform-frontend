import { NextApiRequest, NextApiResponse } from "next";

const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === "POST") {
            const response = await fetch(`${backendPath}/rest/Subscription`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req.body),
            });
            const responseBody = await response.json();
            return res.status(response.status).json(responseBody);
        }

        if (req.method === "GET") {
            const { token } = req.query;
            if (!token) {
                return res.status(400).json({ error: "Token required" });
            }
            const response = await fetch(`${backendPath}/rest/Subscription/${token}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const responseBody = await response.json();
            return res.status(response.status).json(responseBody);
        }

        if (req.method === "PUT") {
            const { token } = req.query;
            if (!token) {
                return res.status(400).json({ error: "Token required" });
            }
            const response = await fetch(`${backendPath}/rest/Subscription/${token}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req.body),
            });
            const responseBody = await response.json();
            return res.status(response.status).json(responseBody);
        }

        res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
        console.error("Error handling subscription:", error);
        res.status(500).json({ error: "Failed to handle subscription request" });
    }
};
