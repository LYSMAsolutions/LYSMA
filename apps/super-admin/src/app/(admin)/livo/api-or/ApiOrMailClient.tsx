'use client'

import { useMemo, useState } from 'react'
import styles from './page.module.css'

type GarageOption = {
  id: string
  nom: string
  ville: string | null
  ownerEmail: string
}

type Props = {
  garages: GarageOption[]
  endpointUrl: string
}

const DEFAULT_FROM = 'contact@lysmasolutions.fr'
const DEFAULT_API_KEY_PLACEHOLDER = 'CLE_API_DEDIEE_A_L_EDITEUR'

function buildJsonExample(garageId: string, softwareName: string) {
  return JSON.stringify(
    {
      garageId,
      externalNumber: 'OR-2026-1487',
      sourceSoftware: softwareName || 'Nom du logiciel',
      clientName: 'Jean Dupont',
      vehicleLabel: 'Peugeot 308',
      immatriculation: 'AB-123-CD',
      vin: 'VF3XXXXXXXXXXXXXX',
      operation: 'Remplacement pare-chocs avant\nPeinture aile gauche',
      soldHours: 4.5,
      soldAmountHT: 420,
    },
    null,
    2
  )
}

function buildResponseExample() {
  return JSON.stringify(
    {
      success: true,
      order: {
        id: 'clx_livo_order_id',
        externalNumber: 'OR-2026-1487',
        status: 'OUVERT',
      },
      qrPayload:
        '{"type":"LIVO_WORK_ORDER","version":1,"externalNumber":"OR-2026-1487","clientName":"Jean Dupont"}',
    },
    null,
    2
  )
}

export function ApiOrMailClient({ garages, endpointUrl }: Props) {
  const [garageId, setGarageId] = useState(garages[0]?.id ?? '')
  const [developerEmail, setDeveloperEmail] = useState('')
  const [fromEmail, setFromEmail] = useState(DEFAULT_FROM)
  const [softwareName, setSoftwareName] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [copied, setCopied] = useState('')

  const selectedGarage = garages.find((garage) => garage.id === garageId) ?? garages[0]
  const apiKeyForMail = apiKey.trim() || DEFAULT_API_KEY_PLACEHOLDER
  const jsonExample = buildJsonExample(selectedGarage?.id ?? 'GARAGE_ID_LIVO', softwareName)
  const responseExample = buildResponseExample()

  const subject = selectedGarage
    ? `Integration API LIVO - OR atelier - ${selectedGarage.nom}`
    : 'Integration API LIVO - OR atelier'

  const mailBody = useMemo(() => {
    const garageLine = selectedGarage
      ? `${selectedGarage.nom}${selectedGarage.ville ? ` (${selectedGarage.ville})` : ''}`
      : 'Garage LIVO'

    return `Bonjour,

Je vous transmets les informations techniques pour connecter votre logiciel de facturation atelier a LIVO.

Objectif
Lorsqu'un ordre de reparation est cree dans votre logiciel, vous envoyez ses informations a LIVO. LIVO vous retourne un payload QR a imprimer sur l'OR. Le compagnon scanne ensuite ce QR dans l'atelier pour pointer et depointer son temps, sans ressaisie par l'admin.

Garage concerne
- Garage: ${garageLine}
- garageId LIVO: ${selectedGarage?.id ?? 'GARAGE_ID_LIVO'}

Endpoint
POST ${endpointUrl}

Authentification
Header obligatoire:
x-internal-api-key: ${apiKeyForMail}

Body JSON attendu
${jsonExample}

Reponse attendue
${responseExample}

Regle importante pour le QR code
Vous devez generer et imprimer un QR code contenant exactement la valeur de qrPayload retournee par l'API. Ne pas modifier, reformater ou extraire seulement le numero OR.

Comportement dans LIVO
- Si l'OR existe deja, LIVO le met a jour avec les informations recues.
- Si l'OR n'existe pas, LIVO cree une fiche miroir OR externe.
- Le compagnon ne choisit aucun taux horaire: il scanne l'OR et pointe/depointe uniquement.
- Le taux horaire est renseigne par l'admin LIVO au moment de la cloture de l'OR.

Champs minimums obligatoires
- garageId
- externalNumber

Champs recommandes
- sourceSoftware
- clientName
- vehicleLabel
- immatriculation
- vin
- operation
- soldHours
- soldAmountHT

Tests de validation
1. Creer un OR de test dans votre logiciel.
2. Appeler l'endpoint LIVO avec les donnees de l'OR.
3. Recuperer qrPayload dans la reponse.
4. Imprimer un QR code contenant qrPayload.
5. Scanner ce QR dans LIVO Atelier.
6. Verifier que l'OR remonte avec le client, le vehicule et les travaux.

Pour les echanges techniques, vous pouvez repondre a cette adresse: ${fromEmail || DEFAULT_FROM}

Cordialement,
LYSMA Solutions`
  }, [apiKeyForMail, endpointUrl, fromEmail, jsonExample, responseExample, selectedGarage])

  const mailtoHref = `mailto:${encodeURIComponent(developerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    window.setTimeout(() => setCopied(''), 1600)
  }

  return (
    <div className={styles.grid}>
      <section className={styles.panel}>
        <h2>Parametres du mail</h2>
        <label>
          <span>Garage LIVO</span>
          <select value={garageId} onChange={(event) => setGarageId(event.target.value)}>
            {garages.map((garage) => (
              <option key={garage.id} value={garage.id}>
                {garage.nom}{garage.ville ? ` - ${garage.ville}` : ''}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Email developpeur / editeur</span>
          <input
            type="email"
            value={developerEmail}
            onChange={(event) => setDeveloperEmail(event.target.value)}
            placeholder="tech@logiciel-facturation.fr"
          />
        </label>
        <label>
          <span>Adresse d'envoi / reponse</span>
          <input
            type="email"
            value={fromEmail}
            onChange={(event) => setFromEmail(event.target.value)}
            placeholder={DEFAULT_FROM}
          />
        </label>
        <label>
          <span>Nom du logiciel</span>
          <input
            value={softwareName}
            onChange={(event) => setSoftwareName(event.target.value)}
            placeholder="Ex: logiciel atelier"
          />
        </label>
        <label>
          <span>Cle API a communiquer</span>
          <input
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder={DEFAULT_API_KEY_PLACEHOLDER}
          />
        </label>

        <div className={styles.actions}>
          <button type="button" onClick={() => copy(mailBody, 'mail')}>
            Copier le mail
          </button>
          <a href={mailtoHref}>Ouvrir le mail</a>
        </div>

        {copied && <p className={styles.copied}>Copie: {copied}</p>}
      </section>

      <section className={styles.preview}>
        <div className={styles.previewHeader}>
          <div>
            <span>Objet</span>
            <strong>{subject}</strong>
          </div>
          <button type="button" onClick={() => copy(jsonExample, 'JSON exemple')}>
            Copier JSON
          </button>
        </div>
        <textarea readOnly value={mailBody} />
      </section>
    </div>
  )
}
