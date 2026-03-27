// 250211V


import { rateLimitSimple, rateLimitWithSlow } from '../middleware/reqlimiters/index.js';
import { isAuth } from '../middleware/auth/index.js';


class urls {
    constructor(server) {
        this.server = server;
        this.rotas();
    }
    rotas() {
        // VIEW
        this.server.get("/", require('../views/home.js').default);
        this.server.get("/docs/api", require('../views/apiExample/get.js').default); // REVER
        this.server.get("/email/:type", require('../views/testEmail/get.js').default); // REVER
        this.server.get("/diboa", require('../views/diboa.js').default); // REVER
        this.server.get("/starwars", require('../views/sw.js').default); // REVER


        // AUTH
        this.server.post("/auth/signup", rateLimitSimple({ max: 5, tempo: 120 }), require('../controllers/auth/signup.js').default);
        this.server.post("/auth/signin", rateLimitSimple({ max: 5, tempo: 120 }), require('../controllers/auth/signin.js').default);
        this.server.post("/auth/send-otp", rateLimitSimple({ max: 5, tempo: 120 }), require('../controllers/auth/sendOTP.js').default);
        this.server.post("/auth/check-otp", rateLimitSimple({ max: 5, tempo: 120 }), require('../controllers/auth/checkOTP.js').default);
        this.server.post("/auth/logout", isAuth, rateLimitSimple({ max: 5, tempo: 120 }), require('../controllers/auth/logout.js').default);


        // API
        // ACCOUNT
        this.server.put("/api/account", isAuth, rateLimitSimple({ max: 10, tempo: 120 }), require('../controllers/account/put.js').default);
        this.server.put("/api/account/picture", isAuth, rateLimitSimple({ max: 10, tempo: 120 }), require('../controllers/account/picture.js').default);
        this.server.delete("/api/account/picture", isAuth, rateLimitSimple({ max: 10, tempo: 120 }), require('../controllers/account/picture.js').default);
        this.server.delete("/api/account", isAuth, rateLimitSimple({ max: 5, tempo: 120 }), require('../controllers/account/delete.js').default);


        // PROVIDER
        this.server.get("/search", rateLimitSimple({ max: 50, tempo: 120 }), require('../controllers/provider/search.js').default);
        this.server.post("/api/provider/file", isAuth, rateLimitSimple({ max: 10, tempo: 120 }), require('../controllers/provider/file.js').default);
        this.server.delete("/api/provider/file/:file_id", isAuth, rateLimitSimple({ max: 10, tempo: 120 }), require('../controllers/provider/file.js').default);

        this.server.get("/api/provider/work", isAuth, rateLimitSimple({ max: 20, tempo: 120 }), require('../controllers/provider/work.js').default);
        this.server.post("/api/provider/work", isAuth, rateLimitSimple({ max: 10, tempo: 120 }), require('../controllers/provider/work.js').default);
        this.server.put("/api/provider/work/:work_id", isAuth, rateLimitSimple({ max: 10, tempo: 120 }), require('../controllers/provider/work.js').default);
        this.server.delete("/api/provider/work/:work_id", isAuth, rateLimitSimple({ max: 10, tempo: 120 }), require('../controllers/provider/work.js').default);

        this.server.get("/api/provider", isAuth, rateLimitSimple({ max: 35, tempo: 120 }), require('../controllers/provider/get.js').default);
        this.server.get("/api/provider/:provider_id", rateLimitSimple({ max: 35, tempo: 120 }), require('../controllers/provider/get.js').default);


        // INTERACTIONS
        // this.server.get("/api/interactions/favorite", isAuth, rateLimitSimple({ max: 20, tempo: 120 }), require('../controllers/interactions/favorite.js').default);
        // this.server.post("/api/interactions/favorite", isAuth, rateLimitSimple({ max: 5, tempo: 120 }), require('../controllers/interactions/favorite.js').default);

        this.server.get("/api/interactions/complaint", isAuth, rateLimitSimple({ max: 20, tempo: 120 }), require('../controllers/interactions/complaint.js').default);
        this.server.post("/api/interactions/complaint", rateLimitSimple({ max: 1, tempo: 1 }), require('../controllers/interactions/complaint.js').default);
        // DESATIVADO // this.server.delete("/api/interactions/complaint/:complaint_id", isAuth, rateLimitSimple({ max: 5, tempo: 120 }), require('../controllers/interactions/complaint.js').default);


        // BUSINESS
        this.server.get("/api/location", rateLimitSimple({ max: 25, tempo: 120 }), require('../controllers/business/getLocation.js').default);
        this.server.get("/api/service", rateLimitSimple({ max: 25, tempo: 120 }), require('../controllers/business/getService.js').default);
        this.server.get("/api/plan", rateLimitSimple({ max: 25, tempo: 120 }), require('../controllers/business/getPlan.js').default);

        this.server.post("/api/payment/send", isAuth, rateLimitSimple({ max: 10, tempo: 120 }), require('../controllers/business/sendPayment.js').default);
        this.server.get("/api/payment/check", rateLimitSimple({ max: 30, tempo: 120 }), require('../controllers/business/checkPayment.js').default);
    }
}

export default urls;