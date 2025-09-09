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
      reporter {
        id
        name
        email
        avatarUrl
      }
      targetUser {
        id
        name
        email
        avatarUrl
        ratingAvg
        isActive
      }
      request {
        id
        title
        description
        category
        status
        requester {
          id
          name
          avatarUrl
        }
      }
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

// Request management queries
export const GET_ALL_REQUESTS_FOR_ADMIN = gql`
  query GetAllRequestsForAdmin {
    getAllRequestsForAdmin {
      id
      title
      description
      category
      status
      isPaid
      budgetCents
      city
      createdAt
      updatedAt
      requester {
        id
        name
        email
        avatarUrl
        ratingAvg
      }
      applications {
        id
        status
        helper {
          id
          name
          avatarUrl
          ratingAvg
        }
      }
      _count {
        applications
        messages
        reviews
      }
    }
  }
`;

export const ADMIN_CANCEL_REQUEST = gql`
  mutation AdminCancelRequest($requestId: String!, $adminNotes: String) {
    adminCancelRequest(requestId: $requestId, adminNotes: $adminNotes) {
      id
      status
    }
  }
`;

export const ADMIN_PUT_REQUEST_ON_STANDBY = gql`
  mutation AdminPutRequestOnStandby($requestId: String!, $adminNotes: String) {
    adminPutRequestOnStandby(requestId: $requestId, adminNotes: $adminNotes) {
      id
      status
    }
  }
`;

export const ADMIN_REQUEST_IMPROVEMENT = gql`
  mutation AdminRequestImprovement($requestId: String!, $adminNotes: String) {
    adminRequestImprovement(requestId: $requestId, adminNotes: $adminNotes) {
      id
      status
    }
  }
`;

export const ADMIN_REOPEN_REQUEST = gql`
  mutation AdminReopenRequest($requestId: String!, $adminNotes: String) {
    adminReopenRequest(requestId: $requestId, adminNotes: $adminNotes) {
      id
      status
    }
  }
`;

export const ADMIN_DELETE_REQUEST = gql`
  mutation AdminDeleteRequest($requestId: String!) {
    adminDeleteRequest(requestId: $requestId)
  }
`;

