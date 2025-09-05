import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      avatarUrl
      city
      lat
      lng
      bio
      role
      ratingAvg
      skills {
        skill {
          id
          name
        }
      }
    }
  }
`;

export const GET_SKILLS = gql`
  query GetSkills {
    skills {
      id
      name
    }
  }
`;

export const SEARCH_REQUESTS = gql`
  query SearchRequests($input: SearchRequestsInput!) {
    searchRequests(input: $input) {
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
      distance
      requester {
        id
        name
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
        }
      }
    }
  }
`;

export const GET_REQUEST = gql`
  query GetRequest($id: String!) {
    request(id: $id) {
      id
      title
      description
      category
      isPaid
      budgetCents
      status
      scheduledFrom
      scheduledTo
      city
      lat
      lng
      imageUrls
      createdAt
      requesterId
      requester {
        id
        name
        avatarUrl
        ratingAvg
      }
      applications {
        id
        message
        status
        createdAt
        helper {
          id
          name
          avatarUrl
          ratingAvg
        }
      }
      messages {
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
  }
`;

export const GET_MESSAGES_BY_REQUEST = gql`
  query GetMessagesByRequest($requestId: String!) {
    messagesByRequest(requestId: $requestId) {
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

export const GET_MY_APPLICATIONS = gql`
  query GetMyApplications {
    myApplications {
      id
      message
      status
      createdAt
      request {
        id
        title
        description
        category
        status
        createdAt
        requester {
          id
          name
          avatarUrl
        }
      }
    }
  }
`;