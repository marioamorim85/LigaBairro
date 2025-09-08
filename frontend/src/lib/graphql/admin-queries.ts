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
      monthlyGrowth {
        users
        requests
      }
      userActivity {
        activeToday
        activeThisWeek
      }
      recentActivity {
        newUsers
        newRequests
        newApplications
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
      adminNotes
    }
  }
`;

export const GET_USERS_FOR_MANAGEMENT = gql`
  query GetUsersForManagement {
    usersForManagement {
      id
      name
      email
      avatarUrl
      role
      isActive
      createdAt
      totalRequests
      totalApplications
      averageRating
    }
  }
`;

export const GET_ACTIVITY_REPORT = gql`
  query GetActivityReport($days: Int = 30) {
    activityReport(days: $days) {
      date
      newUsers
      newRequests
      newApplications
      completedRequests
      totalMessages
    }
  }
`;

export const RESOLVE_REPORT = gql`
  mutation ResolveReport($reportId: String!, $action: String!, $adminNotes: String) {
    resolveReport(reportId: $reportId, action: $action, adminNotes: $adminNotes)
  }
`;

export const DISMISS_REPORT = gql`
  mutation DismissReport($reportId: String!, $adminNotes: String) {
    dismissReport(reportId: $reportId, adminNotes: $adminNotes)
  }
`;

export const TOGGLE_USER_STATUS = gql`
  mutation ToggleUserStatus($userId: String!) {
    toggleUserStatus(userId: $userId)
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: String!, $newRole: String!) {
    updateUserRole(userId: $userId, newRole: $newRole)
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: String!) {
    deleteUser(userId: $userId)
  }
`;

