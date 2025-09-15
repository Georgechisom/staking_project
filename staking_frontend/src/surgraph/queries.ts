import { gql } from "graphql-request";

// Query for global metrics
export const GET_CONTRACT_DETAILS = gql`
  query GetContractDetails {
    contractDetails(id: "0x46c0f03e08f82511fe9ec413e5759e707762fba2") {
      totalMinted
      totalStakes
      totalRewardsGiven
      totalWithdrawn
    }
  }
`;

export const GET_TOTAL_TRANSACTIONS = gql`
  query GetTotalTransactions {
    transactions(first: 1, orderBy: totalTransactions, orderDirection: desc) {
      totalTransactions
    }
  }
`;

export const GET_ACTIVE_USERS = gql`
  query GetActiveUsers {
    stakeds {
      user
    }
  }
`;

// Query for user-specific data
export const GET_USER_STAKES = gql`
  query GetUserStakes($user: Bytes!) {
    stakeds(where: { user: $user }) {
      amount
      timestamp
      newTotalStaked
    }
  }
`;

export const GET_USER_WITHDRAWALS = gql`
  query GetUserWithdrawals($user: Bytes!) {
    withdraws(where: { user: $user }) {
      amount
      timestamp
      rewardsAccrued
    }
    emergencyWithdrawns(where: { user: $user }) {
      amount
      penalty
      timestamp
    }
  }
`;

export const GET_USER_CLAIMS = gql`
  query GetUserClaims($user: Bytes!) {
    rewardsClaimeds(where: { user: $user }) {
      amount
      timestamp
    }
  }
`;

export const GET_USER_TOTAL_STAKED = gql`
  query GetUserTotalStaked($user: Bytes!) {
    stakeds(
      where: { user: $user }
      orderBy: timestamp
      orderDirection: desc
      first: 1
    ) {
      newTotalStaked
    }
  }
`;
