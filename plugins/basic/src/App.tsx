import { framer } from 'framer-plugin'
import './App.css'

import {
  Button,
  FramerPlugin,
  InputGroup,
  ListControls,
  NumberControls,
  SegmentedControls,
  Spinner,
  TextControls,
  icons,
  useStore,
} from '@triozer/framer-toolbox'
import { useState } from 'react'

type Resizable = 'both' | 'width' | 'height' | 'none'

export function App() {
  const { store, setStoreValue, isStoreLoaded } = useStore<{
    autoResize: boolean
    resizable: Resizable
    text: string
    number: number
    list: string
  }>('my-plugin-store', {
    autoResize: false,
    resizable: 'both',
    text: 'Framer Toolbox',
    number: 0,
    list: 'item1',
  })

  const { autoResize, resizable, text, number, list } = store

  const [additionnalItem, setAdditionnalItem] = useState(0)

  const handleAddSvg = async () => {
    await framer.addSVG({
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#999" d="M20 0v8h-8L4 0ZM4 8h8l8 8h-8v8l-8-8Z"/></svg>`,
      name: 'Logo.svg',
    })
  }

  if (!isStoreLoaded)
    return <Spinner />

  return (
    <FramerPlugin
      autoResize={autoResize}
      uiOptions={{
        resizable: resizable === 'both' ? true : resizable === 'none' ? false : resizable,
        minHeight: 300,
        minWidth: 500,
      }}
    >
      <SegmentedControls
        title="Auto Resize"
        value={autoResize}
        items={[
          {
            label: 'Enabled',
            value: true,
          },
          {
            label: 'Disabled',
            value: false,
          },
        ]}
        onChange={value => setStoreValue('autoResize', value)}
      />
      <SegmentedControls
        title="Resizable"
        value={resizable}
        items={[
          { label: 'Both', value: 'both' },
          { label: 'Width', value: 'width' },
          { label: 'Height', value: 'height' },
          { label: 'None', value: 'none' },
        ]}
        onChange={value => setStoreValue('resizable', value as Resizable)}
      />
      <SegmentedControls
        title="Icons"
        items={[
          {
            icon: icons.minus,
            value: 'minus',
          },
          {
            icon: icons.plus,
            value: 'plus',
          },
          {
            icon: icons.cross,
            value: 'cross',
          },
        ]}
        defaultValue="plus"
      />
      <SegmentedControls
        direction="vertical"
        title="Vertical Segmented Controls"
        items={[
          { value: 'label-1', label: 'Label 1' },
          { value: 'label-2', label: 'Label 2' },
          { value: 'label-3', label: 'Label 3' },
        ]}
      />
      <TextControls
        title="Text Controls"
        placeholder="Type something..."
        value={text}
        onChange={value => setStoreValue('text', value)}
      />
      <TextControls
        title="Text Controls (Icon)"
        icon="search"
        placeholder="Search..."
      />
      <InputGroup title="Inline Number">
        <NumberControls
          value={number}
          onChange={value => setStoreValue('number', value)}
        />
        <ListControls
          items={[
            {
              label: 'Pixels',
              value: 'px',
            },
            {
              value: 'em',
            },
            {
              label: '%',
              value: 'percentage',
            },
          ]}
        />
      </InputGroup>
      <NumberControls
        title="Number Controls (Stepper)"
        value={number}
        onChange={value => setStoreValue('number', value)}
        stepper
      />
      <NumberControls
        title="Number Controls (Slider)"
        value={number}
        onChange={value => setStoreValue('number', value)}
        slider
      />
      <ListControls
        title="List Controls"
        items={[
          {
            label: 'Item 1',
            value: 'item1',
          },
          {
            label: 'Item 2',
            value: 'item2',
          },
        ]}
        value={list}
        onChange={value => setStoreValue('list', value)}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr 1fr',
          width: '100%',
          gap: '10px',
        }}
      >
        <Button
          variant="destructive"
          onClick={async () => {
            setAdditionnalItem(prev => Math.max(0, prev - 1))
          }}
        >
          Remove last added node
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            setAdditionnalItem(prev => prev + 1)
          }}
        >
          Add item to DOM
        </Button>
        <Button onClick={handleAddSvg}>Add SVG</Button>
      </div>
      {additionnalItem > 0
      && Array.from({ length: additionnalItem }).map((_, index) => (
        <div key={index}>
          ---
          {index}
          ---
        </div>
      ))}
    </FramerPlugin>
  )
}
