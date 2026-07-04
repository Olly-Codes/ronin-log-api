const getStatus = (req, res) => {
    res.status(200).json({ message: "Ronin Log API is running" });
}

export default {
    getStatus
}