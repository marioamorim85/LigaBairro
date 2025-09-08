import { gql } from '@apollo/client';

export const CREATE_REQUEST = gql`
  mutation CreateRequest($input: CreateRequestInput!) {
    createRequest(input: $input) {
      id
      title
      description
      category
      isPaid
      budgetCents
      status
      city
      lat
      lng
      imageUrls
      createdAt
      requester {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateUserInput!) {
    updateProfile(input: $input) {
      id
      name
      bio
      avatarUrl
      lat
      lng
    }
  }
`;

export const UPDATE_USER_SKILLS = gql`
  mutation UpdateUserSkills($input: UpdateUserSkillsInput!) {
    updateUserSkills(input: $input) {
      id
      skills {
        skill {
          id
          name
        }
      }
    }
  }
`;

export const APPLY_TO_REQUEST = gql`
  mutation ApplyToRequest($input: ApplyToRequestInput!) {
    applyToRequest(input: $input) {
      id
      message
      status
      createdAt
      helper {
        id
        name
        avatarUrl
      }
      request {
        id
        title
      }
    }
  }
`;

export const ACCEPT_APPLICATION = gql`
  mutation AcceptApplication($applicationId: String!) {
    acceptApplication(applicationId: $applicationId) {
      id
      status
      helper {
        id
        name
        avatarUrl
      }
      request {
        id
        title
      }
    }
  }
`;

export const REMOVE_APPLICATION = gql`
  mutation RemoveApplication($applicationId: String!) {
    removeApplication(applicationId: $applicationId) {
      id
      success
      message
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      text
      createdAt
      sender {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const UPDATE_REQUEST_STATUS = gql`
  mutation UpdateRequestStatus($id: String!, $status: String!) {
    updateRequestStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const UPDATE_REQUEST = gql`
  mutation UpdateRequest($id: String!, $input: UpdateRequestInput!) {
    updateRequest(id: $id, input: $input) {
      id
      title
      description
      category
      isPaid
      budgetCents
      scheduledFrom
      scheduledTo
      imageUrls
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      requestId
      reviewerId
      revieweeId
      rating
      comment
      createdAt
    }
  }
`;

export const REPORT_USER = gql`
  mutation ReportUser($targetUserId: ID!, $reason: String!) {
    reportUser(targetUserId: $targetUserId, reason: $reason)
  }
`;

export const REPORT_REQUEST = gql`
  mutation ReportRequest($requestId: ID!, $reason: String!) {
    reportRequest(requestId: $requestId, reason: $reason)
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
