// 250129V

// import { indexAdmin } from "../templates";

const home = async (req, res) => {

    try {
        return res.send("<h1>TAMO TUDO DIBOAAA 😎</h1><br><p>Que a força esteja com você!</p>");
        // return res.redirect("LINK-AQUI");

    } catch (error) {

        if (req.status_debug) {
            error["params"] = req.query || req.body;
            return res.status(500).json({ error: error });
        } else {
            return res.status(400).json({ error: 'Erro inesperado' });
        }
    }

};

export default home;