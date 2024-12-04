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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessLogic = void 0;
// user-service/server/business-logic.ts
const data_source_1 = require("./data-source");
const user_1 = require("./model/user");
const MAX_RETRIES = 3; // Number of retries
const RETRY_DELAY_MS = 1000; // Delay between retries in milliseconds
function retryableOperation(operation) {
    return __awaiter(this, void 0, void 0, function* () {
        let attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                return yield operation();
            }
            catch (error) {
                attempt++;
                if (attempt >= MAX_RETRIES)
                    throw error; // Rethrow if max retries reached
                console.warn(`Retrying... Attempt ${attempt}`);
                yield new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS)); // Wait before next attempt
            }
        }
    });
}
exports.BusinessLogic = {
    createUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield retryableOperation(() => __awaiter(void 0, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(user_1.User);
            // Convert email to uppercase
            if (userData.EmailAddress) {
                userData.EmailAddress = userData.EmailAddress.toUpperCase();
            }
            const newUser = userRepository.create(userData);
            return yield userRepository.save(newUser);
        }));
    }),
    getUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield retryableOperation(() => __awaiter(void 0, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(user_1.User);
            return yield userRepository.find();
        }));
    }),
    getUserById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield retryableOperation(() => __awaiter(void 0, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(user_1.User);
            return yield userRepository.findOneBy({ ID: id });
        }));
    }),
    deleteUser: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield retryableOperation(() => __awaiter(void 0, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(user_1.User);
            return yield userRepository.delete(id);
        }));
    }),
};
