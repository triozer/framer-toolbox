import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { framer } from 'framer-plugin'
import * as htmlToImage from 'html-to-image'

import {
  Button,
  FramerPlugin,
  ListControls,
  NumberControls,
  SegmentedControls,
  Separator,
  capitalizeWords,
  useStore,
} from '@triozer/framer-toolbox'

import type {
  ColorData,
  ColorSchemeType,
  ColorVariationType,
} from './utils/color'
import {
  COLOR_SCHEMES,
  COLOR_VARIATIONS,
  generateColorSet,
} from './utils/color'
import './App.css'

function getTextAlign(index: number, length: number) {
  switch (length) {
    case 1:
      return 'center'
    case 2:
      return index === 0 ? 'left' : 'right'
    case 3:
      return index === 0 ? 'left' : index === 2 ? 'center' : 'right'
    case 4:
      return index % 2 === 0 ? 'left' : 'right'
    case 5:
      return index % 3 === 0 ? 'left' : index === 1 ? 'center' : 'right'
    case 6:
      return index % 3 === 0 ? 'left' : (index % 3 === 2 ? 'right' : 'center')
  }
}

function getAlignSelf(index: number, length: number) {
  switch (length) {
    case 1:
      return 'center'
    case 2:
      return index === 0 ? 'flex-start' : 'flex-end'
    case 3:
      return index === 0 ? 'flex-start' : index === 2 ? 'center' : 'flex-end'
    case 4:
      return index % 2 === 0 ? 'flex-start' : 'flex-end'
    case 5:
      return index % 3 === 0 ? 'flex-start' : index === 1 ? 'center' : 'flex-end'
    case 6:
      return index % 3 === 0 ? 'flex-start' : (index % 3 === 2 ? 'flex-end' : 'center')
  }
}

export function App() {
  const { store, setStore, setStoreValue, isStoreLoaded } = useStore<{
    count: number
    scheme: ColorSchemeType
    variation: ColorVariationType
    colors: ColorData[]
    mode: 'hues' | 'gradient'
    showColorDetails: boolean
    detailsOpen: boolean
    autoGenerate: boolean
  }>('store', {
    count: 2,
    scheme: 'analogic',
    variation: 'hard',
    colors: [],
    mode: 'hues',
    showColorDetails: true,
    detailsOpen: false,
    autoGenerate: true,
  })

  const { count, scheme, variation, colors, mode, showColorDetails, autoGenerate } = store

  const generateColors = (options: {
    count: number
    scheme: ColorSchemeType
    variation: ColorVariationType
  }) => {
    if (!autoGenerate || !isStoreLoaded)
      return

    setStoreValue('colors', generateColorSet(options))
  }

  useEffect(() => {
    if (isStoreLoaded && autoGenerate)
      generateColors({ count, scheme, variation })
  }, [count, scheme, variation, autoGenerate, isStoreLoaded])

  useEffect(() => {
    if (mode === 'gradient' && count === 1)
      setStoreValue('count', 2)
  }, [mode])

  if (!isStoreLoaded)
    return null

  return (
    <FramerPlugin autoResize={true} uiOptions={{ resizable: 'width' }}>
      <div
        id="colors"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
          minWidth: '330px',
          height: '275px',
          borderRadius: '8px',
          overflow: 'hidden',
          background:
      mode === 'gradient'
        ? `linear-gradient(to right, ${colors.map(color => color.hex).join(', ')})`
        : 'transparent',
          backgroundBlendMode: 'soft-light',
          backdropFilter: mode === 'gradient' ? 'blur(10px)' : 'none',
        }}
      >
        {colors.map((color, index) => (
          <motion.div
            key={index}
            {...(showColorDetails ? {} : { title: `${color.ratio}:1\n${color.name}\n${color.hex}` })}
            style={{
              backgroundColor: mode === 'hues' ? color.hex : 'transparent',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
              color: color.luminance > 0.5 ? 'black' : 'white',
              cursor: 'pointer',
              padding: '16px',
              fontWeight: 600,
              textAlign: getTextAlign(index, colors.length),
              width: (() => {
                switch (colors.length) {
                  case 1:
                    return '100%'
                  case 2:
                    return '50%'
                  case 3:
                    return index === 2 ? '100%' : '50%'
                  case 4:
                    return '50%'
                  case 5:
                    return index < 3 ? '33.33%' : '50%'
                  case 6:
                  default:
                    return '33.33%'
                }
              })(),
              height: colors.length > 2 ? '50%' : '100%',
            }}
          >
            {showColorDetails && (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignSelf: getAlignSelf(index, colors.length),
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                    version="1.1"
                    viewBox="0 0 512 512"
                  >
                    <g>
                      <g>
                        <path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M256,457.143V54.857    c111.088,0,201.143,90.054,201.143,201.143S367.088,457.143,256,457.143z" />
                      </g>
                    </g>
                  </svg>
                  <span>
                    {color.ratio}
                    :1
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span>{color.name}</span>
                  <span>{color.hex}</span>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      <SegmentedControls
        title="Mode"
        value={mode}
        items={[
          {
            value: 'hues',
            label: 'Hues',
          },
          {
            value: 'gradient',
            label: 'Gradient',
          },
        ]}
        onChange={(value: 'hues' | 'gradient') => setStoreValue('mode', value)}
      />

      <NumberControls
        title="Count"
        value={scheme === 'mono' ? 2 : count}
        onChange={e => setStoreValue('count', e)}
        min={mode === 'hues' ? 1 : 2}
        max={6}
        disabled={scheme === 'mono'}
        stepper={true}
      />

      <ListControls
        title="Scheme"
        items={[...COLOR_SCHEMES].sort().map(scheme => ({
          value: scheme,
          label: capitalizeWords(scheme),
        }))}
        value={scheme}
        onChange={(value: ColorSchemeType) => {
          if (value === 'mono') {
            setStore({
              ...store,
              scheme: 'mono',
              count: 2,
            })
            return
          }

          if (value === 'tetrade') {
            setStore({
              ...store,
              scheme: 'tetrade',
              count: 4,
            })
            return
          }

          if (value === 'triade') {
            setStore({
              ...store,
              scheme: 'triade',
              count: 3,
            })
            return
          }

          setStoreValue('scheme', value)
        }}
      />

      <ListControls
        title="Variation"
        items={[...COLOR_VARIATIONS].sort().map(variation => ({
          value: variation,
          label: capitalizeWords(variation),
        }))}
        value={variation}
        onChange={(value: ColorVariationType) => setStoreValue('variation', value)}
      />

      <SegmentedControls
        title="Show Details"
        value={showColorDetails}
        onChange={(value: boolean) => setStoreValue('showColorDetails', value)}
      />

      <SegmentedControls
        title="Auto Generate"
        value={autoGenerate}
        onChange={(value: boolean) => setStoreValue('autoGenerate', value)}
      />

      <Separator />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          width: '100%',
        }}
      >
        <Button
          variant="secondary"
          onClick={async () => {
            const node = document.getElementById('colors')
            if (!node)
              return

            const image = await htmlToImage.toPng(node)

            framer.addImage({
              name: 'Palette',
              image,
            })
          }}
        >
          Export
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setStoreValue(
              'colors',
              generateColorSet({ count, scheme, variation }),
            )
          }}
        >
          Generate
        </Button>
      </div>
    </FramerPlugin>
  )
}
