import React, { useEffect, useContext } from 'react'
import { DraftContext } from '../components/ContextProvider'
import { SuggestUserStory, Loading } from '../components'

function Module4() {
  const { module4: module, setDraft } = useContext(DraftContext)
  const setModule = (data) => {
    setDraft({ module4: data })
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
    setDraft({ module4: module })
    if (recoverTarget >= 0) {
      setCursor(recoverTarget)
      setRecoverTarget(-1)
    } else {
      setHistory((prevState) => [...prevState.slice(0, cursor + 1), module])
      setCursor((prevState) => prevState + 1)
    }
  }, [module])

  const handleInputChange = (label, index, value) =>
    setModule({
      ...module,
      [label]: module[label].map((l, i) => (i === index ? [...value] : l)),
    })
  const handleEmotionChange = (newEmotion) =>
    setModule({
      ...module,
      emotions: newEmotion,
    })
  const handlePicChange = (index, value) =>
    setModule({
      ...module,
      pics: module.pics.map((l, i) => (i === index ? value : l)),
    })

  const handleInterrupt = () =>
    setModule({
      ...module,
      generating: false,
      t: Date.now(),
    })

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="h-100 d-flex position-relative">
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
        <SuggestUserStory
          setting={{
            module,
            handleInputChange,
            handleEmotionChange,
            handlePicChange,
          }}
        />
      </div>
    </div>
  )
}

export default Module4
