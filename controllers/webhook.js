const { Webhook } = require("svix");

exports.verifyWebhook = (req, res, next) => {
    const svixHeaders = {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
    };

    if (!svixHeaders["svix-id"] || !svixHeaders["svix-timestamp"] || !svixHeaders["svix-signature"]) {
        return res.status(400).json({ message: "Missing required Svix headers!" });
    }

    const secret = process.env.CLERK_WEBHOOK_SECRET; 
    const webhook = new Webhook(secret);

    try {
        req.body = webhook.verify(JSON.stringify(req.body), svixHeaders);
        next();
    } catch (err) {
        console.error("Webhook verification failed:", err.message);
        return res.status(401).json({ message: "Invalid webhook signature!" });
    }
};
