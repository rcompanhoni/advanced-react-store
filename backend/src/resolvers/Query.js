const { forwardTo } = require('prisma-binding');

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
    }
};

module.exports = Query;
