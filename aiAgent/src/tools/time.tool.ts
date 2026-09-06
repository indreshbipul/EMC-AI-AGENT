const getCurrentTime = async (timeZone = "Asia/Kolkata") => {
    try {
        const now = new Date();

        const formatted = new Intl.DateTimeFormat("en-IN", {
            timeZone,
            dateStyle: "full",
            timeStyle: "long"
        }).format(now);

        return {
            status: "success",
            message: formatted,
            timestamp: now.toISOString(),
            timeZone
        };
    } catch (err) {
        return {
            status: "failed",
            message: String(err)
        };
    }
};

export default getCurrentTime