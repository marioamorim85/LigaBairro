import { gql } from '@apollo/client';

export const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    adminStats {
      totalUsers
      totalRequests
      activeRequests
      completedRequests
      totalApplications
      totalMessages
      pendingReports
      todayMessages
      averageRating
      topCategories {
        category
        count
      }
    }
  }
`;

export const GET_REPORTS = gql`
  query GetReports {
    reports {
      id
      reason
      details
      status
      createdAt
      reporterId
      targetUserId
      requestId
    }
  }
`;