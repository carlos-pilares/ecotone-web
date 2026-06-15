'use client'

import { useMemo, useState } from 'react'

import { ExperienceLearningApplicationProcessPanel, applicationProcessTabHasContent } from '@/components/experience/learning/ExperienceLearningApplicationProcessPanel'
import { ExperienceLearningMentorPanel, mentorTabHasContent } from '@/components/experience/learning/ExperienceLearningMentorPanel'
import { ExperienceLearningProgrammeFlowPanel } from '@/components/experience/learning/ExperienceLearningProgrammeFlowPanel'
import { ExperienceLearningTypicalDayPanel } from '@/components/experience/learning/ExperienceLearningTypicalDayPanel'
import type { ExperienceLearningContent } from '@/lib/experienceLearningTypes'

type ProgrammeTabId = 'how-it-works' | 'typical-day' | 'mentor' | 'application-process'

type Props = Pick<
  ExperienceLearningContent,
  | 'programmeFlow'
  | 'typicalDay'
  | 'mentor'
  | 'applicationProcess'
  | 'programmeSectionEyebrow'
  | 'programmeSectionTitle'
  | 'howItWorksPillTitle'
  | 'typicalDayPillTitle'
  | 'programmeFlowIntro'
  | 'typicalDayIntro'
>

export function ExperienceLearningProgrammeTabs({
  programmeFlow,
  typicalDay,
  mentor,
  applicationProcess,
  programmeSectionEyebrow,
  programmeSectionTitle,
  howItWorksPillTitle,
  typicalDayPillTitle,
  programmeFlowIntro,
  typicalDayIntro,
}: Props) {
  const tabs = useMemo(() => {
    const list: { id: ProgrammeTabId; label: string }[] = [
      { id: 'how-it-works', label: howItWorksPillTitle?.trim() || 'How it works' },
      { id: 'typical-day', label: typicalDayPillTitle?.trim() || 'Typical day' },
    ]
    if (mentorTabHasContent(mentor)) {
      list.push({ id: 'mentor', label: mentor.tabLabel?.trim() || 'Mentor' })
    }
    if (applicationProcessTabHasContent(applicationProcess)) {
      list.push({
        id: 'application-process',
        label: applicationProcess.tabLabel?.trim() || 'Application process',
      })
    }
    return list
  }, [howItWorksPillTitle, typicalDayPillTitle, mentor, applicationProcess])

  const [activeTab, setActiveTab] = useState<ProgrammeTabId>('how-it-works')

  const resolvedTab = tabs.some((tab) => tab.id === activeTab) ? activeTab : tabs[0]?.id ?? 'how-it-works'

  return (
    <section className="content-section fade" id="programme">
      <div className="content-inner">
        <div className="eyebrow">{programmeSectionEyebrow?.trim() || 'Programme'}</div>
        <h2 className="h2">{programmeSectionTitle?.trim() || 'How you learn in the field'}</h2>

        <div className="exp-learning-programme-tabs">
          <div className="exp-learning-programme-tabs__list" role="tablist" aria-label="Programme details">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`el-programme-tab-${tab.id}`}
                aria-selected={resolvedTab === tab.id}
                aria-controls={`el-programme-panel-${tab.id}`}
                className={`exp-learning-programme-tabs__tab${resolvedTab === tab.id ? ' is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className="exp-learning-programme-tabs__panel"
            role="tabpanel"
            id={`el-programme-panel-${resolvedTab}`}
            aria-labelledby={`el-programme-tab-${resolvedTab}`}
          >
            {resolvedTab === 'how-it-works' ? (
              <ExperienceLearningProgrammeFlowPanel content={programmeFlow} intro={programmeFlowIntro} />
            ) : null}
            {resolvedTab === 'typical-day' ? (
              <ExperienceLearningTypicalDayPanel content={typicalDay} intro={typicalDayIntro} />
            ) : null}
            {resolvedTab === 'mentor' && mentorTabHasContent(mentor) ? (
              <ExperienceLearningMentorPanel mentor={mentor} />
            ) : null}
            {resolvedTab === 'application-process' && applicationProcessTabHasContent(applicationProcess) ? (
              <ExperienceLearningApplicationProcessPanel applicationProcess={applicationProcess} />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
