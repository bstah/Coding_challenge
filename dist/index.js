"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const node_cache_1 = __importDefault(require("node-cache"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const cache = new node_cache_1.default();
const port = process.env.PORT || 8080; // default port to listen
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.raw());
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield axios_1.default.get("https://reqres.in/api/users?page=2");
        let usersData = users.data.data;
        if (users) {
            let success = true;
            usersData.forEach((item) => {
                const isSuccess = cache.set(item.id, item);
                if (!isSuccess)
                    success = false;
            });
            if (success)
                return res.json({ message: "successfully got users", data: usersData });
            return res.status(500).json({ message: "unable to set cache", data: usersData });
        }
        return res.status(500).json({ message: "unable to get users" });
    }
    catch (error) {
        return error;
    }
}));
app.post("/users/create", (req, res) => {
    let newUser = Object.assign({}, req.body);
    if (newUser.id) {
        const success = cache.set(newUser.id, newUser);
        if (success)
            return res.json({ message: "New user created", data: newUser });
        return res.status(500).json({ message: "unable to create user" });
    }
    return res.status(400).json({ message: "unable to create user" });
});
app.put("/users/update", (req, res) => {
    let updateUser = Object.assign({}, req.body);
    if (updateUser.id) {
        let oldUser = cache.take(updateUser.id);
        const success = cache.set(updateUser.id, updateUser);
        if (success)
            return res.json({ message: "successfully updated user", data: updateUser });
        cache.set(oldUser.id, oldUser);
        return res.status(500).json({ message: "unable to update user" });
    }
    return res.status(400).json({ message: "unable to update user" });
});
app.delete("/users/delete/:id", (req, res) => {
    let value = cache.del(req.params.id);
    if (value > 0)
        return res.json({ message: "success", data: value });
    return res.status(400).json({ message: "unable to delete user" });
});
// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map