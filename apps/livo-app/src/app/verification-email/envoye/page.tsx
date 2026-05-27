import { VerificationEmailEnvoyeClient } from './VerificationEmailEnvoyeClient'

type Props = {
  searchParams: Promise<{ email?: string }>
}

export default async function VerificationEmailEnvoyePage({ searchParams }: Props) {
  const { email } = await searchParams
  return <VerificationEmailEnvoyeClient initialEmail={email ?? ''} />
}
