import type {
  DocBlock,
  DocCodeSpan,
  DocComment,
  DocEscapedText,
  DocFencedCode,
  DocParagraph,
  DocPlainText,
  DocSection,
} from '@microsoft/tsdoc'
import { DocNodeKind, StandardTags, StringBuilder } from '@microsoft/tsdoc'
import {
  type ApiFunction,
  ApiInterface,
  type ApiItem,
  type ApiModel,
  type ApiPropertyItem,
} from '@microsoft/api-extractor-model'
import {
  ApiDocumentedItem,
  ApiItemKind,
  ApiReturnTypeMixin,
} from '@microsoft/api-extractor-model'

interface IJsonApiItemParamType {
  type: string
  description: string
  defaultValue?: string
  required: boolean
}

interface IJsonApiItemBase {
  name: string
  description: string
  examples?: string[]
  remarks?: string[]
  kind: IJsonApiItemKind
  see?: string[]
}

interface IJsonApiItemComponent extends IJsonApiItemBase {
  kind: 'component'
  props: Record<string, IJsonApiItemParamType>
}

interface IJsonApiItemFunction extends IJsonApiItemBase {
  kind: 'hook' | 'utility'
  params: Record<string, IJsonApiItemParamType>
  returnType: Record<string, IJsonApiItemParamType> | string
}

type IJsonApiItemKind = 'component' | 'hook' | 'utility'
type IJsonApiItem = IJsonApiItemComponent | IJsonApiItemFunction

export class JsonDocumenter {
  private readonly _apiModel: ApiModel
  private readonly _namesToFilter: string[]

  public constructor(apiModel: ApiModel, namesToFilter: string[]) {
    this._apiModel = apiModel
    this._namesToFilter = namesToFilter
  }

  public generate() {
    const output: {
      components: IJsonApiItemComponent[]
      hooks: IJsonApiItemFunction[]
      utilities: IJsonApiItemFunction[]
    } = {
      components: [],
      hooks: [],
      utilities: [],
    }

    for (const apiPackage of this._apiModel.packages) {
      const packageMembers: readonly ApiItem[] = apiPackage.members[0].members.filter(
        apiItem => this._namesToFilter.length === 0 || this._namesToFilter.includes(apiItem.displayName),
      )

      for (const apiMember of packageMembers) {
        // Extract the @kind value from the API item
        const kindValue = this._getKindFromApiItem(apiMember)

        // Check if the kind value matches the category
        if (kindValue) {
          const apiItem = this._generateJsonApiItem(apiMember, kindValue)

          switch (kindValue) {
            case 'component':
              output.components.push(apiItem as IJsonApiItemComponent)
              break
            case 'hook':
              output.hooks.push(apiItem as IJsonApiItemFunction)
              break
            case 'utility':
              output.utilities.push(apiItem as IJsonApiItemFunction)
              break
          }
        }
      }
    }

    return output
  }

  private _getKindFromApiItem(apiItem: ApiItem): IJsonApiItemKind | undefined {
    if (apiItem instanceof ApiDocumentedItem && apiItem.tsdocComment) {
      const kindBlock: DocBlock | undefined = apiItem.tsdocComment.customBlocks.find(
        block => block.blockTag.tagNameWithUpperCase === '@KIND',
      )

      if (kindBlock) {
        const kindValue = kindBlock.content.getChildNodes().filter(node => node.kind === DocNodeKind.Paragraph)[0] as DocParagraph
        return this._renderParagraph(kindValue) as IJsonApiItemKind
      }
    }
    return undefined
  }

  private _generateJsonApiItem(apiItem: ApiItem, kind: IJsonApiItemKind): IJsonApiItem {
    const output: Partial<IJsonApiItem> = {
      name: apiItem.displayName,
      kind,
    }

    if (apiItem instanceof ApiDocumentedItem) {
      const tsdocComment: DocComment | undefined = apiItem.tsdocComment

      if (tsdocComment) {
        if (tsdocComment.summarySection)
          output.description = this._renderMarkdown(tsdocComment.summarySection)

        if (tsdocComment.remarksBlock)
          output.remarks = this._renderMarkdown(tsdocComment.remarksBlock.content).split('\n')

        if (tsdocComment.customBlocks.length > 0) {
          const exampleBlocks: DocBlock[] = tsdocComment.customBlocks.filter(
            block => block.blockTag.tagNameWithUpperCase === StandardTags.example.tagNameWithUpperCase,
          )
          const seeBlocks: DocBlock[] = tsdocComment.customBlocks.filter(
            block => block.blockTag.tagNameWithUpperCase === StandardTags.see.tagNameWithUpperCase,
          )

          output.examples = exampleBlocks.map(exampleBlock => this._renderMarkdown(exampleBlock.content))
          output.see = seeBlocks.map(seeBlock => this._renderMarkdown(seeBlock.content))
        }
      }

      const props = this._getPropsFromComponent(apiItem, kind)

      if (kind === 'component') {
        if (props)
          (output as IJsonApiItemComponent).props = this._renderComponentProperties(apiItem as ApiFunction, props)
      }
      else {
        if (props)
          (output as IJsonApiItemFunction).params = this._renderComponentProperties(apiItem as ApiFunction, props)
        else
          (output as IJsonApiItemFunction).params = this._renderParameters(apiItem as ApiFunction)
        if (ApiReturnTypeMixin.isBaseClassOf(apiItem))
          (output as IJsonApiItemFunction).returnType = (apiItem as ApiReturnTypeMixin).returnTypeExcerpt.text
      }
    }

    return output as IJsonApiItem
  }

