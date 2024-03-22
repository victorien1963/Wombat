import React, { useEffect, useContext } from 'react'
import { DraftContext } from '../components/ContextProvider'
import { SuggestPersona, Loading } from '../components'

function Module3() {
  const { module3: module, setDraft } = useContext(DraftContext)
  const setModule = (data) => {
    setDraft({ module3: data })
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
    setDraft({ module3: module })
    if (recoverTarget >= 0) {
      setCursor(recoverTarget)
      setRecoverTarget(-1)
    } else {
      setHistory((prevState) => [...prevState.slice(0, cursor + 1), module])
      setCursor((prevState) => prevState + 1)
    }
  }, [module])

  const handleInputChange = (label, index, value) => {
    setModule({
      ...module,
      [label]: module[label]
        ? module[label].map((l, i) => (i === index ? [...value] : l))
        : [[...value]],
    })
  }
  const handlePicChange = (index, value) => {
    setModule({
      ...module,
      pics: module.pics.map((l, i) => (i === index ? value : l)),
    })
  }
  const handlePicSelect = (i) =>
    setModule({
      ...module,
      picSelect: module.picSelect === i ? undefined : i,
    })

  // inserts
  const handleInsert = (label, value) => {
    console.log(label, value)
    if (value.some((v) => !v.type)) {
      setModule({
        ...module,
        [label]: module.inserts
          ? [...module.inserts.filter((i) => i.type), ...value]
          : [...value],
      })
    } else {
      setModule({
        ...module,
        [label]: module.inserts ? [...module.inserts, ...value] : [...value],
      })
    }
  }
  const handleInsertChange = (index, value) => {
    setModule({
      ...module,
      inserts: module.inserts.map((l, i) => (i === index ? value : l)),
    })
  }
  const handleInsertDelete = (index) => {
    setModule({
      ...module,
      inserts: module.inserts
        ? module.inserts.filter((ps, i) => i !== index)
        : [],
    })
  }
  const handleInsertResort = (label, startIndex, endIndex) => {
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
        <SuggestPersona
          setting={{
            module,
            handleInputChange,
            handlePicSelect,
            handlePicChange,
            handleInsert,
            handleInsertChange,
            handleInsertDelete,
            handleInsertResort,
          }}
        />
      </div>
    </div>
  )
}

export default Module3
