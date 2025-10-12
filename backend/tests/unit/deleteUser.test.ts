import type { NextFunction, Request, Response } from "express";

jest.mock("../../prisma/client", () => ({
	users: {
		delete: jest.fn(),
	},
}));

import deleteUser from "../../controllers/user/deleteUser.js";
import prisma from "../../prisma/client.js";

function mockReqBody({ body = {}, params = {}, query = {} }: any = {}) {
	const req = {
		body,
		params,
		query,
	} as unknown as Request;
	const res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	} as unknown as Response;
	const next = jest.fn() as unknown as NextFunction;
	return { req, res, next };
}
describe("deleteUser (unit)", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	it("deleteUser OK status 200", async () => {
		const id = 1;
		const user = {
			id,
			full_name: "User",
			email: "user@example.com",
			phone_number: "1234567890",
			password: "hashed-password",
			role_id: 1,
			refreshToken: "refreshToken" as string,
		};
		(prisma.users.delete as jest.Mock).mockResolvedValue(user);
		const { req, res, next } = mockReqBody({ params: { id } });
		await deleteUser(req, res, next);
		expect(prisma.users.delete).toHaveBeenCalledWith({ where: { id } });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "deleted user successfully",
		});
		expect(next).not.toHaveBeenCalled();
	});
	it("deleteUser not found", async () => {
		const id = 1;
		(prisma.users.delete as jest.Mock).mockRejectedValue(
			Object.assign(new Error("User not found"), {
				code: "USER_NOT_DELETED",
			}),
		);
		const { req, res, next } = mockReqBody({ params: { id } });
		await deleteUser(req, res, next);
		expect(prisma.users.delete).toHaveBeenCalledWith({ where: { id } });
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 404,
				message: "User not deleted",
				code: "USER_NOT_DELETED",
				name: "User Error",
			}),
		);
	});
});
