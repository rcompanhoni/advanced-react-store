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
    },
    async order(parent, args, ctx, info) {
        // make sure the user is logged in
        if (!ctx.request.userId) {
            throw new Error('You are not logged in');
        }

        // query the current order
        const order = await ctx.db.query.order({
            where: { id: args.id }
        }, info);

        // check if the user has the permission to see the order
        const ownsOrder = order.user.id === ctx.request.userId;
        const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');
        if(!ownsOrder || !hasPermissionToSeeOrder) {
            throw new Error("You don't have permission");
        }

        // return the order
        return order;
    },
    async orders(parent, args, ctx, info) {
        // make sure the user is logged in
        const { userId } = ctx.request;
         if (!userId) {
            throw new Error('You are not logged in');
        }

        return ctx.db.query.orders({
            where: {
                user: { id: userId }
            }
        }, info);
    }
};

module.exports = Query;
