import React, { useState, useEffect, useContext } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'
import { DraftContext } from '../components/ContextProvider'
import { SuggestForm, SuggestCard, Loading } from '../components'

function Module1() {
  const { module1: module, setDraft } = useContext(DraftContext)
  const setModule = (data) => {
    setDraft({ module1: data })
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
    setDraft({ module1: module })
    if (recoverTarget >= 0) {
      setCursor(recoverTarget)
      setRecoverTarget(-1)
    } else {
      setHistory((prevState) => [...prevState.slice(0, cursor + 1), module])
      setCursor((prevState) => prevState + 1)
    }
  }, [module])
  const { topic, region } = module

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
  const handleCardAdd = (label) => {
    let max = 0
    module[label].forEach((p) => {
      max = Math.max(p[3], max)
    })

    setModule({
      ...module,
      [label]: [...module[label], ['', '', '', max + 1]],
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

  const [tab, setTab] = useState('圖表模式')
  const tabs = {
    列表模式: (
      <SuggestForm
        setting={{
          module,
          handleInputChange,
          handleCardAdd,
          handleCardDelete,
          handleCardResort,
        }}
      />
    ),
    圖表模式: (
      <SuggestCard
        setting={{
          module,
          handleInputChange,
          handleCardAdd,
          handleCardDelete,
          handleCardResort,
        }}
      />
    ),
    // memo模式: <SuggestMemo setting={{ module, handleInputChange }} />,
  }

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="h-8 d-flex">
        {topic ? (
          <h4 className="m-auto text-center">
            {region}地區 {topic} 的PESTEL分析
          </h4>
        ) : (
          <h4 className="m-auto text-center">PESTEL分析</h4>
        )}
      </div>
      <ButtonGroup className="w-25 h-7 mb-0 mx-auto px-3" aria-label="Basic">
        {Object.keys(tabs).map((t) => (
          <Button
            key={t}
            active={tab === t}
            onClick={() => setTab(t)}
            className="w-75 mx-auto my-2 text-dai"
            variant="light"
            size="sm"
          >
            {t}
          </Button>
        ))}
      </ButtonGroup>
      <div className="h-84 d-flex position-relative">
        <Loading
          setting={{
            time: module.time,
            show: module.generating,
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

export default Module1
