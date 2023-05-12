const Query = require('../queries/query');
const Command = require('./command');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const { NotFoundError, ConflictError, BadRequestError } = require('../../../../helpers/error');
const uuid = require('uuid/v4');

class User {

    constructor(db) {
        this.command = new Command(db);
        this.query = new Query(db);
    }

    async registerUser(payload) {
        const { email, adminName, username, password } = payload;

        const existingUsername = await this.query.findOne({ username, isDeleted: false });
        if (existingUsername.data) return wrapper.error(new ConflictError('Username sudah digunakan'));

        const existingEmail = await this.query.findOne({ email, isDeleted: false });
        if (existingEmail.data) return wrapper.error(new ConflictError('Email sudah digunakan'));

        const date = new Date().toISOString();
        const data = {
            userId: uuid(),
            email,
            adminName,
            username,
            password,
            isDeleted: false,
            createdAt: date,
            modifiedAt: date
        };

        const { data: result, err } = await this.command.insertOne(data);
        if (err) {
            return wrapper.error(new BadRequestError('Failed to register user.'));
        }

        return wrapper.data(result);
    }

    async login(payload) {
        const ctx = 'domain-login';
        const { username, password } = payload;

        const user = await this.query.findOne({ username, isDeleted: false });
        if (user.err) {
            logger.log(ctx, false, 'User not found');
            return wrapper.error(new ConflictError('User not found'));
        }

        if (username === user.data.username && password === user.data.password) {
            return wrapper.data(user.data);
        } else if (username === user.data.email && password === user.data.password) {
            return wrapper.data(user.data);
        } else {
            return wrapper.error(new ConflictError('Username and password didn\'t match'));
        }
    }

    async updateUser(payload) {
        const ctx = 'domain-updateUser';
        const { userId, adminName, username, email } = payload;

        const user = await this.query.findOne({ userId, isDeleted: false });
        if (user.err) {
            logger.log(ctx, false, 'User not found');
            return wrapper.error(new ConflictError('User not found'));
        }

        const existingUsername = await this.query.findOne({ username, isDeleted: false });
        if (existingUsername.data && userId !== existingUsername.data.userId)
            return wrapper.error(new ConflictError('Username sudah digunakan'));

        const existingEmail = await this.query.findOne({ email, isDeleted: false });
        if (existingEmail.data && userId !== existingUsername.data.userId)
            return wrapper.error(new ConflictError('Email sudah digunakan'));

        const data = {
            $set: {
                adminName,
                username,
                email,
                isDeleted: false,
                modifiedAt: new Date().toISOString()
            }
        };

        const updateUser = await this.command.upsertOne({ userId }, data);
        if (updateUser.err) {
            return wrapper.error(new BadRequestError('Failed to update data.'));
        }

        return wrapper.data(updateUser.data);
    }

    async changePassword(payload) {
        const ctx = 'domain-changePassword';
        const { userId, oldPassword, newPassword } = payload;

        const user = await this.query.findOne({ userId, isDeleted: false });
        if (user.err) {
            logger.log(ctx, false, 'User not found');
            return wrapper.error(new ConflictError('User not found'));
        }

        if (oldPassword !== user.data.password) {
            return wrapper.error(new ConflictError('Password lama tidak sesuai'));
        }

        const data = {
            $set: {
                newPassword,
                isDeleted: false,
                modifiedAt: new Date().toISOString()
            }
        };

        const changePassword = await this.command.upsertOne({ userId }, data);
        if (changePassword.err) {
            return wrapper.error(new BadRequestError('Failed to update data.'));
        }

        return wrapper.data(changePassword.data);
    }

    async deleteUser(payload) {
        const ctx = 'domain-deleteUser';
        const { userId } = payload;

        const user = await this.query.findOne({
            userId
        });

        if (user.err) {
            logger.log(ctx, false, 'user can\'t be found..');
            return wrapper.error(new NotFoundError('user can\'t be found..'));
        }


        const document = {
            $set: {
                isDeleted: true,
                modifiedAt: new Date().toISOString()
            }
        };

        const { data: result, err } = await this.command.upsertOne({ userId }, document);
        if (err) {
            logger.log(ctx, 'Failed to update data.', err);
            return wrapper.error(new BadRequestError('Failed to update data.'));
        }

        return wrapper.data(result);
    }
}

module.exports = User;
