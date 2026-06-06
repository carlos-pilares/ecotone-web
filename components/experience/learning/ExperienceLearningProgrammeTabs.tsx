'use client'

import { useState } from 'react'

import { ExperienceLearningProgrammeFlowPanel } from '@/components/experience/learning/ExperienceLearningProgrammeFlowPanel'
import { ExperienceLearningTypicalDayPanel } from '@/components/experience/learning/ExperienceLearningTypicalDayPanel'
import type { ExperienceLearningContent } from '@/lib/experienceLearningTypes'

type ProgrammeTab = 'how-it-works' | 'typical-day'

type Props = Pick<
  ExperienceLearningContent,
  | 'programmeFlow'
  | 'typicalDay'
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
  programmeSectionEyebrow,
  programmeSectionTitle,
  howItWorksPillTitle,
  typicalDayPillTitle,
  programmeFlowIntro,
  typicalDayIntro,
}: Props) {
  const [activeTab, setActiveTab] = useState<ProgrammeTab>('how-it-works')
  const tabs: { id: ProgrammeTab; label: string }[] = [
    { id: 'how-it-works', label: howItWorksPillTitle?.trim() || 'How it works' },
    { id: 'typical-day', label: typicalDayPillTitle?.trim() || 'Typical day' },
  ]

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
                aria-selected={activeTab === tab.id}
                aria-controls={`el-programme-panel-${tab.id}`}
                className={`exp-learning-programme-tabs__tab${activeTab === tab.id ? ' is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className="exp-learning-programme-tabs__panel"
            role="tabpanel"
            id={`el-programme-panel-${activeTab}`}
            aria-labelledby={`el-programme-tab-${activeTab}`}
          >
            {activeTab === 'how-it-works' ? (
              <ExperienceLearningProgrammeFlowPanel content={programmeFlow} intro={programmeFlowIntro} />
            ) : null}
            {activeTab === 'typical-day' ? (
              <ExperienceLearningTypicalDayPanel content={typicalDay} intro={typicalDayIntro} />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
