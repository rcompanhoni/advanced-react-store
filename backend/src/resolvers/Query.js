const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parents, args, ctx, info) {
        // check if the userId is set in the request (from the cookie)
        if (!ctx.request.userId) {
            return null;
        }

        return ctx.db.query.user({ 
            where: { id: ctx.request.userId }
        }, info)
    },
    async users(parent, args, ctx, info) {
        // check if the user is logged in
        if (!ctx.request.userId) {
            throw new Error('You must be logged in!');
        }

        // check if the user has the permissions to query all users
        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

        // query all the users
        return ctx.db.query.users({}, info);
    }
};

module.exports = Query;
