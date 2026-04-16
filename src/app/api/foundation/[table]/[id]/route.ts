import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminSession } from '@/lib/assert-admin'
import { sanitizeLongText, sanitizeString, sanitizeUuid } from '@/lib/sanitize'
import { sendFoundationSubmissionStatusUpdate } from '@/lib/email'

const TABLES = {
  applications: {
    table: 'foundation_applications',
    statuses: ['new', 'reviewing', 'accepted', 'waitlisted', 'rejected'],
  },
  partners: {
    table: 'foundation_partners',
    statuses: ['new', 'reviewing', 'active', 'declined'],
  },
  volunteers: {
    table: 'foundation_volunteers',
    statuses: ['new', 'reviewing', 'active', 'inactive'],
  },
  sponsors: {
    table: 'foundation_sponsors',
    statuses: ['new', 'contacted', 'confirmed', 'declined'],
  },
} as const

type TableKey = keyof typeof TABLES

const FETCH_COLUMNS: Record<TableKey, string> = {
  applications: 'status, full_name, email, program_title',
  partners: 'status, contact_name, email, organisation_name',
  volunteers: 'status, full_name, email',
  sponsors: 'status, full_name, email, inquiry_type',
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  const auth = await assertAdminSession()
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status })

  const { table, id } = await params
  if (!(table in TABLES)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  const cleanId = sanitizeUuid(id)
  if (!cleanId) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const config = TABLES[table as TableKey]
  const updates: Record<string, unknown> = {}
  if (typeof body.status === 'string') {
    const status = sanitizeString(body.status)
    if (!(config.statuses as readonly string[]).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    updates.status = status
  }
  if (typeof body.admin_notes === 'string' || body.admin_notes === null) {
    updates.admin_notes = body.admin_notes === null ? null : sanitizeLongText(body.admin_notes)
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const key = table as TableKey
  const { data: existing, error: fetchError } = await supabase
    .from(config.table)
    .select(FETCH_COLUMNS[key])
    .eq('id', cleanId)
    .maybeSingle()

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  type Fetched = {
    status: string
    email: string
    full_name?: string
    program_title?: string
    contact_name?: string
    organisation_name?: string
    inquiry_type?: string
  }
  const row = existing as unknown as Fetched
  const prevStatus = String(row.status ?? '')
  const nextStatus = typeof updates.status === 'string' ? updates.status : null

  const { error } = await supabase.from(config.table).update(updates).eq('id', cleanId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (nextStatus && nextStatus !== prevStatus) {
    try {
      if (key === 'applications' && row.full_name && row.program_title) {
        await sendFoundationSubmissionStatusUpdate({
          table: 'applications',
          recipientEmail: row.email,
          recipientName: row.full_name,
          newStatus: nextStatus,
          programTitle: row.program_title,
        })
      } else if (key === 'partners' && row.contact_name && row.organisation_name) {
        await sendFoundationSubmissionStatusUpdate({
          table: 'partners',
          recipientEmail: row.email,
          recipientName: row.contact_name,
          newStatus: nextStatus,
          orgName: row.organisation_name,
        })
      } else if (key === 'volunteers' && row.full_name) {
        await sendFoundationSubmissionStatusUpdate({
          table: 'volunteers',
          recipientEmail: row.email,
          recipientName: row.full_name,
          newStatus: nextStatus,
        })
      } else if (key === 'sponsors' && row.full_name) {
        const inquiryType = row.inquiry_type === 'donate' ? 'donate' : 'sponsor'
        await sendFoundationSubmissionStatusUpdate({
          table: 'sponsors',
          recipientEmail: row.email,
          recipientName: row.full_name,
          newStatus: nextStatus,
          inquiryType,
        })
      }
    } catch (err) {
      console.error('[Foundation] Status update notification email failed:', err)
    }
  }

  return NextResponse.json({ success: true })
}
