"use client"

import { AgreementForm } from "./agreement-form"

interface Country {
  code: string
  name: string
  region: string
  capital: string
}

interface Agreement {
  id: string
  name: string
  country: string
  type: string
  status: string
  startDate?: string
  endDate?: string
  description?: string
  latestUpdate: string
  updatedAt: string
  keyPoints?: string[]
  attachments?: Array<{
    url: string
    name: string
  }>
}

interface EditAgreementFormProps {
  agreement: Agreement
  country: Country
}

export function EditAgreementForm({ agreement, country }: EditAgreementFormProps) {
  return (
    <AgreementForm 
      agreement={agreement}
      country={country}
      onSubmit={async (data) => {
        // Handle form submission
        console.log('Form submitted:', data)
      }}
    />
  )
} 