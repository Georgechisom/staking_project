import { GraphQLClient } from "graphql-request";

// TODO: Replace with your actual Subgraph endpoint
// For The Graph hosted service: https://api.thegraph.com/subgraphs/name/<your-username>/<subgraph-name>
// For local development: http://localhost:8000/subgraphs/name/<subgraph-name>
export const SUBGRAPH_URL = import.meta.env.VITE_SUBGRAPH_QUERY_URL;

console.log("SUBGRAPH_URL", SUBGRAPH_URL);

export const client = new GraphQLClient(SUBGRAPH_URL, {
  headers: {
    // Add any required headers here
  },
});
