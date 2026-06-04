type GitHubContentResponse = {
  sha?: string
  content?: string
  encoding?: string
}

type CommitFileInput = {
  path: string
  content: string
  message: string
  repository?: string
  encoding?: 'utf8' | 'base64'
  branchName?: string
  targetBranch?: string
  createPullRequest?: boolean
  prTitle?: string
  prBody?: string
}

export type PublicationResult = {
  github: {
    configured: boolean
    committed: boolean
    path?: string
    commitUrl?: string
    pullRequestUrl?: string
    error?: string
  }
  vercel: {
    configured: boolean
    triggered: boolean
    hookName?: string
    error?: string
  }
}

export function getPublishingStatus(siteId?: string) {
  return {
    githubReady: isGitHubConfigured(),
    repository: getRepositoryLabel(),
    branch: getGitHubBranch(),
    publishBranch: siteId ? getGitHubPublishBranchName(siteId) : undefined,
    vercelReady: Boolean(siteId ? getDeployHook(siteId) : getDeployHooksMap()),
  }
}

export async function publishShowcaseFile(
  siteId: string,
  input: CommitFileInput,
): Promise<PublicationResult> {
  const branchName = input.branchName ?? getGitHubPublishBranchName(siteId)
  const targetBranch = input.targetBranch ?? getGitHubBranch()
  const createPullRequest = input.createPullRequest ?? process.env.GITHUB_CREATE_PR === 'true'
  const deployOnBranch = process.env.GITHUB_DEPLOY_ON_BRANCH === 'true'

  const github = await commitFileToGitHub({ ...input, branchName, targetBranch, createPullRequest })
  const vercel = github.committed && (branchName === targetBranch || deployOnBranch)
    ? await triggerDeployHook(siteId)
    : {
        configured: Boolean(getDeployHook(siteId)),
        triggered: false,
        hookName: siteId,
      }

  return { github, vercel }
}

export function getPublishingBranchName(siteId: string) {
  return getGitHubPublishBranchName(siteId)
}

export async function triggerShowcaseDeploy(siteId: string) {
  return triggerDeployHook(siteId)
}

async function commitFileToGitHub(input: CommitFileInput): Promise<PublicationResult['github']> {
  if (!process.env.GITHUB_TOKEN) {
    return { configured: false, committed: false, path: input.path }
  }

  const token = process.env.GITHUB_TOKEN!
  const repository = input.repository ?? process.env.GITHUB_REPOSITORY
  const owner = repository?.split('/')[0] ?? process.env.GITHUB_OWNER
  const repo = repository?.split('/')[1] ?? process.env.GITHUB_REPO
  const branch = input.branchName ?? getGitHubBranch()
  const targetBranch = input.targetBranch ?? getGitHubBranch()
  if (!owner || !repo) {
    return {
      configured: false,
      committed: false,
      path: input.path,
      error: 'Depot GitHub non configure',
    }
  }

  try {
    if (branch !== targetBranch) {
      await ensureGitHubBranch(owner, repo, branch, targetBranch, token)
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodePath(input.path)}`
    const current = await fetch(`${url}?ref=${encodeURIComponent(branch)}`, {
      headers: githubHeaders(token),
      cache: 'no-store',
    })
    const currentData = current.ok ? (await current.json()) as GitHubContentResponse : null
    const content = input.encoding === 'base64'
      ? input.content
      : Buffer.from(input.content, 'utf8').toString('base64')

    const res = await fetch(url, {
      method: 'PUT',
      headers: githubHeaders(token),
      body: JSON.stringify({
        message: input.message,
        content,
        branch,
        sha: currentData?.sha,
        committer: getCommitIdentity(),
        author: getCommitIdentity(),
      }),
    })

    const data = await res.json().catch(() => null) as { commit?: { html_url?: string }, message?: string } | null

    if (!res.ok) {
      return {
        configured: true,
        committed: false,
        path: input.path,
        error: data?.message ?? `GitHub HTTP ${res.status}`,
      }
    }

    const result: PublicationResult['github'] = {
      configured: true,
      committed: true,
      path: input.path,
      commitUrl: data?.commit?.html_url,
    }

    if (input.createPullRequest && branch !== targetBranch) {
      const prUrl = await createPullRequest(owner, repo, branch, targetBranch, input.prTitle ?? input.message, input.prBody)
      if (prUrl) {
        result.pullRequestUrl = prUrl
      }
    }

    return result
  } catch (error) {
    return {
      configured: true,
      committed: false,
      path: input.path,
      error: error instanceof Error ? error.message : 'Erreur GitHub inconnue',
    }
  }
}

async function ensureGitHubBranch(owner: string, repo: string, branchName: string, baseBranch: string, token: string) {
  const branchUrl = `https://api.github.com/repos/${owner}/${repo}/branches/${encodeURIComponent(branchName)}`
  const branchRes = await fetch(branchUrl, { headers: githubHeaders(token), cache: 'no-store' })

  if (branchRes.ok) {
    return
  }

  const baseUrl = `https://api.github.com/repos/${owner}/${repo}/branches/${encodeURIComponent(baseBranch)}`
  const baseRes = await fetch(baseUrl, { headers: githubHeaders(token), cache: 'no-store' })

  if (!baseRes.ok) {
    throw new Error(`Impossible de recuperer la branche de base ${baseBranch}`)
  }

  const baseData = await baseRes.json() as { commit: { sha: string } }
  const refUrl = `https://api.github.com/repos/${owner}/${repo}/git/refs`
  const createRes = await fetch(refUrl, {
    method: 'POST',
    headers: githubHeaders(token),
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: baseData.commit.sha,
    }),
  })

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => null)
    throw new Error(errorData?.message ?? `Impossible de creer la branche ${branchName}`)
  }
}

