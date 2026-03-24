/**
 * Organization API - organizations, activities, assessments, members
 * Shared across org-mfe, AutoForge, etc.
 * Calls organization service directly (same URL as backend)
 */
import { createApiClient, createApiRequests } from '@nuxt-mfe/shared/api'

const ORG_PREFIX = '/api/v1/organizations'

export interface Organization {
  id: string
  name: string
  slug: string
  created_at?: string
  updated_at?: string
}

export interface Activity {
  id: number
  organization_id: string
  type: string
  name: string
  slug: string
  status: string
  created_at?: string
  updated_at?: string
}

export interface Assessment {
  id: number
  organization_id: string
  name: string
  slug: string
  description?: string | null
  duration_minutes: number
  status: string
  created_at?: string
  updated_at?: string
}

export interface OrgMember {
  id: number
  organization_id: string
  user_id: string | null
  role: string
  invited_email?: string | null
}

export function useOrganizationApi() {
  const config = useRuntimeConfig()
  const orgBase = (config.public.orgApiBase as string) || 'http://localhost:8007'
  const tokenCookie = useCookie<string | null>('auth-token')
  const client = createApiClient(orgBase, { getAuthToken: () => tokenCookie.value })
  const { get, post, patch, delete: del } = createApiRequests(client)

  const listOrgs = (params?: { limit?: number; offset?: number }) =>
    get<{ items: Organization[]; total: number }>(ORG_PREFIX, { params })

  const getOrg = (orgId: string) =>
    get<Organization>(`${ORG_PREFIX}/${orgId}`)

  const getOrgBySlug = (slug: string) =>
    get<Organization>(`${ORG_PREFIX}/by-slug/${slug}`)

  const createOrg = (body: { name: string; slug: string }) =>
    post<Organization>(ORG_PREFIX, body)

  const updateOrg = (orgId: string, body: { name?: string; slug?: string }) =>
    patch<Organization>(`${ORG_PREFIX}/${orgId}`, body)

  const deleteOrg = (orgId: string) =>
    del<{ deleted: boolean; id: string }>(`${ORG_PREFIX}/${orgId}`)

  const listActivities = (orgId: string, params?: { type?: string; limit?: number; offset?: number }) =>
    get<{ items: Activity[]; total: number }>(`${ORG_PREFIX}/${orgId}/activities`, { params })

  const createActivity = (orgId: string, body: { organization_id: string; type: string; name: string; slug: string; status?: string }) =>
    post<Activity>(`${ORG_PREFIX}/${orgId}/activities`, { ...body, organization_id: orgId })

  const listAssessments = (orgId: string, params?: { limit?: number; offset?: number }) =>
    get<{ items: Assessment[]; total: number }>(`${ORG_PREFIX}/${orgId}/assessments`, { params })

  const createAssessment = (orgId: string, body: { organization_id: string; name: string; slug: string; description?: string; duration_minutes: number; status?: string }) =>
    post<Assessment>(`${ORG_PREFIX}/${orgId}/assessments`, { ...body, organization_id: orgId })

  const listMembers = (orgId: string, params?: { limit?: number; offset?: number }) =>
    get<{ items: OrgMember[]; total: number }>(`${ORG_PREFIX}/${orgId}/members`, { params })

  const listInvitations = (orgId: string, params?: { status?: string }) =>
    get<{ items: unknown[] }>(`${ORG_PREFIX}/${orgId}/invitations`, { params })

  const inviteMember = (orgId: string, body: { email: string; role: string }) =>
    post(`${ORG_PREFIX}/${orgId}/invitations`, body)

  return {
    listOrgs,
    getOrg,
    getOrgBySlug,
    createOrg,
    updateOrg,
    deleteOrg,
    listActivities,
    createActivity,
    listAssessments,
    createAssessment,
    listMembers,
    listInvitations,
    inviteMember,
  }
}
