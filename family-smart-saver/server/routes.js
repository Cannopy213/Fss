"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
var http_1 = require("http");
var storage_1 = require("./storage");
var schema_1 = require("@shared/schema");
var zod_1 = require("zod");
function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            // Get all goals for a user
            app.get("/api/goals/:userAddress?", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userAddress, goals, goalsWithProgress, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            userAddress = req.params.userAddress;
                            goals = void 0;
                            if (!userAddress) return [3 /*break*/, 2];
                            return [4 /*yield*/, storage_1.storage.getGoalsByCreator(userAddress)];
                        case 1:
                            goals = _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, storage_1.storage.getAllGoals()];
                        case 3:
                            goals = _a.sent();
                            _a.label = 4;
                        case 4:
                            goalsWithProgress = goals.map(function (goal) {
                                var progress = Math.round((parseFloat(goal.savedAmount) / parseFloat(goal.targetAmount)) * 100);
                                var now = new Date();
                                var deadline = new Date(goal.deadline);
                                var daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                var status = 'active';
                                if (goal.isAchieved) {
                                    status = 'achieved';
                                }
                                else if (now > deadline) {
                                    status = 'expired';
                                }
                                else if (daysRemaining <= 7) {
                                    status = 'near_deadline';
                                }
                                return __assign(__assign({}, goal), { progress: progress, status: status, deadline: goal.deadline.toISOString() });
                            });
                            res.json(goalsWithProgress);
                            return [3 /*break*/, 6];
                        case 5:
                            error_1 = _a.sent();
                            console.error("Error fetching goals:", error_1);
                            res.status(500).json({ message: "Failed to fetch goals" });
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
            // Create a new goal
            app.post("/api/goals", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var validatedData, goal, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            validatedData = schema_1.insertGoalSchema.parse(req.body);
                            return [4 /*yield*/, storage_1.storage.createGoal(validatedData)];
                        case 1:
                            goal = _a.sent();
                            res.status(201).json(goal);
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            if (error_2 instanceof zod_1.z.ZodError) {
                                res.status(400).json({ message: "Invalid goal data", errors: error_2.errors });
                            }
                            else {
                                console.error("Error creating goal:", error_2);
                                res.status(500).json({ message: "Failed to create goal" });
                            }
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get goal by ID
            app.get("/api/goals/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, goal, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.getGoal(id)];
                        case 1:
                            goal = _a.sent();
                            if (!goal) {
                                return [2 /*return*/, res.status(404).json({ message: "Goal not found" })];
                            }
                            res.json(goal);
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            console.error("Error fetching goal:", error_3);
                            res.status(500).json({ message: "Failed to fetch goal" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Update a goal
            app.put("/api/goals/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, updates, updatedGoal, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            updates = req.body;
                            return [4 /*yield*/, storage_1.storage.updateGoal(id, updates)];
                        case 1:
                            updatedGoal = _a.sent();
                            if (!updatedGoal) {
                                return [2 /*return*/, res.status(404).json({ message: "Goal not found" })];
                            }
                            res.json(updatedGoal);
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            console.error("Error updating goal:", error_4);
                            res.status(500).json({ message: "Failed to update goal" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get contributions for a goal
            app.get("/api/contributions/:goalId?", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var goalId, address, contributions, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            goalId = req.params.goalId;
                            address = req.query.address;
                            contributions = void 0;
                            if (!goalId) return [3 /*break*/, 2];
                            return [4 /*yield*/, storage_1.storage.getContributionsByGoal(parseInt(goalId))];
                        case 1:
                            contributions = _a.sent();
                            return [3 /*break*/, 5];
                        case 2:
                            if (!address) return [3 /*break*/, 4];
                            return [4 /*yield*/, storage_1.storage.getContributionsByAddress(address)];
                        case 3:
                            contributions = _a.sent();
                            return [3 /*break*/, 5];
                        case 4: return [2 /*return*/, res.status(400).json({ message: "Either goalId or address parameter is required" })];
                        case 5:
                            res.json(contributions);
                            return [3 /*break*/, 7];
                        case 6:
                            error_5 = _a.sent();
                            console.error("Error fetching contributions:", error_5);
                            res.status(500).json({ message: "Failed to fetch contributions" });
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); });
            // Create a new contribution
            app.post("/api/contributions", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var validatedData, contribution, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            validatedData = schema_1.insertContributionSchema.parse(req.body);
                            return [4 /*yield*/, storage_1.storage.createContribution(validatedData)];
                        case 1:
                            contribution = _a.sent();
                            res.status(201).json(contribution);
                            return [3 /*break*/, 3];
                        case 2:
                            error_6 = _a.sent();
                            if (error_6 instanceof zod_1.z.ZodError) {
                                res.status(400).json({ message: "Invalid contribution data", errors: error_6.errors });
                            }
                            else {
                                console.error("Error creating contribution:", error_6);
                                res.status(500).json({ message: "Failed to create contribution" });
                            }
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get NFT rewards for a user or goal
            app.get("/api/nft-rewards", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, goalId, address, rewards, error_7;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 6, , 7]);
                            _a = req.query, goalId = _a.goalId, address = _a.address;
                            rewards = void 0;
                            if (!goalId) return [3 /*break*/, 2];
                            return [4 /*yield*/, storage_1.storage.getNftRewardsByGoal(parseInt(goalId))];
                        case 1:
                            rewards = _b.sent();
                            return [3 /*break*/, 5];
                        case 2:
                            if (!address) return [3 /*break*/, 4];
                            return [4 /*yield*/, storage_1.storage.getNftRewardsByAddress(address)];
                        case 3:
                            rewards = _b.sent();
                            return [3 /*break*/, 5];
                        case 4: return [2 /*return*/, res.status(400).json({ message: "Either goalId or address parameter is required" })];
                        case 5:
                            res.json(rewards);
                            return [3 /*break*/, 7];
                        case 6:
                            error_7 = _b.sent();
                            console.error("Error fetching NFT rewards:", error_7);
                            res.status(500).json({ message: "Failed to fetch NFT rewards" });
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); });
            // Create a new NFT reward
            app.post("/api/nft-rewards", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var validatedData, reward, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            validatedData = schema_1.insertNftRewardSchema.parse(req.body);
                            return [4 /*yield*/, storage_1.storage.createNftReward(validatedData)];
                        case 1:
                            reward = _a.sent();
                            res.status(201).json(reward);
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _a.sent();
                            if (error_8 instanceof zod_1.z.ZodError) {
                                res.status(400).json({ message: "Invalid NFT reward data", errors: error_8.errors });
                            }
                            else {
                                console.error("Error creating NFT reward:", error_8);
                                res.status(500).json({ message: "Failed to create NFT reward" });
                            }
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get recent activities (mock endpoint for demo)
            app.get("/api/activities", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var activities;
                return __generator(this, function (_a) {
                    try {
                        activities = [
                            {
                                id: 1,
                                type: 'contribution',
                                message: 'ساهم أحمد بـ 0.5 ETH في هدف "سيارة العائلة الجديدة"',
                                amount: '+0.5 ETH',
                                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                                icon: 'plus',
                                color: 'success'
                            },
                            {
                                id: 2,
                                type: 'achievement',
                                message: 'تم تحقيق هدف "إجازة العائلة الصيفية" وحصول على مكافأة NFT!',
                                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                                icon: 'trophy',
                                color: 'achievement'
                            },
                            {
                                id: 3,
                                type: 'goal_created',
                                message: 'تم إنشاء هدف جديد "تجديد المنزل"',
                                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                                icon: 'target',
                                color: 'secondary'
                            }
                        ];
                        res.json(activities);
                    }
                    catch (error) {
                        console.error("Error fetching activities:", error);
                        res.status(500).json({ message: "Failed to fetch activities" });
                    }
                    return [2 /*return*/];
                });
            }); });
            httpServer = (0, http_1.createServer)(app);
            return [2 /*return*/, httpServer];
        });
    });
}
