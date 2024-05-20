import * as fs from 'node:fs'
import process from 'node:process'
import {
  ApiModel,
} from '@microsoft/api-extractor-model'
import { JsonDocumenter } from './JsonDocumenter'

const args = process.argv.slice(2)

const showJson = args.includes('--showJson')
const summary = args.includes('--summary')
const namesToFilter = args.filter(arg => arg.startsWith('--name=')).map(arg => arg.split('=')[1])

const apiModel: ApiModel = new ApiModel()
apiModel.loadPackage('docs/framer-toolbox.api.json')

console.log(`Generating JSON documentation for ${apiModel.packages[0].name}...`)

const jsonDocumenter = new JsonDocumenter(apiModel, namesToFilter)

const json = jsonDocumenter.generate()

if (showJson)
  console.log(JSON.stringify(json, null, 2))

if (summary) {
  console.log({
    components: {
      total: json.components.length,
      names: json.components.map(component => component.name),
    },
    hooks: {
      total: json.hooks.length,
      names: json.hooks.map(hook => hook.name),
    },
    utilities: {
      total: json.utilities.length,
      names: json.utilities.map(utility => utility.name),
    },
  })
}

if (namesToFilter.length > 0) {
  console.log(`Filtering by names: ${namesToFilter.join(', ')}`)

  const filteredJson = {
    components: json.components.filter(component => namesToFilter.includes(component.name)),
    hooks: json.hooks.filter(hook => namesToFilter.includes(hook.name)),
    utilities: json.utilities.filter(utility => namesToFilter.includes(utility.name)),
  }

  console.log(JSON.stringify(filteredJson, null, 2))
}

fs.writeFileSync('docs/framer-toolbox.json', JSON.stringify(json, null, 2))