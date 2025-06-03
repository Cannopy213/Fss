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
exports.storage = exports.MemStorage = void 0;
var MemStorage = /** @class */ (function () {
    function MemStorage() {
        this.goals = new Map();
        this.contributions = new Map();
        this.nftRewards = new Map();
        this.users = new Map();
        this.currentGoalId = 1;
        this.currentContributionId = 1;
        this.currentNftRewardId = 1;
        this.currentUserId = 1;
    }
    // Goals
    MemStorage.prototype.getGoal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.goals.get(id)];
            });
        });
    };
    MemStorage.prototype.getGoalsByCreator = function (creatorAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.goals.values()).filter(function (goal) { return goal.creatorAddress.toLowerCase() === creatorAddress.toLowerCase(); })];
            });
        });
    };
    MemStorage.prototype.getAllGoals = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.goals.values())];
            });
        });
    };
    MemStorage.prototype.createGoal = function (insertGoal) {
        return __awaiter(this, void 0, void 0, function () {
            var id, goal;
            return __generator(this, function (_a) {
                id = this.currentGoalId++;
                goal = __assign(__assign({}, insertGoal), { id: id, savedAmount: "0", isAchieved: false, contractGoalId: null, createdAt: new Date() });
                this.goals.set(id, goal);
                return [2 /*return*/, goal];
            });
        });
    };
    MemStorage.prototype.updateGoal = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var existingGoal, updatedGoal;
            return __generator(this, function (_a) {
                existingGoal = this.goals.get(id);
                if (!existingGoal)
                    return [2 /*return*/, undefined];
                updatedGoal = __assign(__assign({}, existingGoal), updates);
                this.goals.set(id, updatedGoal);
                return [2 /*return*/, updatedGoal];
            });
        });
    };
    // Contributions
    MemStorage.prototype.getContribution = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contributions.get(id)];
            });
        });
    };
    MemStorage.prototype.getContributionsByGoal = function (goalId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.contributions.values()).filter(function (contribution) { return contribution.goalId === goalId; })];
            });
        });
    };
    MemStorage.prototype.getContributionsByAddress = function (contributorAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.contributions.values()).filter(function (contribution) { return contribution.contributorAddress.toLowerCase() === contributorAddress.toLowerCase(); })];
            });
        });
    };
    MemStorage.prototype.createContribution = function (insertContribution) {
        return __awaiter(this, void 0, void 0, function () {
            var id, contribution, goal, newSavedAmount, targetAmount, savedAmount, isAchieved;
            return __generator(this, function (_a) {
                id = this.currentContributionId++;
                contribution = __assign(__assign({}, insertContribution), { id: id, createdAt: new Date() });
                this.contributions.set(id, contribution);
                goal = this.goals.get(contribution.goalId);
                if (goal) {
                    newSavedAmount = (parseFloat(goal.savedAmount) + parseFloat(contribution.amount)).toString();
                    targetAmount = parseFloat(goal.targetAmount);
                    savedAmount = parseFloat(newSavedAmount);
                    isAchieved = savedAmount >= (targetAmount * 0.8);
                    this.goals.set(goal.id, __assign(__assign({}, goal), { savedAmount: newSavedAmount, isAchieved: isAchieved }));
                }
                return [2 /*return*/, contribution];
            });
        });
    };
    // NFT Rewards
    MemStorage.prototype.getNftReward = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nftRewards.get(id)];
            });
        });
    };
    MemStorage.prototype.getNftRewardsByGoal = function (goalId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.nftRewards.values()).filter(function (reward) { return reward.goalId === goalId; })];
            });
        });
    };
    MemStorage.prototype.getNftRewardsByAddress = function (recipientAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.nftRewards.values()).filter(function (reward) { return reward.recipientAddress.toLowerCase() === recipientAddress.toLowerCase(); })];
            });
        });
    };
    MemStorage.prototype.createNftReward = function (insertNftReward) {
        return __awaiter(this, void 0, void 0, function () {
            var id, nftReward;
            return __generator(this, function (_a) {
                id = this.currentNftRewardId++;
                nftReward = __assign(__assign({}, insertNftReward), { id: id, createdAt: new Date() });
                this.nftRewards.set(id, nftReward);
                return [2 /*return*/, nftReward];
            });
        });
    };
    // Users (existing methods)
    MemStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.users.get(id)];
            });
        });
    };
    MemStorage.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.users.values()).find(function (user) { return user.username === username; })];
            });
        });
    };
    MemStorage.prototype.createUser = function (insertUser) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user;
            return __generator(this, function (_a) {
                id = this.currentUserId++;
                user = __assign(__assign({}, insertUser), { id: id });
                this.users.set(id, user);
                return [2 /*return*/, user];
            });
        });
    };
    return MemStorage;
}());
exports.MemStorage = MemStorage;
exports.storage = new MemStorage();
