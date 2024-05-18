import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { framer, withBackgroundColor } from 'framer-plugin'
import * as htmlToImage from 'html-to-image'

import {
  Button,
  FramerPlugin,
  ListControls,
  NumberControls,
  SegmentedControls,
  Separator,
  capitalizeWords,
  useSelection,
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

export function App() {
  const [store, _, setStoreValue, isStoreLoaded] = useStore<{
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

  const selection = useSelection()

  useEffect(() => {
    if (!isStoreLoaded)
      return

    if (scheme === 'mono' && count !== 2)
      setStoreValue('count', 2)
    else if (scheme === 'tetrade' && count !== 4)
      setStoreValue('count', 4)
    else if (scheme === 'triade' && count !== 3)
      setStoreValue('count', 3)
  }, [scheme])

  useEffect(() => {
    if (mode === 'gradient' && count !== 2)
      setStoreValue('count', 2)
  }, [mode])

  useEffect(() => {
    if (!autoGenerate || !isStoreLoaded)
      return

    setStoreValue('colors', generateColorSet({ count, scheme, variation }))
  }, [scheme, count, variation])

  useEffect(() => {
    if (colors.length === 0 && isStoreLoaded)
      setStoreValue('colors', generateColorSet({ count, scheme, variation }))
  }, [])

  if (!isStoreLoaded)
    return null

  const updateSelectionColor = (color: ColorData) => {
    selection.forEach((node) => {
      if (withBackgroundColor(node)) {
        node.setAttributes({
          backgroundColor: color.hex,
        })
      }
    })
  }

  return (
    <FramerPlugin autoResize={true}>
      <div
        id="colors"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${colors.length}, minmax(100px, 1fr))`,
          // width: "100%",
          minWidth: '300px',
          borderRadius: '8px',
          overflow: 'hidden',
          background:
            mode === 'gradient'
              ? `linear-gradient(to right, ${colors
                  .map(color => color.hex)
                  .join(', ')})`
              : 'transparent',
          backgroundBlendMode: 'soft-light',
          backdropFilter: mode === 'gradient' ? 'blur(10px)' : 'none',
        }}
      >
        {colors.map((color, index) => (
          <motion.div
            key={index}
            style={{
              height: '200px',
              backgroundColor: mode === 'hues' ? color.hex : 'transparent',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
              color: color.luminance > 0.5 ? 'black' : 'white',
              width: '100%',
              cursor: 'pointer',
              padding: '16px',
              fontWeight: 600,
              textAlign:
                index === 0
                  ? 'left'
                  : index === colors.length - 1
                    ? 'right'
                    : 'center',
            }}
            onClick={() => {
              updateSelectionColor(color)
            }}
          >
            {showColorDetails && (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignSelf:
                      index === 0
                        ? 'flex-start'
                        : index === colors.length - 1
                          ? 'flex-end'
                          : 'center',
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
        value={count}
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
        onChange={(value: ColorSchemeType) => setStoreValue('scheme', value)}
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