async function createPullRequest(owner: string, repo: string, headBranch: string, baseBranch: string, title: string, body?: string) {
  const listUrl = `https://api.github.com/repos/${owner}/${repo}/pulls?head=${encodeURIComponent(owner + ':' + headBranch)}&base=${encodeURIComponent(baseBranch)}&state=open`
  const listRes = await fetch(listUrl, { headers: githubHeaders(process.env.GITHUB_TOKEN!), cache: 'no-store' })
  if (listRes.ok) {
    const prs = await listRes.json() as Array<{ html_url?: string }>
    if (prs.length > 0) return prs[0].html_url
  }

  const createUrl = `https://api.github.com/repos/${owner}/${repo}/pulls`
  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: githubHeaders(process.env.GITHUB_TOKEN!),
    body: JSON.stringify({
      title,
      head: headBranch,
      base: baseBranch,
      body,
      maintainer_can_modify: true,
    }),
  })

  if (!createRes.ok) {
    return null
  }

  const data = await createRes.json() as { html_url?: string }
  return data.html_url ?? null
}

async function triggerDeployHook(siteId: string): Promise<PublicationResult['vercel']> {
  const hook = getDeployHook(siteId)
  if (!hook) return { configured: false, triggered: false, hookName: siteId }

  try {
    const res = await fetch(hook, { method: 'POST', cache: 'no-store' })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return {
        configured: true,
        triggered: false,
        hookName: siteId,
        error: text || `Vercel HTTP ${res.status}`,
      }
    }

    return { configured: true, triggered: true, hookName: siteId }
  } catch (error) {
    return {
      configured: true,
      triggered: false,
      hookName: siteId,
      error: error instanceof Error ? error.message : 'Erreur Vercel inconnue',
    }
  }
}

function isGitHubConfigured() {
  const repository = process.env.GITHUB_REPOSITORY
  const ownerRepo = process.env.GITHUB_OWNER && process.env.GITHUB_REPO
  return Boolean(process.env.GITHUB_TOKEN && (repository || ownerRepo))
}

function getRepositoryLabel() {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY
  if (process.env.GITHUB_OWNER && process.env.GITHUB_REPO) {
    return `${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}`
  }
  return 'non_configure'
}

function getGitHubBranch() {
  return process.env.GITHUB_BRANCH || 'main'
}

function getGitHubPublishBranchName(siteId: string) {
  const prefix = (process.env.GITHUB_PUBLISH_BRANCH_PREFIX ?? 'super-admin/').replace(/\/+$|^\/+/, '')
  const raw = `${prefix}/${siteId}`
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\-_/]+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^-+|-+$/g, '')
}

function getCommitIdentity() {
  return {
    name: process.env.GITHUB_COMMIT_AUTHOR_NAME || 'LYSMA Super Admin',
    email: process.env.GITHUB_COMMIT_AUTHOR_EMAIL || 'lysmasolutions+noreply@gmail.com',
  }
}

function githubHeaders(token: string) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function getDeployHooksMap() {
  const raw = process.env.VERCEL_DEPLOY_HOOKS
  if (!raw) return null

  try {
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return null
  }
}

function getDeployHook(siteId: string) {
  const map = getDeployHooksMap()
  if (map?.[siteId]) return map[siteId]

  const key = `VERCEL_DEPLOY_HOOK_${siteId.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`
  return process.env[key]
}

function encodePath(value: string) {
  return value.split('/').map(encodeURIComponent).join('/')
}
