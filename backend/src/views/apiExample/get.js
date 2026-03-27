// 250303V


import path from "path";


const apiExample = async (req, res) => {
    try {
        if (req.query.d === "true") return res.sendFile(path.join(__dirname, "dracula.html"));
        else return res.sendFile(path.join(__dirname, "index.html"));
    } catch (error) {
        if (req.status_debug) {
            error["params"] = req.query || req.body;
            return res.status(500).json({ error });
        } else {
            return res.status(400).json({ error: "Erro inesperado" });
        }
    }
};


export default apiExample;
