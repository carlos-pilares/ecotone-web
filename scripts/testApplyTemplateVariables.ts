/**
 * Merge-variable unit checks (no Resend).
 * Run: npx tsx scripts/testApplyTemplateVariables.ts
 */
import assert from 'node:assert/strict'

import { applyTemplateVariables } from '../lib/applyTemplateVariables'

// Missing variables → as-is (backwards compatible)
{
  const subject = 'Your enquiry for [[leadContext]]'
  const body = 'Hi [[firstName]],\n\nThanks for [[leadContext]].'
  assert.equal(applyTemplateVariables(subject, undefined), subject)
  assert.equal(applyTemplateVariables(body, null), body)
  assert.equal(applyTemplateVariables(subject, 'not-an-object'), subject)
}

// Documented merge example
{
  const subject = 'Your enquiry for [[leadContext]]'
  const body =
    'Hi [[firstName]],\n\nThanks for your interest in [[leadContext]] for [[partySize]] travellers around [[travelDate]].'
  const variables = {
    firstName: 'Carlos',
    leadContext: 'Andean Cloud Forest 3D · 2N',
    partySize: '4',
    travelDate: 'June 2027',
  }
  assert.equal(applyTemplateVariables(subject, variables), 'Your enquiry for Andean Cloud Forest 3D · 2N')
  assert.equal(
    applyTemplateVariables(body, variables),
    'Hi Carlos,\n\nThanks for your interest in Andean Cloud Forest 3D · 2N for 4 travellers around June 2027.',
  )
}

// Missing / blank / null keys → empty string (no throw)
{
  const template = 'A:[[a]] B:[[b]] C:[[c]] D:[[d]]'
  assert.equal(
    applyTemplateVariables(template, { a: 'ok', b: '', c: null, d: undefined }),
    'A:ok B: C: D:',
  )
  assert.equal(applyTemplateVariables('Hello [[missing]]!', {}), 'Hello !')
}

// Any key works (not hardcoded)
{
  assert.equal(
    applyTemplateVariables('X [[customField]] Y', { customField: 'works' }),
    'X works Y',
  )
}

// Numbers / booleans stringify
{
  assert.equal(applyTemplateVariables('n=[[n]]', { n: 4 }), 'n=4')
}

console.log('testApplyTemplateVariables: all assertions passed')
