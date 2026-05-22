type GitHubContentResponse = {
  sha?: string
  content?: string
  encoding?: string
}

type CommitFileInput = {
  path: string
  content: string
  message: string
  encoding?: 'utf8' | 'base64'
}

export type PublicationResult = {
  github: {
    configured: boolean
    committed: boolean
    path?: string
    commitUrl?: string
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
    vercelReady: Boolean(siteId ? getDeployHook(siteId) : getDeployHooksMap()),
  }
}

export async function publishShowcaseFile(
  siteId: string,
  input: CommitFileInput,
): Promise<PublicationResult> {
  const github = await commitFileToGitHub(input)
  const vercel = github.committed
    ? await triggerDeployHook(siteId)
    : {
        configured: Boolean(getDeployHook(siteId)),
        triggered: false,
        hookName: siteId,
      }

  return { github, vercel }
}

async function commitFileToGitHub(input: CommitFileInput): Promise<PublicationResult['github']> {
  if (!isGitHubConfigured()) {
    return { configured: false, committed: false, path: input.path }
  }

  const token = process.env.GITHUB_TOKEN!
  const owner = process.env.GITHUB_OWNER ?? process.env.GITHUB_REPOSITORY?.split('/')[0]
  const repo = process.env.GITHUB_REPO ?? process.env.GITHUB_REPOSITORY?.split('/')[1]
  const branch = getGitHubBranch()
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodePath(input.path)}`

  try {
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

    return {
      configured: true,
      committed: true,
      path: input.path,
      commitUrl: data?.commit?.html_url,
    }
  } catch (error) {
    return {
      configured: true,
      committed: false,
      path: input.path,
      error: error instanceof Error ? error.message : 'Erreur GitHub inconnue',
    }
  }
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