  private _getPropsFromComponent(apiItem: ApiItem, kind: IJsonApiItemKind): ApiInterface | null {
    const suffix = kind === 'component' ? 'Props' : 'Options'

    let name = apiItem.displayName

    if (kind === 'hook')
      name = name.replace('use', '')

    name += suffix

    return this._apiModel.members[0].members[0].members.find(member => member.displayName === name && member.kind
      === ApiItemKind.Interface,
    ) as ApiInterface ?? null
  }

  private _renderComponentProperties(apiItem: ApiFunction, props: ApiInterface): Record<string, IJsonApiItemParamType> {
    const properties: Record<string, IJsonApiItemParamType> = {}

    if (!props)
      return properties

    if (props instanceof ApiInterface) {
      for (const apiMember of props.members) {
        if (apiMember.kind === ApiItemKind.Property || apiMember.kind === ApiItemKind.PropertySignature) {
          const apiProperty: ApiPropertyItem = apiMember as ApiPropertyItem
          if (apiProperty.isEventProperty)
            continue

          properties[apiProperty.displayName] = {
            type: apiProperty.propertyTypeExcerpt.text,
            description: apiProperty.tsdocComment?.summarySection ? this._renderMarkdown(apiProperty.tsdocComment?.summarySection) : '',
            required: !apiProperty.isOptional,
          }

          const customBlocks = apiProperty.tsdocComment?.customBlocks ?? []
          const defaultValueBlock = customBlocks.find(
            block => block.blockTag.tagNameWithUpperCase === '@DEFAULTVALUE',
          )

          if (defaultValueBlock) {
            const defaultValue = defaultValueBlock.content.getChildNodes().filter(node => node.kind === DocNodeKind.Paragraph)[0] as DocParagraph
            properties[apiProperty.displayName].defaultValue = this._renderParagraph(defaultValue)
          }
        }
      }
    }

    return properties
  }

  private _renderParameters(apiItem: ApiFunction): Record<string, IJsonApiItemParamType> {
    const parameters: Record<string, IJsonApiItemParamType> = {}

    for (const parameter of apiItem.parameters) {
      parameters[parameter.name] = {
        type: parameter.parameterTypeExcerpt.text,
        description: parameter.tsdocParamBlock?.content ? this._renderMarkdown(parameter.tsdocParamBlock.content) : '',
        required: !parameter.isOptional,
      }
    }

    return parameters
  }

  private _renderMarkdown(docSection: DocSection): string {
    const builder: StringBuilder = new StringBuilder()
    for (const node of docSection.nodes) {
      if (node.kind === DocNodeKind.Paragraph)
        builder.append(this._renderParagraph(node as DocParagraph))
      else if (node.kind === DocNodeKind.SoftBreak)
        continue
      else if (node.kind === DocNodeKind.FencedCode)
        builder.append(this._renderFencedCode(node as DocFencedCode))
      else
        builder.append(node.toString())
    }
    return builder.toString()
  }

  private _renderParagraph(node: DocParagraph): string {
    const builder: StringBuilder = new StringBuilder()
    for (const childNode of node.getChildNodes()) {
      switch (childNode.kind) {
        case DocNodeKind.CodeSpan:
          builder.append('`')
          builder.append((childNode as DocCodeSpan).code)
          builder.append('`')
          break
        case DocNodeKind.EscapedText:
          builder.append((childNode as DocEscapedText).decodedText)
          break
        case DocNodeKind.PlainText:
          builder.append((childNode as DocPlainText).text)
          break
        case DocNodeKind.SoftBreak:
          continue
        default:
          builder.append(childNode.toString())
      }
    }
    return builder.toString()
  }

  private _renderFencedCode(node: DocFencedCode): string {
    const builder: StringBuilder = new StringBuilder()
    builder.append('```')
    if (node.language)
      builder.append(node.language)

    builder.append('\n')
    builder.append(node.code)
    builder.append('\n```')
    return builder.toString()
  }
}
