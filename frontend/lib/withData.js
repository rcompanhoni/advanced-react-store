import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';

// creates an Apollo Client which consumes the 'endpoint' GraphQL API
function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    // local data
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, { cache }) {
            // read the cartOpen value from the cache
            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY
            });

            // write the cart state to its opposite value
            const data = {
              data: { cartOpen: !cartOpen }
            };

            cache.writeData(data);
            return data;
          }
        }
      },
      defaults: {
        cartOpen: false,
      }
    }
  });
}

// encapsulates with 'withApollo' so we can inject the client in the React app
export default withApollo(createClient);
