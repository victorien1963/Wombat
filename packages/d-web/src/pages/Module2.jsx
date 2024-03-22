/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useContext } from 'react'
import { ButtonGroup, Button, Dropdown } from 'react-bootstrap'
import { DraftContext } from '../components/ContextProvider'
import {
  SuggestProduct,
  SuggestMatrix,
  SuggestDesign,
  SuggestWeak,
  SuggestInovation,
  Loading,
} from '../components'

function Module2() {
  const { module2: module, setDraft } = useContext(DraftContext)
  const setModule = (data) => {
    setDraft({ module2: data })
  }

  // undo and redo
  const {
    cursor,
    setCursor,
    history,
    setHistory,
    recoverTarget,
    setRecoverTarget,
  } = useContext(DraftContext)
  useEffect(() => {
    setHistory([module])
    setCursor(-1)
    setRecoverTarget(-1)
  }, [])

  useEffect(() => {
    if (recoverTarget !== -1) setModule(history[recoverTarget])
  }, [recoverTarget])

  useEffect(() => {
    setDraft({ module2: module })
    if (recoverTarget >= 0) {
      setCursor(recoverTarget)
      setRecoverTarget(-1)
    } else {
      setHistory((prevState) => [...prevState.slice(0, cursor + 1), module])
      setCursor((prevState) => prevState + 1)
    }
  }, [module])
  const { topic, purpose } = module

  const handleInterrupt = () =>
    setModule({
      ...module,
      generating: false,
      t: Date.now(),
    })

  const handleInputChange = (label, index, value) =>
    setModule({
      ...module,
      [label]: module[label].map((l, i) => (i === index ? [...value] : l)),
    })

  // for matrix
  const handleMatrixChange = (label, value) => {
    setModule({
      ...module,
      matrix: value,
    })
  }
  const handleCardAdd = (label, value) => {
    let max = 0
    if (!module[label]) {
      setModule({
        ...module,
        [label]: [value || ['', '', max + 1]],
      })
      return
    }
    module[label].forEach((p) => {
      max = Math.max(p[2], max)
    })
    setModule({
      ...module,
      [label]: [...module[label], value || ['', '', max + 1]],
    })
  }
  const handleCardDelete = (label, i) => {
    setModule({
      ...module,
      [label]: module[label].filter((item, index) => index !== i),
    })
  }
  const handleCardResort = (label, startIndex, endIndex) => {
    try {
      const result = Array.from(module[label])
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      setModule({
        ...module,
        [label]: result,
      })
    } catch (e) {
      console.log(e)
    }
  }

  const [tab, setTab] = useState('競品分析')
  const tabs = {
    競品分析: (
      <SuggestProduct
        setting={{ module: module.product, tab, handleInputChange }}
      />
    ),
    產品矩陣分析: (
      <SuggestMatrix
        setting={{
          module: module.product,
          matrix: module.matrix,
          tab,
          handleCardAdd,
          handleInputChange,
          handleMatrixChange,
        }}
      />
    ),
    設計趨勢_列表模式: (
      <SuggestDesign
        setting={{
          tab,
          module: module.design,
          handleInputChange,
          handleCardAdd,
          handleCardDelete,
          handleCardResort,
        }}
      />
    ),
    設計趨勢_圖表模式: (
      <SuggestDesign
        setting={{
          tab,
          module: module.design,
          handleInputChange,
          handleCardAdd,
          handleCardDelete,
          handleCardResort,
        }}
      />
    ),
    痛點分析_列表模式: (
      <SuggestWeak
        setting={{
          tab,
          module: module.weak,
          handleInputChange,
          handleCardAdd,
          handleCardDelete,
          handleCardResort,
        }}
      />
    ),
    痛點分析_圖表模式: (
      <SuggestWeak
        setting={{
          tab,
          module: module.weak,
          handleInputChange,
          handleCardAdd,
          handleCardDelete,
          handleCardResort,
        }}
      />
    ),
    創新機會_產品創新: (
      <SuggestInovation
        setting={{
          tab,
          module: module.inovation ? module.inovation['產品創新'] || [] : [],
          handleInputChange: (label, index, value) => {
            setModule({
              ...module,
              [label]: {
                ...module[label],
                產品創新: module[label]['產品創新'].map((l, i) =>
                  i === index ? [...value] : l
                ),
              },
            })
          },
        }}
      />
    ),
    創新機會_服務創新: (
      <SuggestInovation
        setting={{
          tab,
          module: module.inovation ? module.inovation['服務創新'] || [] : [],
          handleInputChange: (label, index, value) =>
            setModule({
              ...module,
              [label]: {
                ...module[label],
                服務創新: module[label]['服務創新'].map((l, i) =>
                  i === index ? [...value] : l
                ),
              },
            }),
        }}
      />
    ),
    創新機會_商業模式: (
      <SuggestInovation
        setting={{
          tab,
          module: module.inovation ? module.inovation['商業模式'] || [] : [],
          handleInputChange: (label, index, value) =>
            setModule({
              ...module,
              [label]: {
                ...module[label],
                商業模式: module[label]['商業模式'].map((l, i) =>
                  i === index ? [...value] : l
                ),
              },
            }),
        }}
      />
    ),
    創新機會_環境建設: (
      <SuggestInovation
        setting={{
          tab,
          module: module.inovation ? module.inovation['環境建設'] || [] : [],
          handleInputChange: (label, index, value) =>
            setModule({
              ...module,
              [label]: {
                ...module[label],
                環境建設: module[label]['環境建設'].map((l, i) =>
                  i === index ? [...value] : l
                ),
              },
            }),
        }}
      />
    ),
  }
  const tabsDropDown = {
    設計趨勢: [
      {
        label: '列表模式',
        value: '設計趨勢_列表模式',
      },
      {
        label: '圖表模式',
        value: '設計趨勢_圖表模式',
      },
    ],
    痛點分析: [
      {
        label: '列表模式',
        value: '痛點分析_列表模式',
      },
      {
        label: '圖表模式',
        value: '痛點分析_圖表模式',
      },
    ],
    創新機會: [
      {
        label: '產品創新',
        value: '創新機會_產品創新',
      },
      {
        label: '服務創新',
        value: '創新機會_服務創新',
      },
      {
        label: '商業模式',
        value: '創新機會_商業模式',
      },
      {
        label: '環境建設',
        value: '創新機會_環境建設',
      },
    ],
  }

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="h-8 d-flex w-100">
        {topic && (
          <h4 className="m-auto">
            {`${purpose}地區 ${topic} 的${tab.split('_')[0]}${
              tab.startsWith('創新機會_') ? ` — ${tab.split('_')[1]}` : ''
            }`}
          </h4>
        )}
      </div>
      <div className="w-100 d-flex h-7">
        <ButtonGroup
          className="w-50 d-flex mb-0 mx-auto px-3 py-1"
          aria-label="Basic"
        >
          {Array.from(
            new Set(Object.keys(tabs).map((t) => t.split('_')[0]))
          ).map((t, i) =>
            tabsDropDown[t] ? (
              <Dropdown key={i} className="my-auto h-100 w-20">
                <Dropdown.Toggle
                  className={`fs-7 h-100 w-100 ${
                    i === 4 ? 'rounded-0 rounded-end' : 'rounded-0'
                  }`}
                  id="dropdown-basic"
                  variant="light"
                  active={tab.split('_')[0] === t}
                >
                  {t === '創新機會'
                    ? tab.split('_')[0] === t
                      ? tab.split('_')[1]
                      : '產品創新'
                    : t}
                </Dropdown.Toggle>

                <Dropdown.Menu className="px-1 py-1">
                  {tabsDropDown[t].map(({ label, value }) => (
                    <Dropdown.Item key={value} onClick={() => setTab(value)}>
                      {label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                key={t}
                active={tab.split('_')[0] === t}
                onClick={() =>
                  setTab(t === '創新機會' ? '創新機會_產品創新' : t)
                }
                className="h-100 w-20 mx-auto text-dai"
                variant="light"
                size="sm"
              >
                {t}
              </Button>
            )
          )}
        </ButtonGroup>
      </div>
      <div
        className="h-100 d-flex position-relative"
        style={{ overflowY: 'auto', overflowX: 'hidden' }}
      >
        <Loading
          setting={{
            time: module.time,
            show: module.generating,
            step: module.step,
            process: module.process,
            max: module.max,
            handleInterrupt,
          }}
        />
        {tabs[tab]}
      </div>
    </div>
  )
}

export default Module2
