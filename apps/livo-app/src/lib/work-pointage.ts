export function hasConflictingWorkshopPointage(
  activeFichePointage: unknown,
  activeExternalPointage: unknown
) {
  return Boolean(activeFichePointage || activeExternalPointage)
}
