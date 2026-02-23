import { NextApiRequest, NextApiResponse } from "next";

const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const response = await fetch(`${backendPath}/rest/Subscription/VerifyOtp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });

        const responseBody = await response.json();
        res.status(response.status).json(responseBody);
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ error: "Failed to verify OTP" });
    }
};
